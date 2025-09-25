<template>
<Head>
  <Title>New NFTs | {{ $config.public.projectMetadataTitle }}</Title>
  <Meta property="og:title" :content="$config.public.projectMetadataTitle" />

  <Meta name="description" :content="$config.public.projectDescription" />

  <Meta property="og:image" :content="$config.public.projectUrl+$config.public.previewImageNftLaunchpad" />
  <Meta property="og:description" :content="$config.public.projectDescription" />

  <Meta name="twitter:image" :content="$config.public.projectUrl+$config.public.previewImageNftLaunchpad" />
  <Meta name="twitter:description" :content="$config.public.projectDescription" />

  <Link rel="canonical" :href="$config.public.projectUrl+'/nft'" />
</Head>

<div class="card border scroll-500">
  <div class="card-body">

    <!--
    <p v-if="!hideBackButton" class="fs-3">
      <i class="bi bi-arrow-left-circle cursor-pointer" @click="$router.back()"></i>
    </p>
    -->

    <h3 class="d-flex flex-row flex-wrap mt-3 mb-3">
      <div class="mb-3 me-auto">NFT Launchpad</div>
      
      <div class="mb-3">
        <NuxtLink class="btn btn-outline-primary btn-sm" to="/nft/create">
          <i class="bi bi-plus-circle"></i> Create
        </NuxtLink>
        <button class="btn btn-outline-primary btn-sm ms-2" data-bs-toggle="modal" data-bs-target="#searchNftModal">
          <i class="bi bi-search"></i> Find
        </button>
      </div>
    </h3>

    <!-- NFT competition alert 
    <div class="alert alert-primary mb-3 text-center" role="alert">
      <NuxtLink to="/post/?id=kjzl6cwe1jw149z0ddpcygc1nhgjdppg1zpr8r4s0j8siaq0bod6u0v5dyaqr2c">
        Create your NFT and win a 2000 {{ $config.public.tokenSymbol }} prize! Hurry up, the competition ends on Friday, 29 September!
      </NuxtLink>
    </div>
    -->

    <NftListDropdown buttonText="New NFTs" />

    <div class="row">
      <NuxtLink v-for="nft in lastNfts" :key="nft.address" class="col-md-3 text-decoration-none" :to="'/nft/collection?id=' + nft.address">
        <div class="card border mb-3">
          <div>
            <Image :url="nft.image" :alt="nft.name" cls="card-img-top" />
            <span v-if="nft.audio" class="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-primary p-2">
              <i class="bi bi-music-note-beamed"></i>
              <span class="visually-hidden">Music NFT</span>
            </span>
            <span v-if="nft.video && !nft.audio" class="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-primary p-2">
              <i class="bi bi-camera-reels-fill"></i>
              <span class="visually-hidden">Video NFT</span>
            </span>
          </div>

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

    <div v-if="showLoadMoreButton" class="d-grid gap-2">
      <button class="btn btn-primary" @click="fetchLastNfts" :disabled="waitingData">
        <span v-if="waitingData" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Load more
      </button>
    </div>

  </div>
</div>

<!-- Search Modal -->
<SearchNftModal />
</template>

<script>
import axios from 'axios';
import { formatEther } from 'viem';

import Image from '@/components/Image.vue';
import SearchNftModal from '@/components/nft/SearchNftModal.vue';
import NftListDropdown from '@/components/nft/list/NftListDropdown.vue';

import { fetchCollection, storeCollection } from '@/utils/browserStorageUtils';
import { readData } from '@/utils/contractUtils';
import { getLessDecimals } from '@/utils/numberUtils';

export default {
  name: 'Nft',
  props: ["hideBackButton"],

  data() {
    return {
      allNftsArrayLength: 0,
      allNftsIndexStart: 0,
      allNftsIndexEnd: 0,
      lastNfts: [],
      waitingData: false
    }
  },

  components: {
    Image,
    NftListDropdown,
    SearchNftModal
  },

  mounted() {
    if (this.$config.public.nftLaunchpadBondingAddress) {
      this.fetchLastNfts();
    }

    // set this component name as the current component in localStorage
    window.localStorage.setItem("currentNftPage", "/nft");
  },

  computed: {
    showLoadMoreButton() {
      return this.allNftsIndexEnd > 0;
    }
  },

  methods: {
    async getNftDataFromApi(address) {
      try {
        const response = await axios.get("https://api.nftdegen.org/endpoints/singleNftData?nftAddress=" + address);

        if (response?.data?.nft) {
          return response.data.nft;
        }

        return null;
      } catch (error) {
        console.error(error);
        return null;
      }
    },

    async fetchLastNfts() {
      this.waitingData = true;

      // create launchpad contract configuration
      const launchpadContractConfig = {
        address: this.$config.public.nftLaunchpadBondingAddress,
        abi: [
          {
            name: 'getLastNftContracts',
            type: 'function',
            stateMutability: 'view',
            inputs: [{ name: 'amount', type: 'uint256' }],
            outputs: [{ name: '', type: 'address[]' }]
          },
          {
            name: 'getNftContracts',
            type: 'function',
            stateMutability: 'view',
            inputs: [
              { name: 'fromIndex', type: 'uint256' },
              { name: 'toIndex', type: 'uint256' }
            ],
            outputs: [{ name: '', type: 'address[]' }]
          },
          {
            name: 'getNftContractsArrayLength',
            type: 'function',
            stateMutability: 'view',
            inputs: [],
            outputs: [{ name: '', type: 'uint256' }]
          }
        ]
      };

      // get all NFTs array length
      if (Number(this.allNftsArrayLength) === 0) {
        const arrayLengthConfig = {
          ...launchpadContractConfig,
          functionName: 'getNftContractsArrayLength',
          args: []
        };
        this.allNftsArrayLength = await readData(arrayLengthConfig);
      }

      if (Number(this.allNftsArrayLength) === 1) {
        const lastNftsConfig = {
          ...launchpadContractConfig,
          functionName: 'getLastNftContracts',
          args: [1]
        };
        const lNfts = await readData(lastNftsConfig);
        await this.parseNftsArray(lNfts, this.lastNfts);
      } else if (Number(this.allNftsArrayLength) > 1) {
        // set the start and end index, if end index is 0
        if (this.allNftsIndexEnd === 0) {
          this.allNftsIndexEnd = Number(this.allNftsArrayLength) - 1;

          if (Number(this.allNftsArrayLength) < Number(this.$config.public.nftLaunchpadLatestItems)) {
            this.allNftsIndexStart = 0;
          } else {
            this.allNftsIndexStart = Number(this.allNftsArrayLength) - Number(this.$config.public.nftLaunchpadLatestItems);
          }
        }

        // get last NFTs
        const nftsConfig = {
          ...launchpadContractConfig,
          functionName: 'getNftContracts',
          args: [BigInt(this.allNftsIndexStart), BigInt(this.allNftsIndexEnd)]
        };
        const lNfts = await readData(nftsConfig);
        const lNftsWritable = [...lNfts]; // copy the lNfts array to make it writable (for reverse() method)

        // reverse the lNftsWritable array (to show the latest NFTs first)
        lNftsWritable.reverse();

        await this.parseNftsArray(lNftsWritable, this.lastNfts);

        if (this.allNftsIndexEnd > Number(this.$config.public.nftLaunchpadLatestItems)) {
          this.allNftsIndexEnd = this.allNftsIndexEnd - Number(this.$config.public.nftLaunchpadLatestItems);
        } else {
          this.allNftsIndexEnd = 0;
        }

        if (this.allNftsIndexStart > Number(this.$config.public.nftLaunchpadLatestItems)) {
          this.allNftsIndexStart = this.allNftsIndexStart - Number(this.$config.public.nftLaunchpadLatestItems);
        } else {
          this.allNftsIndexStart = 0;
        }
      }

      this.waitingData = false;
    },

    formatPrice(priceWei) {
      if (priceWei === null) {
        return null;
      }

      const price = Number(formatEther(priceWei));
      return getLessDecimals(price);
    },

    async parseNftsArray(inputArray, outputArray) {
      const nftContractConfig = {
        abi: [
          {
            name: 'collectionPreview',
            type: 'function',
            stateMutability: 'view',
            inputs: [],
            outputs: [{ name: '', type: 'string' }]
          },
          {
            name: 'getMintPrice',
            type: 'function',
            stateMutability: 'view',
            inputs: [],
            outputs: [{ name: '', type: 'uint256' }]
          },
          {
            name: 'name',
            type: 'function',
            stateMutability: 'view',
            inputs: [],
            outputs: [{ name: '', type: 'string' }]
          }
        ]
      };

      // for loop to get NFTs data (price, name & image)
      for (let i = 0; i < inputArray.length; i++) {
        try {
          const nftData = await this.getNftDataFromApi(inputArray[i]);

          if (nftData) {
            let mPriceWei = BigInt(0);
            if (nftData?.mintPrice) {
              // Convert to number first, then to BigInt to avoid mixing types
              const priceNumber = Number(nftData.mintPrice);
              mPriceWei = BigInt(Math.floor(priceNumber * 1e18));
            }

            outputArray.push({
              ...nftData,
              image: nftData.previewImage,
              name: nftData.title,
              price: mPriceWei,
            });

            continue;
          }
        } catch (error) {
          console.error("Cannot fetch NFT data from API. Error: ");
          console.log(error);
        }

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
          const nameConfig = {
            ...nftContractConfig,
            address: inputArray[i],
            functionName: 'name',
            args: []
          };
          cName = await readData(nameConfig);
          collection["name"] = cName;
        }

        // get price
        const priceConfig = {
          ...nftContractConfig,
          address: inputArray[i],
          functionName: 'getMintPrice',
          args: []
        };
        const mintPriceWei = await readData(priceConfig);

        // get image
        let cImage;

        if (collection?.image) {
          cImage = collection.image;
        } else {
          const imageConfig = {
            ...nftContractConfig,
            address: inputArray[i],
            functionName: 'collectionPreview',
            args: []
          };

          cImage = await readData(imageConfig);
          
          if (cImage) {
            let cImageResult = await getWorkingUrl(cImage)
            if (cImageResult?.success) {
              collection['image'] = cImageResult?.url
            }
          }
        }

        // check if collection image uses Spheron IPFS gateway (in that case replace it with the IPFS gateway defined in the config)
        if (collection.image && collection.image.includes(".ipfs.sphn.link/")) {
          const linkParts = collection.image.split(".ipfs.sphn.link/");
          const cid = linkParts[0].replace("https://", "");
          const newImageLink = this.$config.public.ipfsGateway + cid + "/" + linkParts[1];
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
    }
  },
}
</script>
