<template>
  <div class="d-flex justify-content-center mb-3" v-if="waitingData && !nftsList">
    <span class="spinner-border spinner-border-lg" role="status" aria-hidden="true"></span>
  </div>

  <NftCollectionsList v-if="nftsList" :nftsList="nftsList" />
</template>

<script>
import NftCollectionsList from '~/components/nft/list/NftCollectionsList.vue';

export default {
  name: "FeaturedNftsApi",
  props: ["nftsList", "waitingData"],

  components: {
    NftCollectionsList
  },
}
</script>