<template>
  <div class="row" v-if="featuredNfts.length > 0">
    <NuxtLink v-for="nft in featuredNfts" :key="nft.address" class="col-md-3 text-decoration-none" :to="'/nft/collection?id=' + nft.address">
      <div class="card border mb-3">
        <Image :url="nft.image" :cls="'card-img-top'" :alt="nft.name" />
        <div class="card-body rounded-bottom-3">
          <p class="card-text mb-1"><strong>{{ nft.name }}</strong></p>
          <small class="card-text">{{ formatPrice(nft.price) }} {{ $config.public.tokenSymbol }}</small>
        </div>
      </div>
    </NuxtLink>
  </div>

  <div class="d-flex justify-content-center mb-3" v-if="waitingData">
    <span class="spinner-border spinner-border-lg" role="status" aria-hidden="true"></span>
  </div>
</template>

<script>
import { formatEther } from 'viem'
import Image from '@/components/Image.vue'
import { fetchCollection, storeCollection } from '@/utils/browserStorageUtils'
import { getLessDecimals } from '@/utils/numberUtils'
import { useWeb3 } from '@/composables/useWeb3'
import { useAccountData } from '@/composables/useAccountData'

export default {
  name: "FeaturedNftsBlockchain",

  data() {
    return {
      featuredAmount: 8, // number of featured NFTs to fetch
      featuredNfts: [],
      waitingData: false
    }
  },

  components: {
    Image
  },


  mounted() {
    if (this.$config.public.nftLaunchpadBondingAddress) {
      this.fetchFeaturedNfts()
    }
  },

  methods: {
    async fetchFeaturedNfts() {
      this.waitingData = true

      // Get featured NFTs from launchpad contract
      const launchpadContractConfig = {
        address: this.$config.public.nftLaunchpadBondingAddress,
        abi: [
          {
            "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }],
            "name": "getFeaturedNftContracts",
            "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }],
            "stateMutability": "view",
            "type": "function"
          }
        ],
        functionName: 'getFeaturedNftContracts',
        args: [this.featuredAmount]
      }

      try {
        const fNfts = await this.readData(launchpadContractConfig)
        
        if (fNfts) {
          await this.parseNftsArray(fNfts, this.featuredNfts)
        }
      } catch (error) {
        console.error('Error fetching featured NFTs:', error)
      } finally {
        this.waitingData = false
      }
    },

    formatPrice(priceWei) {
      if (priceWei === null) {
        return null
      }

      // Convert from wei to ether using viem
      const price = Number(formatEther(priceWei))
      
      // Use getLessDecimals for formatting
      return getLessDecimals(price)
    },

    async parseNftsArray(inputArray, outputArray) {
      const nftInterface = [
        {
          "inputs": [],
          "name": "collectionPreview",
          "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getMintPrice",
          "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "name",
          "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
          "stateMutability": "view",
          "type": "function"
        }
      ]

      // for loop to get NFTs data (price, name & image)
      for (let i = 0; i < inputArray.length; i++) {
        try {
          // fetch collection object from storage
          let collection = fetchCollection(window, inputArray[i])
          
          if (!collection) {
            collection = {
              address: inputArray[i]
            }
          }

          // get collection name
          let cName

          if (collection?.name) {
            cName = collection.name
          } else {
            const nameContractConfig = {
              address: inputArray[i],
              abi: nftInterface,
              functionName: 'name'
            }
            cName = await this.readData(nameContractConfig)
            if (cName) {
              collection["name"] = cName
            }
          }

          // get price
          const mintPriceContractConfig = {
            address: inputArray[i],
            abi: nftInterface,
            functionName: 'getMintPrice'
          }
          const mintPriceWei = await this.readData(mintPriceContractConfig)

          // get image
          let cImage

          if (collection?.image) {
            cImage = collection.image
          } else {
            const imageContractConfig = {
              address: inputArray[i],
              abi: nftInterface,
              functionName: 'collectionPreview'
            }
            cImage = await this.readData(imageContractConfig)
            if (cImage) {
              collection["image"] = cImage
            }
          }

          // check if collection image uses Spheron IPFS gateway (in that case replace it with the IPFS gateway defined in the config)
          if (collection.image && collection.image.includes(".ipfs.sphn.link/")) {
            const linkParts = collection.image.split(".ipfs.sphn.link/")
            const cid = linkParts[0].replace("https://", "")
            const newImageLink = this.$config.public.ipfsGateway + cid + "/" + linkParts[1]
            collection["image"] = newImageLink
            cImage = newImageLink
          }

          // store collection object in storage
          storeCollection(window, inputArray[i], collection)

          outputArray.push({
            address: inputArray[i],
            image: cImage,
            name: cName,
            price: mintPriceWei
          })
        } catch (error) {
          console.error(`Error processing NFT ${inputArray[i]}:`, error)
        }
      }
    }
  },

  setup() {
    const { readData } = useWeb3()
    const { address, chainId, isActivated } = useAccountData()

    return {
      readData,
      address,
      chainId,
      isActivated
    }
  }
}
</script>
