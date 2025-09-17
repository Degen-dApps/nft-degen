<template>
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
</template>

<script>
import axios from 'axios';
import NftCollectionsList from '@/components/nft/list/NftCollectionsList.vue';

export default {
  name: "UserCreatedNfts",
  props: ["uAddress", "limit"],

  components: {
    NftCollectionsList
  },

  data() {
    return {
      cursor: null,
      moreResults: false,
      nftsList: [],
      waitingData: false
    };
  },

  mounted() {
    if (this.uAddress) {
      this.fetchNfts();
    }
  },

  methods: {
    async fetchNfts() {
      this.waitingData = true;

      if (!this.limit) {
        this.limit = 8;
      }

      // Fetch NFTs
      try {
        let url = `https://api.nftdegen.org/endpoints/createdNftsByUser?addr=${this.uAddress}&limit=${this.limit}`;

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
    },
  }
}
</script>