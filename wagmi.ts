import { farcasterMiniApp } from '@farcaster/miniapp-wagmi-connector'
import { http, cookieStorage, createConfig, createStorage } from '@wagmi/vue'
import { injected, metaMask, walletConnect } from '@wagmi/vue/connectors'
import type { Chain } from 'viem'

export const degenChain: Chain = {
  id: 666666666,
  name: 'Degen Chain',
  nativeCurrency: {
    name: 'Degen',
    symbol: 'DEGEN',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [
        'https://rpc.degen.tips',
        import.meta.env.VITE_CUSTOM_RPC_URL as string,
      ],
    },
  },
  blockExplorers: {
    default: {
      name: 'Degenscan',
      url: 'https://explorer.degen.tips',
      apiUrl: 'https://explorer.degen.tips/api',
    },
  },
  testnet: true,
}

export const config = createConfig({
  chains: [degenChain], 
  connectors: [
    injected(),
    farcasterMiniApp(),
    metaMask(),
    walletConnect({
      projectId: import.meta.env.VITE_WC_PROJECT_ID,
    }),
  ],
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  transports: {
    [degenChain.id]: http(),
  },
})

declare module '@wagmi/vue' {
  interface Register {
    config: typeof config
  }
}
