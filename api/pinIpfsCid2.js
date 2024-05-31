const axios = require('axios');

export default async function handler(request, response) {
  try {
    const apiKey = process.env.LIGHTHOUSE_API_KEY; // enter key in environment variables
    const cid = request.query.cid;
    
    // make axios post request to pin the cid
    const url = `https://api.lighthouse.storage/api/lighthouse/pin`;
    
    const data = {
      cid: cid
    }

    const res = await axios.post(url, data, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    return response.status(res.status).json({
      statusText: res.statusText
    });
    
  } catch (error) {
    console.error(error);
    
    return response.status(error.status).json({
      statusText: error.message, 
      error: error
    });
  }
  
};