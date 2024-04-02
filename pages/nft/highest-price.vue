<template>
  <Head>
    <Title>NFT Launchpad | {{ $config.projectMetadataTitle }}</Title>
    <Meta property="og:title" :content="$config.projectMetadataTitle" />
  
    <Meta name="description" :content="$config.projectDescription" />
  
    <Meta property="og:image" :content="$config.projectUrl+$config.previewImageNftLaunchpad" />
    <Meta property="og:description" :content="$config.projectDescription" />
  
    <Meta name="twitter:image" :content="$config.projectUrl+$config.previewImageNftLaunchpad" />
    <Meta name="twitter:description" :content="$config.projectDescription" />
  </Head>
  
  <div class="card border scroll-500">
    <div class="card-body">
  
      <p v-if="!hideBackButton" class="fs-3">
        <i class="bi bi-arrow-left-circle cursor-pointer" @click="$router.back()"></i>
      </p>
  
      <h3 class="d-flex flex-row flex-wrap mt-3">
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
  
      <h4 class="mb-3">NFTs with the highest price</h4>

      <div class="d-flex justify-content-center mb-3" v-if="waitingData && !nftsList">
        <span class="spinner-border spinner-border-lg" role="status" aria-hidden="true"></span>
      </div>

      <NftCollectionsList v-if="nftsList" :nftsList="nftsList" />
  
    </div>
  </div>
  
  <!-- Search Modal -->
  <SearchNftModal />
</template>
  
<script>
import axios from 'axios';
import SearchNftModal from '~/components/nft/SearchNftModal.vue';
import NftCollectionsList from '~/components/nft/list/NftCollectionsList.vue';

export default {
  name: 'NftsHighestPrice',
  props: ["hideBackButton"],

  data() {
    return {
      nftsList: [],
      waitingData: false
    }
  },

  components: {
    NftCollectionsList,
    SearchNftModal
  },

  mounted() {
    this.fetchFeaturedNfts();
  },

  methods: {
    async fetchFeaturedNfts() {
      this.waitingData = true;

      // TODO: Fetch NFTs with the highest price
      const response = await axios.get('https://api.nftdegen.org/endpoints/highestPriceNfts?limit=8');
      this.nftsList = response.data.topCollections;

      this.waitingData = false;
    },

    
  }
}
</script>