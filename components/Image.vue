<template>
  <img v-if="imageUrl" :src="parseImageLink" @error="handleLoadError" :alt="alt" :class="cls" />
</template>

<script>
export default {
  name: "Image",
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

  computed: {
    parseImageLink() {
      let parsedImage = this.imageUrl;

      if (parsedImage && parsedImage.includes("ipfs://")) {
        parsedImage = parsedImage.replace("ipfs://", this.$config.ipfsGateway);
      }

      return parsedImage;
    },
  },

  methods: {
    fetchImageData() {
      this.imageUrl = this.url;

      if (this.url) {
        if (this.url.startsWith(this.$config.ipfsGateway)) {
          this.cid = this.url.replace(this.$config.ipfsGateway, "");
        } else if (this.url.startsWith(this.$config.ipfsGateway2)) {
          this.cid = this.url.replace(this.$config.ipfsGateway2, "");
        } else if (this.url.startsWith(this.$config.ipfsGateway3)) {
          this.cid = this.url.replace(this.$config.ipfsGateway3, "");
        } else if (this.url.startsWith("https://cloudflare-ipfs.com/ipfs/")) {
          this.cid = this.url.replace("https://cloudflare-ipfs.com/ipfs/", "");
        } else if (this.url.startsWith("https://ipfs.io/ipfs/")) {
          this.cid = this.url.replace("https://ipfs.io/ipfs/", "");
        } else if (this.url.startsWith("ipfs://")) {
          this.cid = this.url.replace("ipfs://", "");
        } else if (this.url.startsWith("https://ipfs.itslit.org/ipfs/")) {
          this.cid = this.url.replace("https://ipfs.itslit.org/ipfs/", "");
        } else if (this.url.startsWith("https://ipfs.dylmusic.com/ipfs/")) {
          this.cid = this.url.replace("https://ipfs.dylmusic.com/ipfs/", "");
        }
      }
    },

    handleLoadError() {
      if (this.cid) {
        if (this.imageUrl.startsWith(this.$config.ipfsGateway)) {
          this.imageUrl = this.$config.ipfsGateway3 + this.cid;
        } else if (this.imageUrl.startsWith(this.$config.ipfsGateway3)) {
          this.imageUrl = this.$config.ipfsGateway2 + this.cid;
        }
      } else {
        this.imageUrl = "https://placeholder.pics/svg/300/DEDEDE/555555/Loading";
      }

    },
  },
}
</script>