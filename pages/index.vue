<template>
  <Head>
    <Link rel="canonical" href="https://nftdegen.lol" />
  </Head>
</template>

<script>
import { useAccountData } from '@/composables/useAccountData'

export default {
  name: "index",

  mounted() {
    const curComp = window.localStorage.getItem("currentNftPage");

    if (!curComp) {
      return this.$router.push({ path: '/nft/music-nfts' });
    } else {
      return this.$router.push({ path: curComp });
    }
  },

  setup() {
    const { address, chainId } = useAccountData()

    return { address, chainId }
  }
}
</script>
