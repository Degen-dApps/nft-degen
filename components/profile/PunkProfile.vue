<template>
  <div>
    <div class="card border">
      <div class="card-body">
        <p class="fs-3">
          <i class="bi bi-arrow-left-circle cursor-pointer" @click="$router.back()"></i>
        </p>

        <div class="row">
          <div class="col-md-3 mt-3">
            <ProfileImage
              :key="domain"
              class="img-fluid img-thumbnail rounded-circle force-circle col-6 col-md-12"
              :domain="domain"
              :image="newImageLink"
            />
          </div>

          <div class="col-md-9 mt-3">
            <h3 v-if="domain && !isCurrentUser" class="mb-3">
              {{ getTextWithoutBlankCharacters(domain) }}
            </h3>
            <h3 v-if="domain && isCurrentUser" class="mb-3">
              {{ getTextWithoutBlankCharacters(userStore.getDefaultDomain) }}
            </h3>

            <!-- Data -->
            <div class="mt-4 muted-text" style="font-size: 14px">
              <p class="me-4">
                <i class="bi bi-wallet me-1"></i>
                {{ balanceEth }} {{ $config.tokenSymbol }}
              </p>

              <p class="me-4" v-if="$config.chatTokenAddress">
                <i class="bi bi-wallet me-1"></i>
                {{ balanceChatToken }} {{ $config.chatTokenSymbol }}
              </p>

              <p class="me-4" v-if="$config.activityPointsAddress && $config.showFeatures.activityPoints">
                <i class="bi bi-wallet me-1"></i>
                {{ balanceAp }} AP
              </p>

              <p class="me-4">
                <i class="bi bi-box-arrow-up-right me-2"></i>
                <a
                  :href="$config.blockExplorerBaseUrl + '/address/' + uAddress"
                  target="_blank"
                  class="body-color hover-color"
                  style="text-decoration: none"
                >
                  {{ shortenAddress(uAddress) }}
                </a>
              </p>

              <p class="me-4" v-if="payflowLink && !isCurrentUser">
                <i class="bi bi-box-arrow-up-right me-1"></i>
                <a :href="payflowLink" target="_blank" class="body-color hover-color" style="text-decoration: none;">
                  Go to Payflow.me profile
                </a>
              </p>

              <p class="me-4" v-if="uAddress">
                <i class="bi bi-box-arrow-up-right me-2"></i>
                <a 
                  :href="'https://explorer.degen.tips/token/0x4087fb91A1fBdef05761C02714335D232a2Bf3a1?tab=inventory&holder_address_hash='+uAddress" 
                  target="_blank" 
                  class="body-color hover-color" 
                  style="text-decoration: none;"
                >
                  <span v-if="isCurrentUser">See all your .degen names</span>
                  <span v-if="!isCurrentUser">See all .degen names of this user</span>
                </a>
              </p>
            </div>
            <!-- END Data -->

            <!-- Buttons -->
            <div class="mt-2" v-if="isCurrentUser">

              <!-- Actions dropdown button -->
              <div class="dropdown mt-2">
                <button
                  class="btn btn-primary dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i class="bi bi-sliders"></i>
                  Profile settings
                </button>
                <div class="dropdown-menu">

                  <span
                    class="dropdown-item cursor-pointer"
                    data-bs-toggle="modal"
                    :data-bs-target="'#changeImageModal' + $.uid"
                  >
                    <i class="bi bi-person-circle"></i> Change your profile picture
                  </span>

                  <span
                    class="dropdown-item cursor-pointer"
                    data-bs-toggle="modal"
                    data-bs-target="#changeUsernameModal"
                  >
                    <i class="bi bi-pencil-square"></i> Change your username
                  </span>

                  <!--
                  <span
                    class="dropdown-item cursor-pointer"
                    data-bs-toggle="modal"
                    data-bs-target="#changeDefaultPostPriceModal"
                  >
                    <i class="bi bi-tags-fill"></i> Change your post minting price
                  </span>

                  <span class="dropdown-item cursor-pointer" data-bs-toggle="modal" data-bs-target="#chatSettingsModal">
                    <i class="bi bi-gear-fill"></i> Other settings
                  </span>
                  -->

                  <!--
									<span
										class="dropdown-item cursor-pointer"
										data-bs-toggle="modal"
										data-bs-target="#referralModal"
									>
										<i class="bi bi-person-plus-fill"></i> Share referral link
									</span>
									-->
                </div>
              </div>
            </div>
            <!-- END Buttons -->

            <!-- Send tokens to user -->
            <NuxtLink
              v-if="domain && !isCurrentUser && $config.showFeatures.sendTokens"
              class="btn btn-primary mt-2"
              :to="'/send-tokens/?to=' + domain"
            >
              <i class="bi bi-send"></i>
              Send a tip
            </NuxtLink>
            <!-- END Send tokens to user -->
          </div>
        </div>

      </div>

      <!-- Change Image Modal -->
      <ChangePfpModal
        v-if="isCurrentUser"
        :key="domain"
        :domainName="domain"
        :componentId="$.uid"
        storageType="arweave" 
        @processFileUrl="insertImage"
      />
      <!-- END Change Image Modal -->
    </div>

    <div class="card border mt-3 mb-3">
      <div class="card-body">

        <!-- Tabs Navigation -->
        <ul class="nav nav-tabs nav-fill">

          <!--
          <li class="nav-item">
            <button 
              class="nav-link" 
              :class="currentTab === 'posts' ? 'active' : ''" 
              @click="changeCurrentTab('posts')" 
            >Posts</button>
          </li>
          -->
          <li class="nav-item">
            <button 
              class="nav-link" 
              :class="currentTab === 'created' ? 'active' : ''" 
              @click="changeCurrentTab('created')" 
            >Created</button>
          </li>

          <li class="nav-item">
            <button 
              class="nav-link" 
              :class="currentTab === 'nft-mints' ? 'active' : ''" 
              @click="changeCurrentTab('nft-mints')" 
            >Minted</button>
          </li>

        </ul>

        <!-- Tabs Content -->
      <div class="tab-content mt-3">

        <!-- Created NFTs Tab -->
        <div v-if="currentTab === 'created' && uAddress">
          <UserCreatedNfts :uAddress="uAddress" :limit="8" />
        </div>

        <!-- Minted NFTs Tab -->
        <div v-if="currentTab === 'nft-mints' && uAddress">
          <UserMintedNfts :uAddress="uAddress" :limit="8" />
        </div>
      </div>

      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios';
import { useEthers, shortenAddress } from '~/store/ethers'
import { ethers } from 'ethers'
import { useToast } from 'vue-toastification/dist/index.mjs'
import UserCreatedNfts from '~/components/nft/list/UserCreatedNfts.vue'
import UserMintedNfts from '~/components/nft/list/UserMintedNfts.vue'
import ChangePfpModal from '~/components/profile/ChangePfpModal.vue'
import ProfileImage from '~/components/profile/ProfileImage.vue'
import { useUserStore } from '~/store/user'
import { getActivityPoints } from '~/utils/balanceUtils'
import { getDomainName, getDomainHolder } from '~/utils/domainUtils'
import { fetchUsername, storeData, storeUsername } from '~/utils/storageUtils'
import { getTextWithoutBlankCharacters } from '~/utils/textUtils'

export default {
  name: 'PunkProfile',
  props: ['pAddress', 'pDomain'],

  data() {
    return {
      balanceAp: 0,
      balanceChatTokenWei: 0,
      currentTab: "created",
      domain: this.pDomain,
      newEmail: null,
      newImageLink: null,
      payflowUsername: null,
      uAddress: this.pAddress,
      uBalance: 0,
      waitingDataLoad: false,
      waitingImageUpdate: false,
    }
  },

  components: {
    ChangePfpModal,
    ProfileImage,
    UserCreatedNfts,
    UserMintedNfts,
  },

  mounted() {
    // get profileCurrentTab from localStorage
    this.currentTab = localStorage.getItem("profileCurrentTab");

    if (!this.currentTab || this.currentTab === "mints") {
      this.currentTab = "created";
    }

    // if uAddress and/or domain is not provided via props, then find it yourself
    if (!this.pAddress || !this.pDomain) {
      this.fetchAddressAndDomain()
    }
  },

  computed: {
    balanceChatToken() {
      const bal = ethers.utils.formatEther(this.balanceChatTokenWei)

      if (bal >= 0) {
        return Math.floor(Number(bal))
      } else {
        return Number(bal).toFixed(4)
      }
    },

    balanceEth() {
      const bal = ethers.utils.formatEther(this.uBalance)

      if (bal > 0) {
        return Number(bal).toFixed(2)
      } else {
        return Number(bal).toFixed(4)
      }
    },

    isCurrentUser() {
      return String(this.uAddress).toLowerCase() === String(this.address).toLowerCase()
    },

    domainWithoutExtension() {
      if (!this.domain) {
        return null
      }

      return String(this.domain).replace(this.$config.tldName, "")
    },

    payflowLink() {
      if (this.payflowUsername) {
        return "https://app.payflow.me/"+this.payflowUsername;
      }

      return null;
    }
  },

  methods: {
    changeCurrentTab(tab) {
      this.currentTab = tab
      localStorage.setItem('profileCurrentTab', tab)
    },

    async fetchAddressAndDomain() {
      this.waitingDataLoad = true

      // see if id is in the URL query and figure out whether it is a domain or uAddress
      if (this.$route.query.id) {
        const id = this.$route.query.id

        if (id.includes('.')) {
          this.domain = id // domain
        } else {
          this.uAddress = id // address
        }
      } else {
        // if no id is provided, then use the user's address
        this.uAddress = this.address
      }

      // if domain is not provided, check storage
      if (!this.domain && this.uAddress) {
        this.domain = fetchUsername(window, this.uAddress)
      }

      // set contract
      let provider = this.$getFallbackProvider(this.$config.supportedChainId)

      if (this.isActivated && this.chainId === this.$config.supportedChainId) {
        // fetch provider from user's wallet
        provider = this.signer
      }

      // if domain is not provided, then fetch it
      if (!this.domain && this.uAddress) {
        const domainName = await getDomainName(this.uAddress, provider)

        if (domainName) {
          this.domain = String(domainName).replace(this.$config.tldName, "") + this.$config.tldName
          storeUsername(window, this.uAddress, this.domain)
        }
      }

      if (this.domain && !this.uAddress) {
        const domainHolder = await getDomainHolder(String(this.domain).toLowerCase().split('.')[0], provider)

        if (domainHolder !== ethers.constants.AddressZero) {
          this.uAddress = domainHolder
        }

        this.domain = String(this.domain).replace(this.$config.tldName, "") + this.$config.tldName
        storeUsername(window, this.uAddress, this.domain)
      }

      await this.fetchBalance()
    },

    async fetchBalance() {
      if (this.uAddress) {
        let provider = this.$getFallbackProvider(this.$config.supportedChainId)

        // fetch balance of an address
        this.uBalance = await provider.getBalance(this.uAddress)

        if (this.$config.chatTokenAddress) {
          // fetch chat balance
          const chatTokenInterface = new ethers.utils.Interface(['function balanceOf(address owner) view returns (uint256)'])

          const chatTokenContract = new ethers.Contract(this.$config.chatTokenAddress, chatTokenInterface, provider)

          this.balanceChatTokenWei = await chatTokenContract.balanceOf(this.uAddress)
        }

        // fetch activity points balance
        if (this.$config.activityPointsAddress && this.$config.showFeatures.activityPoints) {
          this.balanceAp = await getActivityPoints(this.uAddress, provider);
        }
      }
    },

    async fetchPayflowUsername() {
      try {
        const res = await axios.get("https://api.alpha.payflow.me/api/user/"+this.uAddress);

        if (res.data && res.data.username) {
          this.payflowUsername = res.data.username;
        }
      } catch (e) {
        console.error(e);
      }
    },

    async insertImage(imageUrl) {
      this.newImageLink = imageUrl

      if (imageUrl) {
        storeData(window, this.domainWithoutExtension, { image: imageUrl }, "img")
      }
    },
  },

  setup() {
    const { address, balance, chainId, isActivated, signer } = useEthers()
    const userStore = useUserStore()
    const toast = useToast()

    return { address, balance, chainId, isActivated, userStore, shortenAddress, signer, toast }
  },

  watch: {
    address() {
      this.fetchAddressAndDomain()
    },

    uAddress() {
      this.fetchPayflowUsername();
    },
  },
}
</script>