<template>
  <Head>
    <Title>NFT Collection Details | {{ $config.projectMetadataTitle }}</Title>
    <Meta property="og:title" :content="'NFT Collection Details | ' + $config.projectMetadataTitle" />

    <Meta name="description" :content="'Check this NFT collection on ' + $config.projectName + '!'" />

    <Meta property="og:image" :content="$config.projectUrl+$config.previewImageNftCollection" />
    <Meta property="og:description" :content="'Check this NFT collection on ' + $config.projectName + '!'" />

    <Meta name="twitter:image" :content="$config.projectUrl+$config.previewImageNftCollection" />
    <Meta name="twitter:description" :content="'Check this NFT collection on ' + $config.projectName + '!'" />
  </Head>

  <div class="card border">
    <div class="card-body">
      <p class="fs-3">
        <i @click="$router.push({ path: '/' })" class="bi bi-arrow-left-circle cursor-pointer"></i>
      </p>

      <h3 class="mb-3 mt-3" v-if="!cName">NFT Collection Details</h3>
      <h3 class="mb-3 mt-3" v-if="cName">{{ cName }}</h3>

      <div class="d-flex justify-content-center mb-3" v-if="waitingData">
        <span class="spinner-border spinner-border-lg" role="status" aria-hidden="true"></span>
      </div>

      <div class="row">

        <div class="col-md-5 text-center mb-3">
          <!-- Collection image -->
          <img :src="cImage" class="img-fluid img-thumbnail rounded col-12" />

          <!-- Actions dropdown -->
          <div class="dropdown mt-3">
            <button class="btn btn-outline-primary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              Actions
            </button>
            <ul class="dropdown-menu">

              <li v-if="isCurrentAddressOwner">
                <span class="dropdown-item cursor-pointer" data-bs-toggle="modal" data-bs-target="#changeDescriptionModal">
                  Change description
                </span>
              </li>

              <li v-if="isCurrentAddressOwner">
                <span class="dropdown-item cursor-pointer" data-bs-toggle="modal" data-bs-target="#changeCollectionPreviewModal">
                  Change collection preview image
                </span>
              </li>

              <li v-if="isCurrentAddressOwner && cType == 0">
                <span class="dropdown-item cursor-pointer" data-bs-toggle="modal" data-bs-target="#addImageToCollectionModal">
                  Add additional image to collection
                </span>
              </li>

              <li v-if="isCurrentAddressOwner && cType == 0">
                <span class="dropdown-item cursor-pointer" data-bs-toggle="modal" data-bs-target="#removeImageFromCollectionModal">
                  Remove image from collection
                </span>
              </li>

              <li v-if="isCurrentAddressOwner">
                <span class="dropdown-item cursor-pointer" data-bs-toggle="modal" data-bs-target="#changeNftTypeModal">
                  Change collection type
                </span>
              </li>

              <li v-if="address && userTokenId">
                <a class="dropdown-item cursor-pointer" target="_blank" :href="seeYourNftsLink">
                  See your NFTs on the block explorer
                </a>
              </li>

              <li v-if="address && userTokenId">
                <span class="dropdown-item cursor-pointer" data-bs-toggle="modal" data-bs-target="#sendNftModal">
                  Send your NFT to another address
                </span>
              </li>

              <li><span class="dropdown-item cursor-pointer" @click="getCollectionDetails(true)">Refresh metadata</span></li>

              <li><span class="dropdown-item cursor-pointer" @click="copyFrameLink">Copy Farcaster Frame link</span></li>

            </ul>
          </div>

        </div>

        <!-- Collection details -->
        <div class="col-md-7">
          <div class="mt-1 mb-4 muted-text" style="font-size: 14px;">

            <p class="me-4">
              <i class="bi bi-file-earmark-text-fill me-1"></i>
              <span v-if="readMore" v-html="cDescription"></span>
              <span v-if="!readMore" v-html="formattedDescription"></span>
              <span v-if="descriptionTooLong" class="wannabe-link cursor-pointer ms-1" @click="readMore=!readMore">
                <em>
                  (read <span v-if="!readMore">more</span><span v-if="readMore">less</span>)
                </em>
              </span>
            </p>

            <p class="me-4">
              <i class="bi bi-person me-1"></i>
              Author:
              <span v-if="getUsernameOrShortAddress"> 
                <NuxtLink :to="'/profile/?id='+String(getUsernameOrFullAddress)">{{getUsernameOrShortAddress}}</NuxtLink>
              </span>
            </p>

            <p class="me-4">
              <i class="bi bi-coin me-1"></i>
              Buy/Sell price: {{ formatPrice(priceBuyWei) }} {{ $config.tokenSymbol }} / {{ formatPrice(priceSellWei) }} {{ $config.tokenSymbol }}
            </p>

            <p class="me-4">
              <i class="bi bi-file-earmark-binary me-1"></i>
              {{ cSupply }} NFTs minted 
              <span v-if="getBuysAmount">({{ getBuysAmount }} buys, {{ getSellsAmount }} sells)</span>
            </p>

            <p class="me-4">
              <i class="bi bi-clipboard me-1"></i>
              <span @click="copyFrameLink" class="wannabe-link cursor-pointer">
                Click to copy Farcaster Frame link & earn referral fees
              </span>
            </p>

            <!--
            <p class="me-4">
              <i class="bi bi-box-arrow-up-right me-2"></i>
              <a :href="$config.blockExplorerBaseUrl+'/address/'+cAddress" target="_blank" style="text-decoration: none;">
                {{ shortenAddress(cAddress) }}
              </a>
              <span v-if="getUsernameOrShortAddress"> by 
                <NuxtLink :to="'/profile/?id='+String(getUsernameOrFullAddress)">{{getUsernameOrShortAddress}}</NuxtLink>
              </span>
            </p>
            -->

            <p class="me-4">
              <i class="bi bi-box-arrow-up-right me-1"></i>
              <a :href="collectionExplorerLink" target="_blank" style="text-decoration: none;">
                See on block explorer
              </a>
            </p>
          </div>
          <!-- END Data -->

          <!-- Buttons -->
          <div class="row mb-3">

            <div v-if="!isActivated || !isSupportedChain" class="d-grid gap-2 col">
              <ConnectWalletButton v-if="!isActivated" class="btn btn-primary" btnText="Connect wallet" />
              <SwitchChainButton v-if="isActivated && !isSupportedChain" />
            </div>

            <div v-if="isActivated && isSupportedChain" class="d-grid gap-2 col">
              <button @click="buyNft" class="btn btn-primary" type="button" :disabled="waitingData || waitingBuy" >
                <span v-if="waitingBuy" class="spinner-border spinner-border-sm mx-1" role="status" aria-hidden="true"></span>
                Buy for {{ formatPrice(priceBuyWei) }} {{ $config.tokenSymbol }}
              </button>
            </div>

            <div v-if="isActivated && isSupportedChain" class="d-grid gap-2 col">
              <button @click="sellNft" class="btn btn-primary" type="button" :disabled="waitingData || waitingSell || !userTokenId || priceSellWei == 0" >
                <span v-if="waitingSell" class="spinner-border spinner-border-sm mx-1" role="status" aria-hidden="true"></span>
                Sell for {{ formatPrice(priceSellWei) }} {{ $config.tokenSymbol }}
              </button>
            </div>
            
          </div>

          <small v-if="isActivated && isSupportedChain">
            <em>
              (Price may still change after pressing the button, so make sure to check the {{ $config.tokenSymbol }} amount in wallet.)
            </em>
          </small>
          <!-- END Buttons -->

        </div>
      </div>

    </div>
  </div>

  <!-- Farcaster Frame referral link 
  <div class="card border mt-3 scroll-500">
    <div class="card-body">

      <h5 class="mb-2 mt-3 text-center">Share Farcaster Frame link and earn referral fees</h5>

      <div class="d-flex justify-content-center">
        <div class="col-12 col-lg-8">

          <p class="text-break text-center mt-3 mb-4">
            ...
          </p>

        </div>
      </div>

    </div>
  </div>
  -->

  <!-- Alert to buy an NFT to chat -->
  <div v-if="!userTokenId" class="card border mt-3 scroll-500">
    <div class="card-body">

      <h5 class="mb-2 mt-3 text-center">Buy an NFT to see the chat</h5>

      <div class="d-flex justify-content-center">
        <div class="col-12 col-lg-8">

          <p class="text-break text-center mt-3 mb-4">
            This NFT's chat is open only for NFT holders. Buy an NFT to see the chat and talk with the NFT creator and other NFT holders.
          </p>

        </div>
      </div>

    </div>
  </div>

  <!-- YouTube video -->
  <CollectionMediaSection :metadataUrl="cMetadataUrl" v-if="cMetadataUrl && userTokenId" />

  <!-- Chat feed -->
  <ChatFeed 
    v-if="$config.chatChannels.nftLaunchpad && userTokenId" 
    :key="cAddress"
    class="mt-3 scroll-500" 
    :showQuotedPost="$config.showRepliesOnHomepage" 
    :orbisContext="$config.chatChannels.nftLaunchpad+':'+cAddress" 
  />

  <!-- Add image modal -->
  <AddImageToCollectionModal :cAddress="cAddress" :mdAddress="mdAddress" />

  <!-- Change collection preview image modal -->
  <ChangeCollectionPreviewModal :cAddress="cAddress" :mdAddress="mdAddress" @saveCollection="saveCollection" />

  <!-- Change description modal -->
  <ChangeDescriptionModal :cAddress="cAddress" :cDescription="cDescription" :mdAddress="mdAddress" @saveCollection="saveCollection" />

  <!-- Change Metadata URL Modal -->
  <ChangeNftTypeModal :mdAddress="mdAddress" :cType="cType" :cAddress="cAddress" @saveCollection="saveCollection" />

  <!-- Remove Image From Collection Modal -->
  <RemoveImageFromCollectionModal :mdAddress="mdAddress" :cAddress="cAddress" />

  <!-- Send NFT Modal -->
  <SendNftModal :cAddress="cAddress" :userTokenId="userTokenId" @fetchUserTokenId="fetchUserTokenId" />
</template>

<script>
import axios from 'axios';
import { ethers } from 'ethers';
import { useEthers, shortenAddress } from 'vue-dapp';
import { useToast } from "vue-toastification/dist/index.mjs";
import ChatFeed from "~/components/chat/ChatFeed.vue";
import ConnectWalletButton from "~/components/ConnectWalletButton.vue";
import SwitchChainButton from '~/components/SwitchChainButton.vue';
import WaitingToast from "~/components/WaitingToast";
import AddImageToCollectionModal from "~/components/nft/collection/AddImageToCollectionModal";
import ChangeCollectionPreviewModal from "~/components/nft/collection/ChangeCollectionPreviewModal";
import ChangeDescriptionModal from "~/components/nft/collection/ChangeDescriptionModal";
import ChangeNftTypeModal from "~/components/nft/collection/ChangeNftTypeModal";
import CollectionMediaSection from '~/components/nft/collection/CollectionMediaSection.vue';
import RemoveImageFromCollectionModal from "~/components/nft/collection/RemoveImageFromCollectionModal";
import SendNftModal from '~/components/nft/collection/SendNftModal.vue';
import { getDomainName } from '~/utils/domainUtils';
import { fetchCollection, fetchUsername, storeCollection, storeUsername } from '~/utils/storageUtils';
import { getTextWithoutBlankCharacters, urlParsing, youtubeParsing } from '~/utils/textUtils';
import { useUserStore } from '~/store/user';

export default {
  name: 'NftCollection',

  data() {
    return {
      cAuthorAddress: null,
      cAuthorDomain: null,
      cCounter: null,
      cDescription: null,
      cImage: null,
      cMetadataUrl: null,
      cName: null,
      cSupply: null,
      cType: 0,
      mdAddress: null,
      priceBuyWei: null,
      priceSellWei: null,
      readMore: false,
      userTokenId: null, // if user owns at least one NFT, this will be set to the first token ID that user owns
      waitingBuy: false,
      waitingData: false,
      waitingSell: false,
    }
  },

  components: {
    AddImageToCollectionModal,
    ChangeCollectionPreviewModal,
    ChangeDescriptionModal,
    ChangeNftTypeModal,
    ChatFeed,
    CollectionMediaSection,
    ConnectWalletButton,
    RemoveImageFromCollectionModal,
    SendNftModal,
    SwitchChainButton,
    WaitingToast
  },

  mounted() {
    if (this.cAddress) {
      // check if address is valid
      if (!ethers.utils.isAddress(this.cAddress)) {
        this.toast("Invalid NFT address.", {type: "error"});
        return this.$router.push({ path: '/' });
      }

      // check if address is in removedFromFrontend list
      if (this.removedFromFrontend.includes(this.cAddress.toLowerCase())) {
        this.toast("Invalid NFT address.", {type: "error"});
        return this.$router.push({ path: '/' });
      }

      this.getCollectionDetails();
    }
  },

  computed: {

    cAddress() {
      if (this.$route.query?.id) {
        return this.$route.query.id;
      }

      return null;
    },

    collectionExplorerLink() {
      return this.$config.blockExplorerBaseUrl+"/token/"+this.cAddress;
    },

    descriptionTooLong() {
      if (this.cDescription) {
        return this.cDescription.length > 420;
      }

      return false;
    },

    formattedDescription() {
      if (this.cDescription) {
        let dsc = urlParsing(this.cDescription);

        // if description is longer than limit, cut it
        const dscLimit = 420;
        if (dsc.length > dscLimit) {
          return dsc.substring(0, dscLimit) + "...";
        } else {
          return dsc;
        }
      }

      return null;
    },

    getBuysAmount() {
      if (!this.cCounter) {
        return null;
      }

      return this.cCounter - 1;
    },

    getCurrentUserDomainNameOrAddress() {
      if (this.address) {
        if (this.userStore.getDefaultDomain) {
          return getTextWithoutBlankCharacters(this.userStore.getDefaultDomain);
        }

        return this.address;
      }
      
      return null;
    },

    getSellsAmount() {
      if (!this.cCounter || !this.cSupply) {
        return null;
      }

      return this.cCounter - 1 - this.cSupply;
    },

    getUsernameOrFullAddress() {
      if (this.cAuthorDomain) {
        let cleanName = String(this.cAuthorDomain).replace(this.$config.tldName, "");
        return getTextWithoutBlankCharacters(cleanName) + this.$config.tldName;
      } else {
        return this.cAuthorAddress;
      }
    },

    getUsernameOrShortAddress() {
      if (this.cAuthorAddress) {
        if (this.cAuthorDomain) {
          let cleanName = String(this.cAuthorDomain).replace(this.$config.tldName, "");
          return getTextWithoutBlankCharacters(cleanName) + this.$config.tldName;
        } else {
          return shortenAddress(this.cAuthorAddress);
        }
      }

      return null;
    },

    isCurrentAddressOwner() {
      if (this.cAuthorAddress && this.address) {
        return String(this.cAuthorAddress).toLowerCase() === String(this.address).toLowerCase();
      }

      return false;
    },

    isSupportedChain() {
      if (this.chainId === this.$config.supportedChainId) {
        return true;
      } else {
        return false;
      }
    },

    removedFromFrontend() {
      // a list of NFT addresses that were launched via NFTdegen, but were removed from the frontend 
      // (due to various reasons, e.g. art theft, inappropriate content, etc.)
      return [
        "0x53360d60e661065480a7bd6bebe6bfb17124df32".toLowerCase(), // Top Degen stamp NFT stolen art from Andrea (@andreaboi)
      ];
    },

    seeYourNftsLink() {
      return this.$config.blockExplorerBaseUrl+"/token/"+this.cAddress+"?tab=inventory&holder_address_hash="+this.address;
    },
  },

  methods: {

    getDomainName,

    async buyNft() {
      this.waitingBuy = true;

      const nftInterface = new ethers.utils.Interface([
        "function counter() public view returns (uint256)",
        "function getBurnPrice() public view returns (uint256)",
        "function getMintPrice() public view returns (uint256)",
        "function mint(address to) external payable returns (uint256)",
        "function tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256)",
        "function totalSupply() public view returns (uint256)"
      ]);

      const nftContract = new ethers.Contract(this.cAddress, nftInterface, this.signer);

      // fetch the price again to get the latest price
      this.priceBuyWei = await nftContract.getMintPrice();

      try {
        const tx = await nftContract.mint(this.address, {
          value: this.priceBuyWei
        });

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

          this.toast("You have successfully bought the NFT! Congrats!", {
            type: "success",
            onClick: () => window.open(this.$config.blockExplorerBaseUrl+"/tx/"+tx.hash, '_blank').focus()
          });

          try {
            await axios.get('https://api.nftdegen.org/endpoints/collections/update?scope=mint&nftAddress='+this.cAddress);
            await axios.get('https://api.nftdegen.org/endpoints/user-nfts/add?nftAddress='+this.cAddress+'&userAddress='+this.address);
          } catch (e) {
            console.error(e);
          }

          await this.fetchUserTokenId();
          
          this.cSupply = await nftContract.totalSupply();
          this.cCounter = await nftContract.counter();
        } else {
          this.toast.dismiss(toastWait);
          this.waitingBuy = false;
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
      } finally {
        this.waitingBuy = false;

        // refresh prices
        this.priceBuyWei = await nftContract.getMintPrice();
        this.priceSellWei = await nftContract.getBurnPrice();
      }
    },

    copyFrameLink() {
      let frameLink = "https://frames.nftdegen.org/frame/nft/"+this.cAddress;

      if (this.getCurrentUserDomainNameOrAddress) {
        frameLink += "?ref="+this.getCurrentUserDomainNameOrAddress;
      }

      navigator.clipboard.writeText(frameLink);

      this.toast("Frame link copied to your clipboard. Share it on Farcaster!", {type: "success"});
    },

    async fetchUserDomain() {
      if (this.cAuthorAddress) {
        const userDomain = await this.getDomainName(this.cAuthorAddress);

        if (userDomain) {
          this.cAuthorDomain = userDomain;
          storeUsername(window, this.cAuthorAddress, userDomain+this.$config.tldName);
        }
      }
    },

    async fetchUserTokenId() {
      if (this.cAddress && this.signer) {
        const nftInterface = new ethers.utils.Interface([
          "function tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256)"
        ]);

        const nftContract = new ethers.Contract(this.cAddress, nftInterface, this.signer);

        try {
          this.userTokenId = await nftContract.tokenOfOwnerByIndex(this.address, 0);
        } catch (e) {
          this.userTokenId = null;
        }
      }
    },

    formatPrice(priceWei) {
      if (priceWei === null) {
        return null;
      }

      const price = Number(ethers.utils.formatEther(priceWei));

      if (price > 100) {
        return price.toFixed(0);
      } else if (price > 1) {
        return price.toFixed(2);
      } else if (price > 0.1) {
        return price.toFixed(4);
      } else if (price > 0.01) {
        return price.toFixed(5);
      } else if (price > 0.001) {
        return price.toFixed(6);
      } else if (price > 0.0001) {
        return price.toFixed(7);
      } else if (price > 0.00001) {
        return price.toFixed(8);
      } else if (price > 0.000001) {
        return price.toFixed(9);
      } else {
        return price;
      }
    },

    async getCollectionDetails(refresh=false) {
      this.waitingData = true;

      let collection = fetchCollection(window, this.cAddress);

      if (refresh) {
        // refresh collection data
        collection = null;
      }

      // fetch provider from hardcoded RPCs
      let provider = this.$getFallbackProvider(this.$config.supportedChainId);

      if (this.isActivated && this.chainId === this.$config.supportedChainId) {
        // fetch provider from user's MetaMask
        provider = this.signer;
      }

      const nftInterface = new ethers.utils.Interface([
        "function counter() public view returns (uint256)",
        "function getBurnPrice() public view returns (uint256)",
        "function getMintPrice() public view returns (uint256)",
        "function metadataAddress() public view returns (address)",
        "function name() public view returns (string memory)",
        "function owner() public view returns (address)",
        "function tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256)",
        "function totalSupply() public view returns (uint256)"
      ]);

      const nftContract = new ethers.Contract(this.cAddress, nftInterface, provider);

      if (collection?.mdAddress) {
        this.mdAddress = collection.mdAddress;
      } else {
        this.mdAddress = await nftContract.metadataAddress();
      }

      const metadataInterface = new ethers.utils.Interface([
        "function getCollectionDescription(address) public view returns (string memory)",
        "function getCollectionMetadataType(address nftAddress_) external view returns (uint256)",
        "function getCollectionMetadataUrl(address nftAddress_) external view returns (string memory)",
        "function getCollectionName(address nftAddress_) external view returns (string memory)",
        "function getCollectionPreviewImage(address) public view returns (string memory)"
      ]);
      
      const metadataContract = new ethers.Contract(this.mdAddress, metadataInterface, provider);

      // get collection details
      this.priceBuyWei = await nftContract.getMintPrice();
      this.priceSellWei = await nftContract.getBurnPrice();

      // get image
      if (collection?.image) {
        this.cImage = collection.image;
      } else {
        this.cImage = await metadataContract.getCollectionPreviewImage(this.cAddress);
      }

      // check if collection image uses Spheron IPFS gateway (in that case replace it with the IPFS gateway defined in the config)
      if (this.cImage.includes(".ipfs.sphn.link/")) {
        const linkParts = this.cImage.split(".ipfs.sphn.link/");
        const cid = linkParts[0].replace("https://", "");
        this.cImage = this.$config.ipfsGateway + cid + "/" + linkParts[1];
      }

      // get description
      if (collection?.description && collection.description !== "" && collection.description !== null) {
        this.cDescription = collection.description;
      } else {
        this.cDescription = await metadataContract.getCollectionDescription(this.cAddress);
      }

      // get type
      if (collection?.type >= 0) {
        this.cType = collection.type;
      } else {
        this.cType = Number(await metadataContract.getCollectionMetadataType(this.cAddress));
      }

      // get name
      if (collection?.name) {
        this.cName = collection.name;
      } else {
        this.cName = await metadataContract.getCollectionName(this.cAddress);

        if (!this.cName) {
          this.cName = await nftContract.name();
        }
      }

      await this.fetchUserTokenId();

      this.waitingData = false;

      // get total supply & counter
      this.cSupply = await nftContract.totalSupply();
      this.cCounter = await nftContract.counter();

      // get author address
      if (collection?.authorAddress) {
        this.cAuthorAddress = collection.authorAddress;
        this.cAuthorDomain = collection.authorDomain;
      } else {
        this.cAuthorAddress = await nftContract.owner();
      }
      
      // get username from storage
      this.cAuthorDomain = fetchUsername(window, this.cAuthorAddress);

      if (!this.cAuthorDomain) {
        this.fetchUserDomain();
      }

      // create collection object, JSON.stringify it and save it to session storage
      collection = {
        address: this.cAddress,
        authorAddress: this.cAuthorAddress,
        authorDomain: this.cAuthorDomain,
        description: this.cDescription,
        image: this.cImage,
        mdAddress: this.mdAddress,
        name: this.cName,
        type: this.cType
      };
      
      storeCollection(window, this.cAddress, collection);

      // check if collection has a metadata URL set
      this.cMetadataUrl = await metadataContract.getCollectionMetadataUrl(this.cAddress);
    },

    saveCollection(newCollectionData) {

      if (newCollectionData?.type) {
        this.cType = newCollectionData.type;
      }

      if (newCollectionData?.description) {
        this.cDescription = newCollectionData.description;
      }
      
      if (newCollectionData?.image) {
        this.cImage = newCollectionData.image;
      }

      // create collection object, JSON.stringify it and save it to session storage
      const collection = {
        address: this.cAddress,
        authorAddress: this.cAuthorAddress,
        authorDomain: this.cAuthorDomain,
        description: this.cDescription,
        image: this.cImage,
        mdAddress: this.mdAddress,
        name: this.cName,
        type: this.cType
      };

      storeCollection(window, this.cAddress, collection);
    },

    async sellNft() {
      this.waitingSell = true;

      const nftInterface = new ethers.utils.Interface([
        "function getBurnPrice() public view returns (uint256)",
        "function getMintPrice() public view returns (uint256)",
        "function burn(uint256 tokenId) external returns (uint256)",
        "function tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256)",
        "function totalSupply() public view returns (uint256)"
      ]);

      const nftContract = new ethers.Contract(this.cAddress, nftInterface, this.signer);

      try {
        const tx = await nftContract.burn(this.userTokenId); 

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

          this.toast("You have dumped the NFT.", {
            type: "success",
            onClick: () => window.open(this.$config.blockExplorerBaseUrl+"/tx/"+tx.hash, '_blank').focus()
          });

          try {
            await axios.get('https://api.nftdegen.org/endpoints/collections/update?scope=burn&nftAddress='+this.cAddress);
            await axios.get('https://api.nftdegen.org/endpoints/user-nfts/add?nftAddress='+this.cAddress+'&userAddress='+this.address);
          } catch (e) {
            console.error(e);
          }

          this.priceBuyWei = await nftContract.getMintPrice();
          this.priceSellWei = await nftContract.getBurnPrice();
          
          await this.fetchUserTokenId();

          this.cSupply = await nftContract.totalSupply();

          this.waitingSell = false;
        } else {
          this.toast.dismiss(toastWait);
          this.waitingSell = false;
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

        this.waitingSell = false;
      }
    },
  },

  setup() {
    const { address, chainId, isActivated, signer } = useEthers();
    const toast = useToast();
    const userStore = useUserStore();

    return { address, chainId, isActivated, shortenAddress, signer, toast, userStore }
  },

  watch: {
    cAddress() {
      if (this.cAddress) {
        // check if address is valid
        if (!ethers.utils.isAddress(this.cAddress)) {
          this.toast("Invalid NFT address.", {type: "error"});
          return this.$router.push({ path: '/' });
        }

        // check if address is in removedFromFrontend list
        if (this.removedFromFrontend.includes(this.cAddress.toLowerCase())) {
          this.toast("Invalid NFT address.", {type: "error"});
          return this.$router.push({ path: '/' });
        }

        this.getCollectionDetails();
      }
    }
  }
};
</script>
