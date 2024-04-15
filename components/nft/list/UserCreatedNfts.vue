<template>
  <div class="d-flex justify-content-center mb-3" v-if="waitingData && !nftsList">
    <span class="spinner-border spinner-border-lg" role="status" aria-hidden="true"></span>
  </div>

  <NftCollectionsList v-if="nftsList" :nftsList="nftsList" />
</template>

<script>
import axios from 'axios';
import NftCollectionsList from '~/components/nft/list/NftCollectionsList.vue';

export default {
  name: "UserCreatedNfts",
  props: ["uAddress", "limit"],

  components: {
    NftCollectionsList
  },

  data() {
    return {
      waitingData: false,
      nftsList: []
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
        this.limit = 16;
      }

      // Fetch NFTs
      try {
        const response = await axios.get(`https://api.nftdegen.org/endpoints/createdNftsByUser?addr=${this.uAddress}&limit=${this.limit}`);
        this.nftsList = response.data.collections;
      } catch (error) {
        console.error(error);
      } finally {
        this.waitingData = false;
      }
    },
  }
}
</script>