<template>
  <div class="dropdown mb-4">
    <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
      {{ buttonText }}
    </button>
    <ul class="dropdown-menu">
      <li><NuxtLink class="dropdown-item" to="/nft/music-nfts"><i class="bi bi-music-note-beamed me-2"></i>Music NFTs</NuxtLink></li>
      <li><NuxtLink class="dropdown-item" to="/nft/video-nfts"><i class="bi bi-camera-reels me-2"></i>Video NFTs</NuxtLink></li>
      <li><NuxtLink class="dropdown-item" to="/nft/featured"><i class="bi bi-patch-check me-2"></i>Featured NFTs</NuxtLink></li>
      <li><NuxtLink class="dropdown-item" to="/nft"><i class="bi bi-stars me-2"></i>New NFTs</NuxtLink></li>
      <li><NuxtLink class="dropdown-item" to="/nft/most-traded"><i class="bi bi-arrow-left-right me-2"></i>Most Traded NFTs</NuxtLink></li>
      <li><NuxtLink class="dropdown-item" to="/nft/highest-price"><i class="bi bi-currency-bitcoin me-2"></i>Top-Priced NFTs</NuxtLink></li>
      <li><NuxtLink class="dropdown-item" to="/nft/most-holders"><i class="bi bi-gem me-2"></i>Most Holders NFTs</NuxtLink></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'NftListDropdown',
  props: ["buttonText"],
}
</script>