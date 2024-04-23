<template>
  <div class="modal fade" id="sendNftModal" tabindex="-1" :aria-labelledby="'modalLabel-'+componentId" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" :id="'modalLabel-'+componentId">Transfer NFT</h1>
          <button :id="'closeModal-'+componentId" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <div class="modal-body">
          <p>
            Send/transfer NFT to another address. 
            <span v-if="!nftDataLoaded">First load the NFT image:</span>
          </p>

          <div v-if="nftDataLoaded" class="mt-4 row">
            <div class="col-md-4 col-6">
              <img :src="nftImage" class="img-fluid" alt="NFT image" height="100">
            </div>
          </div>

          <div v-if="nftDataLoaded" class="mt-4">
            <label :for="'inputAddress-'+componentId" class="form-label">
              <strong>
                Recipient address or .degen name:
              </strong>
            </label>

            <input 
              v-model="recipientInput" 
              @keyup="findBlankCharacter"
              type="text" 
              class="form-control" 
              :id="'inputAddress-'+componentId"
            />

            <div class="form-text" id="basic-addon4" v-if="hasBlankCharacter">
              <i class="bi bi-exclamation-triangle-fill"></i>
              This domain name contains a blank character: {{ encodeURIComponent(recipientInput) }}. Proceed with caution.
            </div>
          </div>

          <div class="mt-4">
            <label :for="'inputTokenId-'+componentId" class="form-label">
              <strong>
                NFT (token) ID to send:
              </strong>
            </label>

            <input v-model="tokenId" type="text" class="form-control" :id="'inputTokenId-'+componentId">

            <small><em>
              <span v-if="userSecondTokenId">Alternativelly you can use your second NFT ID: {{ userSecondTokenId }}.</span>
              Find all NFT IDs that you own 
              <a target="_blank" :href="`https://explorer.degen.tips/token/${cAddress}?tab=inventory&holder_address_hash=${address}`">on block explorer</a>.
            </em></small>
          </div>

          <button v-if="!nftDataLoaded" @click="loadNftData" type="button" class="btn btn-primary mt-2" :disabled="!tokenId || waiting">
            <span v-if="waiting" class="spinner-border spinner-border-sm mx-1" role="status" aria-hidden="true"></span>
            Load NFT image
          </button>

        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>

          <button v-if="nftDataLoaded" @click="transferNft" type="button" class="btn btn-primary" :disabled="!recipientInput || !tokenId || waiting">
            <span v-if="waiting" class="spinner-border spinner-border-sm mx-1" role="status" aria-hidden="true"></span>
            Transfer NFT
          </button>
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
import WaitingToast from "~/components/WaitingToast";
import { hasTextBlankCharacters } from '~/utils/textUtils';

export default {
  name: 'SendNftModal',
  props: ["cAddress", "userTokenId"],
  emits: ["fetchUserTokenId"], 

  data() {
    return {
      componentId: null,
      editDescription: null,
      hasBlankCharacter: false,
      nftDataLoaded: false,
      nftImage: null,
      recipientAddress: null,
      recipientInput: null,
      tokenId: null,
      userSecondTokenId: null,
      waiting: false
    }
  },

  mounted() {
    this.componentId = this.$.uid;
    this.tokenId = this.userTokenId;
  },

  methods: {
    hasTextBlankCharacters, // imported from text utils

    findBlankCharacter() {
      this.hasBlankCharacter = false;
      this.hasBlankCharacter = hasTextBlankCharacters(this.recipientInput);
    },

    async fetchUsersSecondNft() {
      // check if user has more than one NFT
      if (this.cAddress && this.address) {
        const nftInterface = new ethers.utils.Interface([
          "function tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256)"
        ]);

        const nftContract = new ethers.Contract(this.cAddress, nftInterface, this.signer);

        try {
          this.userSecondTokenId = await nftContract.tokenOfOwnerByIndex(this.address, 1); // get second NFT if it exists
        } catch (e) {
          this.userSecondTokenId = null;
        }
      }
    },

    async loadNftData() {
      // get NFT metadata from tokenURI
      this.waiting = true;

      const nftInterface = new ethers.utils.Interface([
        "function ownerOf(uint256 tokenId) external view returns (address)",
        "function tokenURI(uint256 tokenId) external view returns (string)"
      ]);

      try {
        const nftContract = new ethers.Contract(this.cAddress, nftInterface, this.signer);

        const holder = await nftContract.ownerOf(this.tokenId);

        if (holder !== this.address) {
          this.toast(`You are not the owner of NFT with ID ${this.tokenId}. Try some other ID number.`, {type: "error"});
          this.waiting = false;
          return;
        }

        const tokenURI = await nftContract.tokenURI(this.tokenId);

        if (tokenURI.startsWith("ipfs://")) {
          tokenURI = tokenURI.replace("ipfs://", "https://cloudflare-ipfs.com/ipfs/");
        }

        let json; // NFT metadata JSON

        if (tokenURI.startsWith("https://")) {
          try {
            const res = await axios.get(tokenURI);
            json = await res.data;
          } catch (error) {
            console.log("error fetching metadata from ipfs for token id: ", String(this.tokenId));
          }
        } else {
          const result = atob(tokenURI.substring(29));
          json = JSON.parse(result);
        }

        if (json["image"].startsWith("ipfs://")) {
          json["image"] = json["image"].replace("ipfs://", "https://cloudflare-ipfs.com/ipfs/");
        } 

        this.nftImage = json["image"];
        this.nftDataLoaded = true;
        this.waiting = false;
      } catch (e) {
        console.error(e);
        this.waiting = false;
      }

      await this.fetchUsersSecondNft();
    },

    async processRecipient(recipient) {
      if (recipient) {
        if (ethers.utils.isAddress(recipient)) {
          this.recipientAddress = recipient;
        } else {
          const domainName = String(recipient).trim().toLowerCase().replace(this.$config.tldName, "");

          // fetch provider from hardcoded RPCs
          let provider = this.$getFallbackProvider(this.$config.supportedChainId);

          if (this.isActivated && this.chainId === this.$config.supportedChainId) {
            // fetch provider from user's MetaMask
            provider = this.signer;
          }

          const tldInterface = new ethers.utils.Interface([
            "function getDomainHolder(string) view returns (address)"
          ]);

          const tldContract = new ethers.Contract(this.$config.punkTldAddress, tldInterface, provider);

          this.recipientAddress = await tldContract.getDomainHolder(domainName);
        }
      }
    },

    async transferNft() {
      this.waiting = true;

      await this.processRecipient(this.recipientInput);

      const nftInterface = new ethers.utils.Interface([
        "function transferFrom(address from, address to, uint256 tokenId) external"
      ]);
      
      const nftContract = new ethers.Contract(this.cAddress, nftInterface, this.signer);

      try {
        const tx = await nftContract.transferFrom(this.address, this.recipientAddress, this.tokenId);

        const toastWait = this.toast(
          {
            component: WaitingToast,
            props: {
              text: "Please wait for your transaction to confirm. Click on this notification to see transaction in the block explorer."
            }
          },
          {
            type: "info",
            onClick: () => window.open(this.$config.blockExplorerBaseUrl+"/tx/"+tx.hash, '_blank').focus()
          }
        );

        const receipt = await tx.wait();

        if (receipt.status === 1) {
          this.toast.dismiss(toastWait);

          this.toast("You have successfully transferred the NFT.", {
            type: "success",
            onClick: () => window.open(this.$config.blockExplorerBaseUrl+"/tx/"+tx.hash, '_blank').focus()
          });

          try {
            // add to recipient's NFT list
            await axios.get('https://api.nftdegen.org/endpoints/user-nfts/add?nftAddress='+this.cAddress+'&userAddress='+this.recipientAddress);

            // remove from sender's NFT list (the same API endpoint is used for both adding and removing)
            await axios.get('https://api.nftdegen.org/endpoints/user-nfts/add?nftAddress='+this.cAddress+'&userAddress='+this.address);
          } catch (e) {
            console.error(e);
          }

          // update sender's NFT balance
          this.$emit("fetchUserTokenId");

          this.recipientAddress = null;
          this.recipientInput = null;
          this.tokenId = null;
          this.nftDataLoaded = false;

          // close the modal
          document.getElementById('closeModal-'+this.componentId).click();

          this.waiting = false;
        } else {
          this.toast.dismiss(toastWait);
          this.waiting = false;
          this.toast("Transaction has failed.", {
            type: "error",
            onClick: () => window.open(this.$config.blockExplorerBaseUrl+"/tx/"+tx.hash, '_blank').focus()
          });
          console.log(receipt);
        }
      } catch (e) {
        console.error(e);

        try {
          let extractMessage = e.message.split("reason=")[1];
          extractMessage = extractMessage.split(", method=")[0];
          extractMessage = extractMessage.replace(/"/g, "");
          extractMessage = extractMessage.replace('execution reverted:', "Error:");

          console.log(extractMessage);
          
          this.toast(extractMessage, {type: "error"});
        } catch (e) {
          this.toast("Transaction has failed.", {type: "error"});
        }

        this.waiting = false;
      }
    },
  },

  setup() {
    const { address, chainId, isActivated, signer } = useEthers();
    const toast = useToast();

    return { address, chainId, isActivated, signer, toast };
  },

  watch: {
    userTokenId() {
      this.tokenId = this.userTokenId;
    },

    tokenId() {
      this.nftDataLoaded = false;
    }
  }
}
</script>