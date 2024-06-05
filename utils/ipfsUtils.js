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

  return String("ipfs://" + cid);
}