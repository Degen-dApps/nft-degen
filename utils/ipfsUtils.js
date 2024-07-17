import axios from "axios";
import { ThirdwebStorage } from "@thirdweb-dev/storage";

export async function uploadFileToThirdWeb(file) {
  const config = useRuntimeConfig();

  const storage = new ThirdwebStorage({
    clientId: config.thirdwebClientId,
  });

  const fileUri = await storage.upload(file);

  return fileUri;
}

export async function getIpfsUrl(url) {
  let cid;

  if (url.startsWith("https://ipfs.io/ipfs/")) {
    cid = url.replace("https://ipfs.io/ipfs/", "");
  } else if (url.startsWith("https://cloudflare-ipfs.com/ipfs/")) {
    cid = url.replace("https://cloudflare-ipfs.com/ipfs/", "");
  } else if (url.startsWith("https://gateway.pinata.cloud/ipfs/")) {
    cid = url.replace("https://gateway.pinata.cloud/ipfs/", "");
  } else if (url.startsWith("https://ipfs.infura.io/ipfs/")) {
    cid = url.replace("https://ipfs.infura.io/ipfs/", "");
  } else if (url.startsWith("https://ipfs.fleek.co/ipfs/")) {
    cid = url.replace("https://ipfs.fleek.co/ipfs/", "");
  } else if (url.startsWith("https://dweb.link/ipfs/")) {
    cid = url.replace("https://dweb.link/ipfs/", "");
  } else if (url.startsWith("https://ipfs.itslit.org/ipfs/")) { 
    cid = url.replace("https://ipfs.itslit.org/ipfs/", "");
  } else if (url.startsWith("https://ipfs.dylmusic.com/ipfs/")) {
    cid = url.replace("https://ipfs.dylmusic.com/ipfs/", "");
  } else if (url.startsWith("https://ipfs.filebase.io/ipfs/")) {
    cid = url.replace("https://ipfs.filebase.io/ipfs/", "");
  } else if (url.includes("pinata.cloud/ipfs/")) {
    cid = url.split("pinata.cloud/ipfs/")[1];
  }

  if (cid) {
    return String("ipfs://" + cid);
  }
  
  return null;
}

export async function getWorkingUrl(url) {
  let ipfsUrl = url

  if (url.startsWith("http")) {
    // fetch head() with axios to check if the url is working
    try {
      const response = await axios.head(url)
      if (response.status === 200) {
        return { success: true, url: url, format: response.headers['content-type'] }
      } else {
        ipfsUrl = await getIpfsUrl(url)
      }
    } catch (error) {
      ipfsUrl = await getIpfsUrl(url)
    }
  }

  if (!ipfsUrl) {
    return url
  }

  const ipfsGateways = [
    'https://ipfs.io/ipfs/',
    'https://nftdegeniggy.myfilebase.com/ipfs/',
    'https://ipfs.filebase.io/ipfs/',
    //'https://cloudflare-ipfs.com/ipfs/',
    'https://gateway.pinata.cloud/ipfs/',
    'https://ipfs.itslit.org/ipfs/',
    'https://ipfs.dylmusic.com/ipfs/',
  ]

  if (ipfsUrl.startsWith("ipfs://")) {
    const cid = ipfsUrl.replace("ipfs://", "")

    for (let i = 0; i < ipfsGateways.length; i++) {
      const gatewayUrl = ipfsGateways[i] + cid

      // fetch head() with axios to check if the url is working
      try {
        const response = await axios.head(gatewayUrl)
        if (response.status === 200) {
          return { success: true, url: gatewayUrl, format: response.headers['content-type'] }
        }
      } catch (error) {
        continue
      }
    }
  }

  return url

}