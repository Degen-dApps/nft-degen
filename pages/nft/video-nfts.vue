<template>
  <Head>
    <Title>Video NFTs on NFTdegen.lol</Title>
    <Meta property="og:title" :content="'Video NFTs | '+$config.projectMetadataTitle" />
  
    <Meta name="description" content="Video NFTs have come to Degen Chain. Check them out here!" />
  
    <Meta property="og:image" :content="$config.projectUrl+$config.previewVideoNfts" />
    <Meta property="og:description" content="Video NFTs have come to Degen Chain. Check them out here!" />
  
    <Meta name="twitter:image" :content="$config.projectUrl+$config.previewVideoNfts" />
    <Meta name="twitter:description" content="Video NFTs have come to Degen Chain. Check them out here!" />

    <Link rel="canonical" :href="$config.projectUrl+currentPath" />
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

      <NftListDropdown buttonText="Video NFTs" />

      <div class="d-flex justify-content-center mb-3" v-if="waitingData && !nftsList">
        <span class="spinner-border spinner-border-lg" role="status" aria-hidden="true"></span>
      </div>

      <NftCollectionsList v-if="nftsList" :nftsList="nftsList" />

      <div class="d-flex justify-content-center" v-if="moreResults">
        <button :disabled="waitingData" class="btn btn-primary" @click="fetchNfts">
          <span v-if="waitingData" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Load More
        </button>
      </div>
  
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
      cursor: null,
      currentPath: "/nft/video-nfts",
      limit: 16,
      moreResults: false,
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
    window.localStorage.setItem("currentNftPage", this.currentPath);
  },

  methods: {
    async fetchNfts(clear="false") {
      if (clear === "true") {
        this.nftsList = [];
        this.cursor = null;
        this.moreResults = false;
      }

      this.waitingData = true;

      if (!this.limit) {
        this.limit = 8;
      }

      // Fetch NFTs
      try {
        let url = `https://api.nftdegen.org/endpoints/videoNfts?limit=${this.limit}`;

        if (this.cursor && this.moreResults) {
          url += `&cursor=${this.cursor}`;
        }

        const response = await axios.get(url);

        // append response.data.collections to nftsList
        this.nftsList = this.nftsList.concat(response.data.collections);

        if (response.data?.cursor) {
          this.cursor = response.data.cursor.endCursor;

          if (response.data.cursor?.moreResults) {
            if (response.data.cursor?.moreResults === "MORE_RESULTS_AFTER_LIMIT") {
              this.moreResults = true;
            } else {
              this.moreResults = false;
            }
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.waitingData = false;
      }
    }
  }
}
</script>