<template>
<div class="col col-lg-auto px-0 mt-1">
  <div id="sidebar1" class="collapse collapse-horizontal" :class="$config.sidebarLeftSticky ? 'sticky-lg-top' : ''">
    <div class="sidebar-nav list-group border-0 rounded-0 text-sm-start min-vh-100">
      <div class="card m-2 p-2 bg-light">

        <div v-if="isActivated" class="text-center">

          <NuxtLink :to="getProfileLink">
              <ProfileImage
                :key="userStore.getImage"
                @click="closeLeftSidebar"
                class="img-fluid mt-3 rounded-circle w-30 sidebar-profile-image"
                :domain="userStore.getDefaultDomain"
                :image="userStore.getImage"
              />
            </NuxtLink>

          <h6 class="mt-3" v-if="userStore.getDefaultDomain">
            {{ getTextWithoutBlankCharacters(userStore.getDefaultDomain) }}
          </h6>

          <!-- Chat tokens -->
          <!--
          <button v-if="userStore.getChatTokenBalanceWei > 0 && $config.chatTokenAddress" class="btn btn-outline-primary btn-sm mt-2 mb-2 disabled">
            {{ userStore.getChatTokenBalance }} {{ $config.chatTokenSymbol }}
          </button>
          -->

          <!-- Activity Points -->
          <div v-if="$config.activityPointsAddress && $config.showFeatures.activityPoints" class="mt-2">
            <NuxtLink 
              to="/activity-points"
              class="btn btn-outline-primary btn-sm mt-2 mb-2"
            >
              {{ getUserAp }} AP
            </NuxtLink>
          </div>

          <hr />
        </div>

        <ul class="nav nav-pills flex-column">

          <!--
          <ul class="list-group">
            <NuxtLink 
              to="/"
              class="list-group-item cursor-pointer hover-color bg-light border-0" 
              :class="($route.path === '/') ? 'active' : ''"
              @click="closeLeftSidebar"
            >
              General discussion
            </NuxtLink>
          </ul>

          <ul class="list-group">
            <NuxtLink 
              to="/memes-images"
              class="list-group-item cursor-pointer hover-color bg-light border-0" 
              :class="$route.path.startsWith('/memes-images') ? 'active' : ''" 
              @click="closeLeftSidebar"
            >
              Share images & NFTs
            </NuxtLink>
          </ul>

          <ul class="list-group">
            <NuxtLink 
              to="/shill"
              class="list-group-item cursor-pointer hover-color bg-light border-0" 
              :class="$route.path.startsWith('/shill') ? 'active' : ''" 
              @click="closeLeftSidebar" 
            >
              Shill & discuss projects
            </NuxtLink>
          </ul>

          <hr />
          -->

          <!-- Home 
          <li class="nav-item p-1" @click="closeLeftSidebar">
            <NuxtLink class="nav-link" :class="$route.path === '/' ? 'active' : ''" aria-current="page" to="/">
              <i class="bi bi-house"></i> Home
            </NuxtLink>
          </li>
          -->

          <!-- Music NFTs -->
          <li class="nav-item p-1" @click="closeLeftSidebar" v-if="$config.nftLaunchpadBondingAddress && $config.showFeatures.nftLaunchpad">
            <NuxtLink class="nav-link" :class="$route.path == '/nft/music-nfts' ? 'active' : ''" aria-current="page" to="/nft/music-nfts">
              <i class="bi bi-music-note-beamed me-1"></i> Music NFTs
            </NuxtLink>
          </li>

          <!-- Video NFTs -->
          <li class="nav-item p-1" @click="closeLeftSidebar" v-if="$config.nftLaunchpadBondingAddress && $config.showFeatures.nftLaunchpad">
            <NuxtLink class="nav-link" :class="$route.path == '/nft/video-nfts' ? 'active' : ''" aria-current="page" to="/nft/video-nfts">
              <i class="bi bi-camera-reels me-1"></i> Video NFTs
            </NuxtLink>
          </li>

          <!-- Featured NFTs -->
          <li class="nav-item p-1" @click="closeLeftSidebar" v-if="$config.nftLaunchpadBondingAddress && $config.showFeatures.nftLaunchpad">
            <NuxtLink class="nav-link" :class="$route.path == '/nft/featured' ? 'active' : ''" aria-current="page" to="/nft/featured">
              <i class="bi bi-patch-check me-1"></i> Featured NFTs
            </NuxtLink>
          </li>

          <!-- New NFTs -->
          <li class="nav-item p-1" @click="closeLeftSidebar" v-if="$config.nftLaunchpadBondingAddress && $config.showFeatures.nftLaunchpad">
            <NuxtLink class="nav-link" :class="$route.path == '/nft' ? 'active' : ''" aria-current="page" to="/nft">
              <i class="bi bi-stars me-1"></i> New NFTs
            </NuxtLink>
          </li>

          <!-- Most Traded NFTs -->
          <li class="nav-item p-1" @click="closeLeftSidebar" v-if="$config.nftLaunchpadBondingAddress && $config.showFeatures.nftLaunchpad">
            <NuxtLink class="nav-link" :class="$route.path.startsWith('/nft/most-traded') ? 'active' : ''" aria-current="page" to="/nft/most-traded">
              <i class="bi bi-arrow-left-right me-1"></i> Most Traded NFTs
            </NuxtLink>
          </li>

          <!-- Top-Priced NFTs -->
          <li class="nav-item p-1" @click="closeLeftSidebar" v-if="$config.nftLaunchpadBondingAddress && $config.showFeatures.nftLaunchpad">
            <NuxtLink class="nav-link" :class="$route.path.startsWith('/nft/highest-price') ? 'active' : ''" aria-current="page" to="/nft/highest-price">
              <i class="bi bi-coin me-1"></i> Top-Priced NFTs
            </NuxtLink>
          </li>

          <!-- Most Holders NFTs -->
          <li class="nav-item p-1" @click="closeLeftSidebar" v-if="$config.nftLaunchpadBondingAddress && $config.showFeatures.nftLaunchpad">
            <NuxtLink class="nav-link" :class="$route.path.startsWith('/nft/most-holders') ? 'active' : ''" aria-current="page" to="/nft/most-holders">
              <i class="bi bi-gem me-1"></i> Most Holders NFTs
            </NuxtLink>
          </li>

          <hr />

          <!-- Degen Radio -->
          <li class="nav-item p-1" @click="closeLeftSidebar">
            <a class="nav-link" href="https://degenradio.lol" target="_blank">
              <i class="bi bi-broadcast me-1"></i> Degen Radio <small><i class="bi bi-box-arrow-up-right ms-1"></i></small>
            </a>
          </li>

          <!-- Profile -->
          <li v-if="isActivated" class="nav-item p-1" @click="closeLeftSidebar">
            <NuxtLink class="nav-link" :class="$route.path.startsWith('/profile') ? 'active' : ''" aria-current="page" :to="getProfileLink">
              <i class="bi bi-person me-1"></i> Profile
            </NuxtLink>
          </li>

          <!-- Activity Points -->
          <li class="nav-item p-1" @click="closeLeftSidebar" v-if="$config.showFeatures.activityPoints && $config.activityPointsAddress">
            <NuxtLink class="nav-link" :class="$route.path.startsWith('/activity-points') ? 'active' : ''" aria-current="page" to="/activity-points">
              <i class="bi bi-award me-1"></i> Activity Points
            </NuxtLink>
          </li>

          <!-- Shill 
          <li class="nav-item p-1" @click="closeLeftSidebar">
            <NuxtLink class="nav-link" :class="$route.path.startsWith('/shill') ? 'active' : ''" aria-current="page" to="/shill">
              <i class="bi bi-megaphone me-1"></i> Shill projects
            </NuxtLink>
          </li>
          -->

          <!-- Send tokens -->
          <li class="nav-item p-1" @click="closeLeftSidebar" v-if="$config.showFeatures.sendTokens">
            <NuxtLink class="nav-link" :class="$route.path.startsWith('/send-tokens') ? 'active' : ''" aria-current="page" to="/send-tokens">
              <i class="bi bi-send me-1"></i> Send Tokens
            </NuxtLink>
          </li>

          <!-- Stake & Earn -->
          <li class="nav-item p-1" @click="closeLeftSidebar" v-if="$config.stakingContractAddress && $config.showFeatures.stake">
            <NuxtLink class="nav-link" :class="$route.path.startsWith('/stake') ? 'active' : ''" aria-current="page" to="/stake">
              <i class="bi bi-cash-stack me-1"></i> Stake & Earn
            </NuxtLink>
          </li>

          <!-- Swap -->
          <li class="nav-item p-1" @click="closeLeftSidebar" v-if="$config.swapRouterAddress && $config.showFeatures.swap">
            <NuxtLink class="nav-link" :class="$route.path.startsWith('/swap') ? 'active' : ''" aria-current="page" to="/swap">
              <i class="bi bi-arrow-down-up me-1"></i> Swap
            </NuxtLink>
          </li>

          <!-- Airdrop -->
          <li class="nav-item p-1" @click="closeLeftSidebar" v-if="($config.airdropClaimDomainsAddress || $config.airdropApAddress) && $config.showFeatures.airdrop">
            <NuxtLink class="nav-link" :class="$route.path.startsWith('/airdrop') ? 'active' : ''" aria-current="page" to="/airdrop">
              <i class="bi bi-gift me-1"></i> Airdrop
            </NuxtLink>
          </li>
          
          <!-- Find User -->
          <li class="nav-item p-1" @click="closeLeftSidebar">
            <NuxtLink class="nav-link" :class="$route.path.startsWith('/find-user') ? 'active' : ''" aria-current="page" to="/find-user">
              <i class="bi bi-binoculars me-1"></i> Find User
            </NuxtLink>
          </li>

          <!-- About -->    
          <li class="nav-item p-1" @click="closeLeftSidebar">
            <NuxtLink class="nav-link" :class="$route.path.startsWith('/about') ? 'active' : ''" aria-current="page" to="/about">
              <i class="bi bi-info-circle me-1"></i> About
            </NuxtLink>
          </li>

          <!-- FAQ -->
          <li class="nav-item p-1" @click="closeLeftSidebar">
            <a class="nav-link" href="https://docs.google.com/document/d/1UTTFLszVAwpd7LbvNMbj4vL1NBaN0ImoZYNPJ4T_EJo/edit?usp=sharing" target="_blank">
              <i class="bi bi-patch-question me-1"></i> FAQ <small><i class="bi bi-box-arrow-up-right ms-1"></i></small>
            </a>
          </li>

          <!-- Dapps List -->
          <li class="nav-item p-1" @click="closeLeftSidebar">
            <a class="nav-link" href="https://degendapps.lol" target="_blank">
              <i class="bi bi-card-list me-1"></i> dApps List <small><i class="bi bi-box-arrow-up-right ms-1"></i></small>
            </a>
          </li>

          <!-- Governance -->
          <li class="nav-item p-1" v-if="$config.showFeatures.governance" @click="closeLeftSidebar">
            <a class="nav-link" :href="$config.governanceUrl" target="_blank">
              <i class="bi bi-box2 me-1"></i> Governance <small><i class="bi bi-box-arrow-up-right ms-1"></i></small>
            </a>
          </li>

          <!-- Grants 
          <li class="nav-item p-1 dropdown">
            <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">
              <i class="bi bi-piggy-bank me-1"></i> Grants
            </a>

            <ul class="dropdown-menu">

              <li class="pt-1 pb-1" @click="closeLeftSidebar">
                <a class="dropdown-item" href="https://docs.google.com/forms/d/e/1FAIpQLScIJkUMg7zVOLs75lAO5OodYo5f0byXVAIuxxqZh_noB2iTEA/viewform" target="_blank">
                  <i class="bi bi-music-note-beamed me-1"></i> Grants for Musicians <small><i class="bi bi-box-arrow-up-right ms-1"></i></small>
                </a>
              </li>

              <li class="pt-1 pb-1" @click="closeLeftSidebar">
                <a class="dropdown-item" href="https://docs.google.com/forms/d/e/1FAIpQLSdpfyPSACHv1JpWoSAPGdyv8ZLGgnWYl5vAeFQQJnPBR_vu2A/viewform" target="_blank">
                  <i class="bi bi-brush me-1"></i> Grants for Visual Artists <small><i class="bi bi-box-arrow-up-right ms-1"></i></small>
                </a>
              </li>

            </ul>
          </li>
          -->

          <!-- More 
          <li class="nav-item p-1 dropdown">
            <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">
              <i class="bi bi-three-dots me-1"></i> More
            </a>

            <ul class="dropdown-menu">

              <li class="pt-1 pb-1" @click="closeLeftSidebar" v-if="$config.airdropClaimDomainsAddress || $config.airdropApAddress">
                <NuxtLink class="dropdown-item" :class="$route.path.startsWith('/airdrop') ? 'active' : ''" aria-current="page" to="/airdrop">
                  <i class="bi bi-gift me-1"></i> Airdrop
                </NuxtLink>
              </li>

              <li class="pt-1 pb-1" @click="closeLeftSidebar">
                <NuxtLink class="dropdown-item" :class="$route.path.startsWith('/profile') ? 'active' : ''" aria-current="page" to="/profile">
                  <i class="bi bi-person me-1"></i> Profile
                </NuxtLink>
              </li>

              <li class="pt-1 pb-1" @click="closeLeftSidebar">
                <a class="dropdown-item" href="https://snapshot.org/#/sgbchat.eth" target="_blank">
                  <i class="bi bi-box2 me-1"></i> Governance <small><i class="bi bi-box-arrow-up-right ms-1"></i></small>
                </a>
              </li>

              <li class="pt-1 pb-1" @click="closeLeftSidebar">
                <NuxtLink class="dropdown-item" :class="$route.path.startsWith('/about') ? 'active' : ''" aria-current="page" to="/about">
                  <i class="bi bi-patch-question me-1"></i> About
                </NuxtLink>
              </li>

            </ul>
          </li>
          -->

        </ul>
      </div>
      
    </div>
  </div>
</div>
</template>

<script>
import { useEthers } from '~/store/ethers'
import { useToast } from "vue-toastification/dist/index.mjs";
import { useSidebarStore } from '~/store/sidebars';
import { useUserStore } from '~/store/user';
import ProfileImage from "~/components/profile/ProfileImage.vue";
import { getActivityPoints } from '~/utils/balanceUtils';
import { getTextWithoutBlankCharacters } from '~/utils/textUtils';

export default {
  name: "SidebarLeft",
  props: ["lSidebar", "isMobile"],

  components: {
    ProfileImage
  },

  computed: {
    getProfileLink() {
      if (this.userStore.getDefaultDomain) {
        return `/profile/?id=${this.userStore.getDefaultDomain}`;
      } else if (this.address) {
        return `/profile/?id=${this.address}`;
      } else {
        return `/profile`;
      }
    },

    getUserAp() {
      if (this.userStore.getCurentUserActivityPoints > 0) {
        return this.userStore.getCurentUserActivityPoints;
      } else {
        return 0;
      }
    },
    
  },
  
  methods: {
    getActivityPoints,

    closeLeftSidebar() {
      if (this.isMobile) {
        this.lSidebar.hide();
        this.sidebarStore.setLeftSidebar(false);
        this.sidebarStore.setMainContent(true);
      }
    },

    async fetchActivityPoints() {
      if (this.$config.activityPointsAddress && this.address) {
        this.toast.info("Refreshing activity points...", { timeout: 2000 });

        const activityPoints = await this.getActivityPoints(this.address);

        this.userStore.setCurrentUserActivityPoints(activityPoints);
      }
    }
  },

  setup() {
    const { address, isActivated } = useEthers();

    const toast = useToast();
    const sidebarStore = useSidebarStore();
    const userStore = useUserStore();

    return { address, isActivated, sidebarStore, toast, userStore }
  },
}
</script>
