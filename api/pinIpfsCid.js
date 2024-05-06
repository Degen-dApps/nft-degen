const axios = require('axios');

export default async function handler(request, response) {
  try {
    const apiKey = process.env.NFTDEGEN_API_KEY; // enter key in environment variables
    const cid = request.query.cid;
    
    const url = `https://api.nftdegen.org/endpoints/ipfs/pin?cid=${cid}&secret=${apiKey}`;

    const res = await axios.get(url);

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