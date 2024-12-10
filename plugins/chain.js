import { ethers } from 'ethers'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig() // access env vars like this: config.alchemyPolygonKey

  function getChainName(chainId) {
    let chain = chains.find(chain => chain.chainId == chainId)

    if (chain) {
      return chain.name
    }

    return 'Unsupported Network'
  }

  function getFallbackProvider(networkId) {
    let chain = chains.find(chain => chain.chainId == networkId)

    // choose random rpc from chain.rpcs array
    const randomRpc = chain.rpcs[Math.floor(Math.random() * chain.rpcs.length)]

    let urls = [ randomRpc ]

    if (urls) {
      const providers = urls.map(url => new ethers.providers.JsonRpcProvider(url))
      return new ethers.providers.FallbackProvider(providers, 1) // return fallback provider
    } else {
      return null
    }
  }

  function getRpcByChainId(chainId) {
    let chain = chains.find(chain => chain.chainId == chainId)
    const randomRpc = chain.rpcs[Math.floor(Math.random() * chain.rpcs.length)]
    return randomRpc
  }

  async function switchOrAddChain(ethereum, networkName) {
    // get network id from chains
    let chain = chains.find(chain => chain.name == networkName)
    const randomRpc = chain.rpcs[Math.floor(Math.random() * chain.rpcs.length)]
    let chainId = chain.chainId

    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: ethers.utils.hexValue(chainId),
          },
        ],
      })
    } catch (error) {
      if (error.code === 4902) {
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: ethers.utils.hexValue(chainId),
              chainName: networkName,
              nativeCurrency: {
                name: chain.currency,
                symbol: chain.currency,
                decimals: 18,
              },
              rpcUrls: ["https://rpc.degen.tips"],
              blockExplorerUrls: [chain.blockExplorer],
            },
          ],
        })
      }
    }
  }

  return {
    provide: {
      getChainName: chainId => getChainName(chainId),
      getFallbackProvider: chainId => getFallbackProvider(chainId),
      getRpcByChainId: chainId => getRpcByChainId(chainId),
      switchOrAddChain: (ethereum, networkName) => switchOrAddChain(ethereum, networkName),
    },
  }
})

const chains = [
  { 
    chainId: 666666666, 
    name: "Degen", 
    currency: "DEGEN", 
    rpcs: ["https://degen-mainnet.g.alchemy.com/v2/Vn3jRzC23Ej4LYpz_TVNs20T9r-LigaO"], 
    blockExplorer: "https://explorer.degen.tips" 
  },
];
