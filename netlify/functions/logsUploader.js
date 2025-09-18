const axios = require("axios")

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" }
  }

  let bodyParsed
  try {
    bodyParsed = JSON.parse(event.body)
  } catch (err) {
    return { statusCode: 400, body: "Invalid JSON" }
  }

  const { level = "info", message, meta } = bodyParsed

  if (!message) {
    return { statusCode: 400, body: "Missing log message" }
  }

  const logEvent = {
    message,
    level,
    ...(meta && { meta })
  }

  const sourceToken = process.env.BETTERSTACK_SOURCE_TOKEN
  const ingestUrl = process.env.BETTERSTACK_INGEST_URL || "https://logs.ingest.betterstack.com"

  try {
    const resp = await axios.post(
      ingestUrl,
      logEvent,
      {
        headers: {
          "Authorization": `Bearer ${sourceToken}`,
          "Content-Type": "application/json"
        }
      }
    )

    // BetterStack returns 202 on success
    if (Number(resp.status) > 200) {
      return { statusCode: 200, body: JSON.stringify({ ok: true }) }
    } else {
      return {
        statusCode: resp.status,
        body: JSON.stringify({ error: resp.data || `HTTP ${resp.status}` })
      }
    }
  } catch (err) {
    // axios error might include response
    if (err.response) {
      return {
        statusCode: err.response.status,
        body: JSON.stringify({ error: err.response.data })
      }
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: err.message })
      }
    }
  }
}
