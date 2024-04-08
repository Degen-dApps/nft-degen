<template>
  
</template>

<script>
import { useEthers } from 'vue-dapp';

export default {
  name: "index",

  mounted() {
    const curComp = window.localStorage.getItem("currentNftPage");

    if (!curComp) {
      return this.$router.push({ path: '/nft/featured' });
    } else {
      return this.$router.push({ path: curComp });
    }
  },

  setup() {
    const { address, chainId } = useEthers()

    return { address, chainId }
  }
}
</script>