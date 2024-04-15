<template>
  <Head>
    <Title>Most Holders NFTs | {{ $config.projectMetadataTitle }}</Title>
    <Meta property="og:title" :content="'Most Holders NFTs | '+$config.projectMetadataTitle" />
  
    <Meta name="description" content="Check these NFTs with most holders!" />
  
    <Meta property="og:image" :content="$config.projectUrl+$config.previewImageNftLaunchpad" />
    <Meta property="og:description" content="Check these NFTs with most holders!" />
  
    <Meta name="twitter:image" :content="$config.projectUrl+$config.previewImageNftLaunchpad" />
    <Meta name="twitter:description" content="Check these NFTs with most holders!" />

    <Link rel="canonical" :href="$config.projectUrl+'/nft/most-holders'" />
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

      <NftListDropdown buttonText="Most Holders NFTs" />

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
import NftListDropdown from '~/components/nft/list/NftListDropdown.vue';

export default {
  name: 'NftsMostHolders',
  props: ["hideBackButton"],

  data() {
    return {
      nftsList: [],
      waitingData: false
    }
  },

  components: {
    NftCollectionsList,
    NftListDropdown,
    SearchNftModal
  },

  mounted() {
    this.fetchNfts();

    // set this component name as the current component in localStorage
    window.localStorage.setItem("currentNftPage", "/nft/most-holders");
  },

  methods: {
    async fetchNfts() {
      this.waitingData = true;

      // Fetch NFTs
      try {
        const response = await axios.get('https://api.nftdegen.org/endpoints/mostHoldersNfts?limit=16');
        this.nftsList = response.data.topCollections;
      } catch (error) {
        console.error(error);
      } finally {
        this.waitingData = false;
      }
    },

    
  }
}
</script>