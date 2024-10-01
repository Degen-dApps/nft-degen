<template>
  <div class="row" v-if="featuredNfts.length > 0">
    <NuxtLink v-for="nft in featuredNfts" :key="nft.address" class="col-md-3 text-decoration-none" :to="'/nft/collection?id=' + nft.address">
      <div class="card border mb-3">
        <Image :url="nft.image" :cls="'card-img-top'" :alt="nft.name" />
        <div class="card-body rounded-bottom-3">
          <p class="card-text mb-1"><strong>{{ nft.name }}</strong></p>
          <small class="card-text">{{ formatPrice(nft.price) }} {{ $config.tokenSymbol }}</small>
        </div>
      </div>
    </NuxtLink>
  </div>

  <div class="d-flex justify-content-center mb-3" v-if="waitingData">
    <span class="spinner-border spinner-border-lg" role="status" aria-hidden="true"></span>
  </div>
</template>

<script>
import { ethers } from 'ethers';
import { useEthers } from '~/store/ethers'
import Image from '~/components/Image.vue';
import { fetchCollection, storeCollection } from '~/utils/storageUtils';

export default {
  name: "FeaturedNftsBlockchain",

  data() {
    return {
      featuredNfts: [],
      waitingData: false
    }
  },

  components: {
    Image
  },

  mounted() {
    if (this.$config.nftLaunchpadBondingAddress) {
      this.fetchFeaturedNfts();
    }
  },

  methods: {
    async fetchFeaturedNfts() {
      this.waitingData = true;

      // fetch provider from hardcoded RPCs
      let provider = this.$getFallbackProvider(this.$config.supportedChainId);

      if (this.isActivated && this.chainId === this.$config.supportedChainId) {
        // fetch provider from user's MetaMask
        provider = this.signer;
      }

      // create launchpad contract object
      const launchpadInterface = new ethers.utils.Interface([
        "function getFeaturedNftContracts(uint256 amount) external view returns(address[] memory)"
      ]);

      const launchpadContract = new ethers.Contract(
        this.$config.nftLaunchpadBondingAddress,
        launchpadInterface,
        provider
      );

      // get featured NFTs
      const fNfts = await launchpadContract.getFeaturedNftContracts(8);

      await this.parseNftsArray(fNfts, this.featuredNfts, provider);
    },

    formatPrice(priceWei) {
      if (priceWei === null) {
        return null;
      }

      const price = Number(ethers.utils.formatEther(priceWei));

      if (price > 100) {
        return price.toFixed(0);
      } else if (price > 1) {
        return price.toFixed(2);
      } else if (price > 0.1) {
        return price.toFixed(4);
      } else if (price > 0.01) {
        return price.toFixed(5);
      } else if (price > 0.001) {
        return price.toFixed(6);
      } else if (price > 0.0001) {
        return price.toFixed(7);
      } else if (price > 0.00001) {
        return price.toFixed(8);
      } else if (price > 0.000001) {
        return price.toFixed(9);
      } else {
        return price;
      }
    },

    async parseNftsArray(inputArray, outputArray, provider) {
      const nftInterface = new ethers.utils.Interface([
        "function collectionPreview() public view returns (string memory)",
        "function getMintPrice() public view returns (uint256)",
        "function name() public view returns (string memory)"
      ]);

      // for loop to get NFTs data (price, name & image)
      for (let i = 0; i < inputArray.length; i++) {
        const nftContract = new ethers.Contract(inputArray[i], nftInterface, provider);

        // fetch collection object from storage
        let collection = fetchCollection(window, inputArray[i]);
        
        if (!collection) {
          collection = {
            address: inputArray[i]
          };
        }

        // get collection name
        let cName;

        if (collection?.name) {
          cName = collection.name;
        } else {
          cName = await nftContract.name();
          collection["name"] = cName;
        }

        // get price
        const mintPriceWei = await nftContract.getMintPrice();

        // get image
        let cImage;

        if (collection?.image) {
          cImage = collection.image;
        } else {
          cImage = await nftContract.collectionPreview();
          collection["image"] = cImage;
        }

        // check if collection image uses Spheron IPFS gateway (in that case replace it with the IPFS gateway defined in the config)
        if (collection.image.includes(".ipfs.sphn.link/")) {
          const linkParts = collection.image.split(".ipfs.sphn.link/");
          const cid = linkParts[0].replace("https://", "");
          const newImageLink = this.$config.ipfsGateway + cid + "/" + linkParts[1];
          collection["image"] = newImageLink;
          cImage = newImageLink;
        }

        // store collection object in storage
        storeCollection(window, inputArray[i], collection);

        outputArray.push({
          address: inputArray[i],
          image: cImage,
          name: cName,
          price: mintPriceWei
        });
      }

      this.waitingData = false;
    }
  },

  setup() {
    const { address, chainId, isActivated, signer } = useEthers();

    return { address, chainId, isActivated, signer }
  }
}
</script>