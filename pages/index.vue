<template>
  <component :is="currentComponent" :hideBackButton="true" />
</template>

<script>
import { useEthers } from 'vue-dapp';
import Nft from "~/pages/nft/index.vue";
import NftsHighestPrice from "~/pages/nft/highest-price.vue";

export default {
  name: "index",

  data() {
    return {
      //currentComponent: Nft
    }
  },

  computed: {
    currentComponent() {
      try {
        const curComp = window.localStorage.getItem("currentNftComponent");
        
        if (curComp === "Nft") {
          return Nft;
        } else if (curComp === "NftsHighestPrice") {
          return NftsHighestPrice;
        }
      } catch (e) {
        return Nft;
      }

      return Nft;
    }
  },

  setup() {
    const { address, chainId } = useEthers()

    return { address, chainId }
  }
}
</script>