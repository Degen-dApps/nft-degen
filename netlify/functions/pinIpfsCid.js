const axios = require('axios');

exports.handler = async function (event, context) {
  try {
    const apiKey = process.env.NFTDEGEN_API_KEY; // enter key in environment variables
    const cid = event.queryStringParameters.cid;
    
    const url = `https://api.nftdegen.org/endpoints/ipfs/pin?cid=${cid}&secret=${apiKey}`;

    const response = await axios.get(url);

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