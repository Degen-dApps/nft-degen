<template>
  <div class="row" v-if="nftsList.length > 0">
    <NftCollectionsListItem v-for="nft in nftsList" :key="nft.address" :nft="nft" />
  </div>
</template>

<script>
import NftCollectionsListItem from './NftCollectionsListItem.vue';

export default {
  name: 'NftCollectionsList',
  props: ["nftsList"],

  components: {
    NftCollectionsListItem
  }
  
}
</script>