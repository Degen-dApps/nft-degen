<template>
  <div class="dropdown mb-4">
    <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
      {{ buttonText }}
    </button>
    <ul class="dropdown-menu">
      <li><NuxtLink class="dropdown-item" to="/nft/featured">Featured NFTs</NuxtLink></li>
      <li><NuxtLink class="dropdown-item" to="/nft">New NFTs</NuxtLink></li>
      <li><NuxtLink class="dropdown-item" to="/nft/most-traded">Most Traded NFTs</NuxtLink></li>
      <li><NuxtLink class="dropdown-item" to="/nft/highest-price">Top-Priced NFTs</NuxtLink></li>
      <li><NuxtLink class="dropdown-item" to="/nft/most-holders">Most Holders NFTs</NuxtLink></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'NftListDropdown',
  props: ["buttonText"],
}
</script>