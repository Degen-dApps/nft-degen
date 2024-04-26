<template>
  <img v-if="imageUrl" :src="imageUrl" @error="handleLoadError" :alt="alt" :class="cls" />
</template>

<script>
export default {
  props: ["alt", "cls", "url"],

  data() {
    return {
      cid: null,
      imageUrl: "https://placeholder.pics/svg/300/DEDEDE/555555/Loading",
    };
  },

  mounted() {
    this.fetchImageData();
  },

  methods: {
    fetchImageData() {
      if (this.url) {
        if (this.url.startsWith(this.$config.ipfsGateway)) {
          this.cid = this.url.replace(this.$config.ipfsGateway, "");
        } else if (this.url.startsWith("https://ipfs.io/ipfs/")) {
          this.cid = this.url.replace("https://ipfs.io/ipfs/", "");
        } else if (this.url.startsWith("ipfs://")) {
          this.cid = this.url.replace("ipfs://", "");
        } else if (this.url.startsWith("https://ipfs.itslit.org/ipfs/")) {
          this.cid = this.url.replace("https://ipfs.itslit.org/ipfs/", "");
          return this.imageUrl = this.$config.ipfsGateway + this.cid;
        } /*else if (this.url.startsWith("https://ipfs.dylmusic.com/ipfs/")) {
          this.cid = this.url.replace("https://ipfs.dylmusic.com/ipfs/", "");
          return this.imageUrl = this.$config.ipfsGateway + this.cid;
        }*/
      }
      
      this.imageUrl = this.url;
    },

    handleLoadError() {
      if (this.cid) {
        this.imageUrl = "https://ipfs.io/ipfs/" + this.cid;
      } else {
        this.imageUrl = "https://placeholder.pics/svg/300/DEDEDE/555555/Loading";
      }

    },
  },
}
</script>