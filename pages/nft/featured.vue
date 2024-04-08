<template>
  <Head>
    <Title>Featured NFTs | {{ $config.projectMetadataTitle }}</Title>
    <Meta property="og:title" :content="'Featured NFTs | '+$config.projectMetadataTitle" />
  
    <Meta name="description" content="Check these featured NFTs!" />
  
    <Meta property="og:image" :content="$config.projectUrl+$config.previewImageNftLaunchpad" />
    <Meta property="og:description" content="Check these featured NFTs!" />
  
    <Meta name="twitter:image" :content="$config.projectUrl+$config.previewImageNftLaunchpad" />
    <Meta name="twitter:description" content="Check these featured NFTs!" />
  </Head>
  
  <div class="card border scroll-500">
    <div class="card-body">
  
      <p v-if="!hideBackButton" class="fs-3">
        <i class="bi bi-arrow-left-circle cursor-pointer" @click="$router.back()"></i>
      </p>
  
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

      <NftListDropdown buttonText="Featured NFTs" />

      <component :is="currentComponent" :nftsList="nftsList" :waitingData="waitingData" />
  
    </div>
  </div>
  
  <!-- Search Modal -->
  <SearchNftModal />
</template>
  
<script>
import axios from 'axios';
import SearchNftModal from '~/components/nft/SearchNftModal.vue';
import FeaturedNftsApi from '~/components/nft/list/FeaturedNftsApi.vue';
import FeaturedNftsBlockchain from '~/components/nft/list/FeaturedNftsBlockchain.vue';
import NftListDropdown from '~/components/nft/list/NftListDropdown.vue';

export default {
  name: 'NftsMostHolders',
  props: ["hideBackButton"],

  components: {
    NftListDropdown,
    SearchNftModal
  },

  data() {
    return {
      nftsList: [],
      waitingData: false
    }
  },

  mounted() {
    this.fetchNfts();

    // set this component name as the current component in localStorage
    window.localStorage.setItem("currentNftPage", "/nft/featured");
  },

  computed: {
    currentComponent() {
      if (this.nftsList.length > 0) {
        return FeaturedNftsApi;
      } else {
        return FeaturedNftsBlockchain;
      }
    }
  },

  methods: {
    async fetchNfts() {
      this.waitingData = true;

      try {
        // TODO: Fetch NFTs
        const response = await axios.get('https://api.nftdegen.org/endpoints/featuredNfts?limit=16');
        this.nftsList = response.data.topCollections;
      } catch (error) {
        console.error("Cannot fetch featured NFTs from API. Trying blockchain...");
        this.nftsList = [];
      }

      this.waitingData = false;
    },
  }
}
</script>