const axios = require('axios');

exports.handler = async function (event, context) {
  try {
    const apiKey = process.env.LIGHTHOUSE_API_KEY; // enter key in environment variables
    const cid = event.queryStringParameters.cid;

    // make axios post request to pin the cid
    const url = `https://api.lighthouse.storage/api/lighthouse/pin`;
    
    const data = {
      cid: cid
    }

    const response = await axios.post(url, data, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    return {
      statusCode: response.status,
      body: JSON.stringify({ statusText: response.statusText }),
    };
  } catch (error) {
    console.error(error);
    
    return {
      statusCode: response.status,
      body: JSON.stringify({ statusText: error.message, error: error }),
    };
  }
}