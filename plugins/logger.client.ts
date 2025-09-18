export default defineNuxtPlugin({
  name: 'logger',
  setup(nuxtApp) {
    // Store original console methods before overriding
    const originalConsole = {
      log: console.log,
      //info: console.info,
      //debug: console.debug,
      warn: console.warn,
      error: console.error
    }

    // Vue runtime errors (caught by Vue)
    nuxtApp.vueApp.config.errorHandler = (err, instance, info) => {
      sendLog('error', err, { info }, originalConsole)
      // optional: rethrow so Nuxt's default handler also runs
      // throw err
    }

    // Browser uncaught JS errors
    if (process.client) {
      window.onerror = (msg, src, line, col, error) => {
        sendLog('error', error || msg, { src, line, col }, originalConsole)
      }

      // Unhandled promise rejections
      window.onunhandledrejection = (event) => {
        sendLog('error', event.reason, { type: 'unhandledrejection' }, originalConsole)
      }

      // Override console methods to automatically capture all console calls
      // Override console.log
      console.log = (...args) => {
        originalConsole.log(...args)
        sendLog('log', args[0], args.slice(1), originalConsole)
      }

      // Override console.info
      /*
      console.info = (...args) => {
        originalConsole.info(...args)
        sendLog('info', args[0], args.slice(1), originalConsole)
      }

      // Override console.debug
      console.debug = (...args) => {
        originalConsole.debug(...args)
        sendLog('debug', args[0], args.slice(1), originalConsole)
      }
      */

      // Override console.warn
      console.warn = (...args) => {
        originalConsole.warn(...args)
        sendLog('warn', args[0], args.slice(1), originalConsole)
      }

      // Override console.error
      console.error = (...args) => {
        originalConsole.error(...args)
        sendLog('error', args[0], args.slice(1), originalConsole)
      }
    }
  }
})

// Helper to send logs to your Netlify function
function sendLog(level: 'log' | 'info' | 'debug' | 'warn' | 'error', message: any, meta: any = {}, originalConsole: any) {
  // Debug: Always log to console in development to show it's working
  // Use originalConsole.log to avoid infinite recursion
  if (process.env.NODE_ENV === 'development') {
    originalConsole.log(`[LOGGER PLUGIN] Captured ${level}:`, message, meta)
  }

  // Only send logs to Netlify in production or when explicitly enabled
  if (process.env.NODE_ENV === 'production' || process.env.ENABLE_LOGGING === 'true') {
    fetch('/.netlify/functions/logsUploader', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        level,
        message: message?.message || String(message),
        meta: {
          ...meta,
          timestamp: new Date().toISOString(),
          userAgent: process.client ? navigator.userAgent : undefined,
          url: process.client ? window.location.href : undefined
        }
      })
    }).catch(() => {
      // Don't crash if logging fails
    })
  }
}
