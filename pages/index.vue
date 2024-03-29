<template>
  <Nft :hideBackButton="true" />
</template>

<script>
import { useEthers } from 'vue-dapp'
import Nft from "~/pages/nft/index.vue"

export default {
  name: "index",

  components: {
    Nft
  },

  setup() {
    const { address, chainId } = useEthers()

    return { address, chainId }
  }
}
</script>