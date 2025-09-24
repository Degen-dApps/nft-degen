<template>
  <Head>
    <Link rel="canonical" href="https://nftdegen.lol" />
  </Head>
</template>

<script>
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
}
</script>
