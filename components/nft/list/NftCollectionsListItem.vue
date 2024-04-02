<template>
<NuxtLink class="col-md-3 text-decoration-none" :to="'/nft/collection?id=' + nft.address">
    <div class="card border mb-3">
      <img :src="nft.previewImage" class="card-img-top" :alt="nft.title">
      <div class="card-body rounded-bottom-3">
        <p class="card-text mb-1"><strong>{{ nft.title }}</strong></p>
        <small class="card-text">{{ formatPrice(nft.mintPrice) }} {{ $config.tokenSymbol }}</small>
      </div>
    </div>
  </NuxtLink>
</template>

<script>
export default {
  name: 'NftCollectionsListItem',
  props: ["nft"],
  
  methods: {
    formatPrice(price) {
      if (price === null) {
        return null;
      }

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
  }
}
</script>