<template>
<NuxtLink class="col-md-3 text-decoration-none" :to="'/nft/collection?id=' + nft.address">
    <div class="card border mb-3">
      <div>
        <Image :url="nft.previewImage" :cls="'card-img-top'" :alt="nft.title" />
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
        <p class="card-text mb-0"><strong>{{ nft.title }}</strong></p>
        <p v-if="authorName" class="mb-2"><small><em>by {{ authorName }}</em></small></p>
        <small class="card-text">{{ formatPrice(nft.mintPrice) }} {{ $config.tokenSymbol }}</small>
      </div>
    </div>
  </NuxtLink>
</template>

<script>
import Image from '~/components/Image.vue';
import { getDomainName } from '~/utils/domainUtils';

export default {
  name: 'NftCollectionsListItem',
  props: ["nft"],

  data() {
    return {
      authorName: null,
    };
  },

  components: {
    Image,
  },

  mounted() {
    this.fetchAuthorName();
  },
  
  methods: {
    getDomainName,

    async fetchAuthorName() {
      if (this.nft) {
        this.authorName = await this.getDomainName(this.nft.ownerAddress);
      }
    },

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