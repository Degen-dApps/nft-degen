<template>
  <p><small><em>
    Missing NFTs in the list? 
    <span class="wannabe-link-underlined" data-bs-toggle="modal" data-bs-target="#addMissingNftModal">Add them manually here</span>.
  </em></small></p>

  <div class="d-flex justify-content-center mb-3" v-if="waitingData && !nftsList">
    <span class="spinner-border spinner-border-lg" role="status" aria-hidden="true"></span>
  </div>

  <NftCollectionsList v-if="nftsList" :nftsList="nftsList" />

  <div class="d-flex justify-content-center" v-if="moreResults">
    <button :disabled="waitingData" class="btn btn-primary" @click="fetchNfts">
      <span v-if="waitingData" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      Load More
    </button>
  </div>

  <!-- Modal: add missing NFT address -->
  <div class="modal fade" id="addMissingNftModal" tabindex="-1" aria-labelledby="addMissingNftModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="addMissingNftModalLabel">Add missing NFT address</h1>
          <button id="closeAddMissingNftModal" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <div class="modal-body">
          <p>
            If you don't see the NFT that 
            <span v-if="isCurrentUsersProfile">you hold</span> 
            <span v-if="!isCurrentUsersProfile">this user holds</span> 
            in this list - don't worry! We don't have all of them in our indexer/API yet. 
          </p>

          <p>
            So help us out and add the address of the NFT (from NFTdegen) that
            <span v-if="isCurrentUsersProfile">you hold</span> 
            <span v-if="!isCurrentUsersProfile">this user holds</span> 
            here:
          </p>

          <div class="mb-3">
            <input 
              v-model="nftAddressToAdd"
              type="text" 
              class="form-control"  
              placeholder="NFT address" 
              v-on:keyup.enter="addNftToApi"
            />
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button @click="addNftToApi" type="button" class="btn btn-primary">Submit address</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ethers } from 'ethers';
import { useEthers } from 'vue-dapp';
import { useToast } from "vue-toastification/dist/index.mjs";
import NftCollectionsList from '~/components/nft/list/NftCollectionsList.vue';

export default {
  name: "UserMintedNfts",
  props: ["uAddress", "limit"],

  components: {
    NftCollectionsList
  },

  data() {
    return {
      nftAddressToAdd: null,
      cursor: null,
      moreResults: false,
      nftsList: [],
      waitingData: false
    };
  },

  mounted() {
    if (this.uAddress) {
      this.fetchNfts();
    }
  },

  computed: {
    isCurrentUsersProfile() {
      return String(this.uAddress).toLowerCase() === String(this.address).toLowerCase();
    }
  },

  methods: {
    async addNftToApi() {
      // check if nftAddressToAdd is a valid address
      if (!ethers.utils.isAddress(this.nftAddressToAdd)) {
        this.toast("Invalid NFT address. It has to be a crypto address starting with 0x.", {type: "error"});
        return;
      }

      try {
        // TODO: call /endpoints/user-nfts/add with nftAddress and userAddress URL params
        let url = `https://api.nftdegen.org/endpoints/user-nfts/add?nftAddress=${this.nftAddressToAdd}&userAddress=${this.uAddress}`;
        await axios.get(url);

        this.toast("NFT address sent to API, refreshing...", {type: "info"});
      } catch (error) {
        console.error(error);
      } finally {
        this.nftAddressToAdd = null;
        document.getElementById('closeAddMissingNftModal').click();
        
        // pause for 2 seconds before fetching nfts again
        await new Promise(resolve => setTimeout(resolve, 2000));
        this.fetchNfts("true");
      }
    },

    async fetchNfts(clear="false") {
      if (clear === "true") {
        this.nftsList = [];
        this.cursor = null;
        this.moreResults = false;
      }

      this.waitingData = true;

      if (!this.limit) {
        this.limit = 8;
      }

      // Fetch NFTs
      try {
        let url = `https://api.nftdegen.org/endpoints/mintedNftsByUser?addr=${this.uAddress}&limit=${this.limit}`;

        if (this.cursor && this.moreResults) {
          url += `&cursor=${this.cursor}`;
        }

        const response = await axios.get(url);

        // append response.data.collections to nftsList
        this.nftsList = this.nftsList.concat(response.data.collections);

        if (response.data?.cursor) {
          this.cursor = response.data.cursor.endCursor;

          if (response.data.cursor?.moreResults) {
            if (response.data.cursor?.moreResults === "MORE_RESULTS_AFTER_LIMIT") {
              this.moreResults = true;
            } else {
              this.moreResults = false;
            }
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.waitingData = false;
      }
    },
  },

  setup() {
    const { address } = useEthers();
    const toast = useToast();

    return { address, toast };
  },
}
</script>