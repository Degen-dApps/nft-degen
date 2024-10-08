<template>
  <Head>
    <Title>Create NFT Collection | {{ $config.projectMetadataTitle }}</Title>
    <Meta property="og:title" :content="'Create NFT Collection | ' + $config.projectMetadataTitle" />

    <Meta name="description" :content="'Create your very own NFT collection on ' + $config.projectName + '!'" />

    <Meta property="og:image" :content="$config.projectUrl+$config.previewImageNftCreate" />
    <Meta property="og:description" :content="'Create your very own NFT collection on ' + $config.projectName + '!'" />

    <Meta name="twitter:image" :content="$config.projectUrl+$config.previewImageNftCreate" />
    <Meta name="twitter:description" :content="'Create your very own NFT collection on ' + $config.projectName + '!'" />

    <Link rel="canonical" :href="$config.projectUrl+'/nft/create'" />
  </Head>

  <div class="card border scroll-500">
    <div class="card-body">

      <p class="fs-3">
        <i class="bi bi-arrow-left-circle cursor-pointer" @click="$router.back()"></i>
      </p>

      <h3 class="mb-4 mt-3">Create NFT Collection</h3>

      <div class="d-flex justify-content-center mb-3" v-if="waitingData">
        <span class="spinner-border spinner-border-lg" role="status" aria-hidden="true"></span>
      </div>

      <p class="mb-4" v-if="createPrice">
        Price for creating a collection is {{ createPrice }} {{ $config.tokenSymbol }}.
      </p>

      <!-- Collection Name -->
      <div class="mb-4">
        <label for="cName" class="form-label">Collection Name</label>
        <input 
          type="text" class="form-control" id="cName" aria-describedby="cNameHelp"
          placeholder="e.g. Crypto Punks" 
          v-model="cName"
        />
      </div>

      <!-- Symbol -->
      <div class="mb-4">
        <label for="cSymbol" class="form-label">Collection Symbol</label>
        <input 
          type="text" class="form-control" id="cSymbol" aria-describedby="cSymbolHelp" 
          placeholder="e.g. PUNKS" 
          v-model="cSymbol"
        />
        <div id="cSymbolHelp" class="form-text">Collection symbol (required by the ERC-721 smart contract, but not really important).</div>
      </div>

      <!-- Image -->
      <div class="mb-2">
        <label for="cImage" class="form-label">Collection Image (can be changed later)</label>
        <div class="input-group" aria-describedby="cImageHelp" id="cImage">
          <input 
            v-model="cImage"
            type="text" 
            class="form-control" 
            placeholder="Enter image URL or click the upload button"
          >

          <button
            v-if="isActivated && $config.fileUploadEnabled !== ''" 
            class="btn btn-outline-secondary rounded-end-2" 
            data-bs-toggle="modal" :data-bs-target="'#fileUploadModal'+$.uid"
          >
            <i class="bi bi-file-earmark-image-fill"></i>
            Upload
          </button>
        </div>
        <div id="cImageHelp" class="form-text">Even if you want a generative PFP collection, put a single preview image for now and you will change it to a metadata link later.</div>
      </div>

      <div v-if="cImage" class="mb-4">
        <Image :url="cImage" cls="img-thumbnail img-fluid" style="max-width: 100px;" />
        <br />
        <small>If image didn't appear above, then something is wrong with the link you added (wait until the loading indicator completes).</small>
      </div>

      <!-- Description -->
      <div class="mb-4">
        <label for="cDescription" class="form-label">Collection Description (can be changed later)</label>
        <input 
          type="text" class="form-control" id="cDescription" aria-describedby="cDescriptionHelp" 
          placeholder="Keep it short and sweet." 
          v-model="cDescription"
        />
        <div id="cDescriptionHelp" class="form-text">Too long description means higher gas cost for storing it.</div>
      </div>

      <!-- Unique ID -->
      <div class="mb-4">
        <label for="uniqueId" class="form-label">Unique ID (store it - just in case)</label>
        <input 
          type="text" class="form-control" id="uniqueId" aria-describedby="uniqueIdHelp" 
          disabled readonly 
          v-model="uniqueId"
        />
        <div id="uniqueIdHelp" class="form-text">This is just in case the frontend will not show you the NFT collection address and you'll need to find it manually.</div>
      </div>

      <!-- Ratio -->
      <div class="mb-4">
        <label for="ratio" class="form-label">Bonding Curve Ratio</label>
        <input 
          type="text" class="form-control" id="ratio" aria-describedby="ratioHelp" 
          v-model="ratio"
        />
        <div id="ratioHelp" class="form-text">
          Price for mint #1 will be {{ getLessDecimals(calculatePrice(2, ratio)) }} {{ $config.tokenSymbol }}, 
          for mint #5 will be {{ getLessDecimals(calculatePrice(5, ratio)) }} {{ $config.tokenSymbol }},
          for mint #20 will be {{ getLessDecimals(calculatePrice(20, ratio)) }} {{ $config.tokenSymbol }}, 
          for mint #80 will be {{ getLessDecimals(calculatePrice(80, ratio)) }} {{ $config.tokenSymbol }}, etc. (assuming there are no sells in-between)
        </div>
      </div>

      <!-- Buttons div -->
      <div class="d-flex justify-content-center mt-5 mb-5">

        <!-- Create Collection button -->
        <button 
          :disabled="waitingCreate || !fieldsValid"
          v-if="isActivated && isSupportedChain && !launchpadPaused"
          class="btn btn-primary" 
          type="button"
          @click="createCollection" 
        >
          <span v-if="waitingData || waitingCreate" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Create NFT Collection for {{ createPrice }} {{ $config.tokenSymbol }}
        </button>

        <!-- Paused button -->
        <button :disabled="true" v-if="isActivated && isSupportedChain && launchpadPaused" class="btn btn-primary">
          Paused
        </button>

        <!-- Connect Wallet button -->
        <ConnectWalletButton v-if="!isActivated && !isSupportedChain" class="btn btn-primary" btnText="Connect wallet" />
        <SwitchChainButton v-if="isActivated && !isSupportedChain" />
        
      </div>

      <!-- Upload Image Modal -->
      <FileUploadModal 
        v-if="isMounted" 
        @processFileUrl="insertImage"
        title="Upload your NFT image"
        infoText="Upload the NFT image."
        :storageType="$config.fileUploadStorageType"
        :componentId="$.uid"
        :maxFileSize="$config.fileUploadSizeLimit"
      />
      <!-- END Upload Image Modal -->

    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ethers } from 'ethers';
import { useEthers } from '~/store/ethers'
import { useToast } from "vue-toastification/dist/index.mjs";
import ConnectWalletButton from "~/components/ConnectWalletButton.vue";
import Image from '~/components/Image.vue';
import SwitchChainButton from '~/components/SwitchChainButton.vue';
import WaitingToast from "~/components/WaitingToast";
import FileUploadModal from "~/components/storage/FileUploadModal.vue";
import { useUserStore } from '~/store/user';
import { getLessDecimals } from '~/utils/numberUtils';
import { fetchReferrer } from '~/utils/storageUtils';

export default {
  name: 'NftCreate',

  data() {
    return {
      cDescription: null,
      cImage: null,
      cName: null,
      cSymbol: null,
      isMounted: false,
      launchpadPaused: null,
      createPriceWei: null,
      ratio: null,
      uniqueId: null,
      waitingCreate: false,
      waitingData: false
    }
  },

  components: {
    ConnectWalletButton,
    FileUploadModal,
    Image,
    SwitchChainButton,
    WaitingToast
  },

  mounted() {
    this.isMounted = true;
    this.ratio = this.$config.nftDefaultRatio;
    this.fetchData();
  },

  computed: {
    cleanDescription() {
      if (!this.cDescription) return null;

      return this.cDescription.replace(/"/g, "'") // replace double quotes with single quotes
    },

    createPrice() {
      if (!this.createPriceWei) return null;

      const price = Number(ethers.utils.formatEther(this.createPriceWei));

      return Number.parseFloat(price);
    },

    fieldsValid() {
      return this.cName && this.cSymbol && this.cImage && this.cDescription && this.ratio;
    },

    isSupportedChain() {
      if (this.chainId === this.$config.supportedChainId) {
        return true;
      } else {
        return false;
      }
    },

    parseImageLink() {
      let parsedImage = this.cImage;

      if (parsedImage && parsedImage.includes("ipfs://")) {
        parsedImage = parsedImage.replace("ipfs://", this.$config.ipfsGateway);
      }

      return parsedImage;
    }
  },

  methods: {
    calculatePrice(nftId, ratio) {
      const supply = Number(nftId) - 1;

      return (((supply * (supply + 1) * (2 * supply + 1)) - ((supply - 1) * supply * (2 * (supply - 1) + 1))) * 10000 / 42069) * Number(ratio) / 31337;
    },

    async createCollection() {
      this.waitingCreate = true;

      //return this.$router.push({ path: '/nft/collection', query: { id: this.address } });

      if (this.signer) {
        // create launchpad contract object
        const launchpadInterface = new ethers.utils.Interface([
          `function launch(
              address contractOwner_,
              address referrer_,
              string memory mdDescription_,
              string memory mdImage_,
              string memory mdName_,
              string memory name_,
              string memory symbol_,
              string calldata uniqueId_, 
              uint256 ratio_
            ) external payable`,
            "function getNftContractAddress(string calldata _uniqueId) external view returns(address)"
        ]);

        const launchpadContract = new ethers.Contract(
          this.$config.nftLaunchpadBondingAddress,
          launchpadInterface,
          this.signer
        );

        try {
          const tx = await launchpadContract.launch(
            this.address, // contract owner
            fetchReferrer(window), // referrer
            this.cleanDescription, // collection description
            this.cImage, // collection image
            this.cName, // NFT name
            this.cName, // collection name
            this.cSymbol, // collection symbol
            this.uniqueId, // unique ID to easily find the NFT contract address
            ethers.utils.parseEther(String(this.ratio)), // bonding curve ratio
            { value: this.createPriceWei } // price for creating collection
          );

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

            this.toast("You have successfully created an NFT collection!", {
              type: "success",
              onClick: () => window.open(this.$config.blockExplorerBaseUrl+"/tx/"+tx.hash, '_blank').focus()
            });

            // add collection to the API
            try {
              await axios.get('https://api.nftdegen.org/endpoints/collections/add?uniqueId='+this.uniqueId);
            } catch (e) {
              console.error(e);
            }

            // after successful launch, fetch the collection address and redirect to the collection page
            const nftContractAddress = await launchpadContract.getNftContractAddress(this.uniqueId);

            this.$router.push({ path: '/nft/collection', query: { id: nftContractAddress } });

            this.waitingCreate = false;
          } else {
            this.toast.dismiss(toastWait);
            this.waitingCreate = false;
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
          
          this.waitingCreate = false;
        }
      }

      this.waitingCreate = false;
    },

    async fetchData() {
      this.waitingData = true;

      // fetch provider from hardcoded RPCs
      let provider = this.$getFallbackProvider(this.$config.supportedChainId);

      if (this.isActivated && this.chainId === this.$config.supportedChainId) {
        // fetch provider from user's MetaMask
        provider = this.signer;
      }

      // create launchpad contract object
      const launchpadInterface = new ethers.utils.Interface([
        "function paused() public view returns(bool)",
        "function isUniqueIdAvailable(string calldata _uniqueId) public view returns(bool)",
        "function price() public view returns(uint256)"
      ]);

      const launchpadContract = new ethers.Contract(
        this.$config.nftLaunchpadBondingAddress,
        launchpadInterface,
        provider
      );

      // check if paused
      this.launchpadPaused = await launchpadContract.paused();

      // generate unique ID and check if it's already been used
      // Math.random().toString(36).slice(2);
      this.uniqueId = Math.random().toString(36).slice(2);

      const isUniqueIdAvailable = await launchpadContract.isUniqueIdAvailable(this.uniqueId);

      if (!isUniqueIdAvailable) {
        this.uniqueId = Math.random().toString(36).slice(10);
      }

      // get price for creating collection
      this.createPriceWei = await launchpadContract.price();

      this.waitingData = false;
    },

    insertImage(imageUrl) {
      this.cImage = imageUrl.replace("?.img", "");
    },
  },

  setup() {
    const { address, chainId, isActivated, signer } = useEthers();
    const userStore = useUserStore();
    const toast = useToast();

    return { address, chainId, isActivated, signer, toast, userStore }
  },
}
</script>