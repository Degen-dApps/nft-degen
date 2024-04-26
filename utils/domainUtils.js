import { ethers } from "ethers";

export async function getDomainName(userAddress, signer) {
  const config = useRuntimeConfig();
  
  let provider = signer;

  if (!provider) {
    provider = this.$getFallbackProvider(config.supportedChainId);
  }

  const tldInterface = new ethers.utils.Interface([
    "function defaultNames(address) view returns (string)"
  ]);

  let userDomain = null;

  try {
    const contract = new ethers.Contract(config.punkTldAddress, tldInterface, provider);

    // get user's default domain
    userDomain = await contract.defaultNames(userAddress);
  } catch (e) {
    console.error(e);
  }

  return userDomain;
}

export async function getDomainHolder(domainName, signer) {
  const config = useRuntimeConfig();
  
  let provider = signer;

  if (!provider) {
    provider = this.$getFallbackProvider(config.supportedChainId);
  }

  if (domainName.includes(config.tldName)) {
    domainName = domainName.replace(config.tldName, "");
  }

  const tldInterface = new ethers.utils.Interface([
    "function getDomainHolder(string memory) public view returns(address)"
  ]);

  const contract = new ethers.Contract(config.punkTldAddress, tldInterface, provider);

  // get user's default domain
  const userAddress = await contract.getDomainHolder(domainName);

  return userAddress;
}
