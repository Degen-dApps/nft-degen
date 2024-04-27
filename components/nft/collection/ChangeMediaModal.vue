<template>
  <div class="modal fade" id="changeMediaModal" tabindex="-1" :aria-labelledby="'modalLabel-'+componentId" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" :id="'modalLabel-'+componentId">Change media metadata</h1>
          <button :id="'closeModal-'+componentId" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <div class="modal-body">
          <p>Change media metadata for your NFT.</p>

          <div class="mt-4">
            <div class="mb-2">
              <label :for="'input-audio-'+componentId" class="form-label">
                <strong>
                  Set a new .mp3 audio URL for your NFT:
                </strong>
              </label>

              <input v-model="audioUrl" placeholder="Enter .mp3 URL here" type="text" class="form-control" :id="'input-audio-'+componentId">
            </div>

            <button @click="setAudio" :disabled="waitingAudio" class="btn btn-primary">
              <span v-if="waitingAudio" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              Submit audio URL
            </button>
          </div>

          <div class="mt-4">
            <div class="mb-2">
              <label :for="'input-video-'+componentId" class="form-label">
                <strong>
                  Set a new .mp4 video URL for your NFT:
                </strong>
              </label>

              <input v-model="videoUrl" placeholder="Enter .mp4 URL here" type="text" class="form-control" :id="'input-video-'+componentId">
            </div>

            <button @click="setVideo" :disabled="waitingVideo" class="btn btn-primary">
              <span v-if="waitingVideo" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              Submit video URL
            </button>
          </div>

          <div class="mt-4">
            <div class="mb-2">
              <label :for="'input-youtube-'+componentId" class="form-label">
                <strong>
                  Set a new YouTube video URL for your NFT:
                </strong>
              </label>

              <input v-model="youtubeUrl" placeholder="Enter YouTube URL here" type="text" class="form-control" :id="'input-youtube-'+componentId">
            </div>

            <button @click="setYoutube" :disabled="waitingYoutube" class="btn btn-primary">
              <span v-if="waitingYoutube" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              Submit YouTube URL
            </button>
          </div>

        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
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

export default {
  name: 'ChangeMediaModal',
  props: ["cAddress", "mdAddress"],

  data() {
    return {
      componentId: null,
      audioUrl: null,
      videoUrl: null,
      youtubeUrl: null,
      waitingAudio: false,
      waitingVideo: false,
      waitingYoutube: false,
    }
  },

  mounted() {
    this.componentId = this.$.uid;
  },

  methods: {
    async setAudio() {
      this.waitingAudio = true;

      const metadataInterface = new ethers.utils.Interface([
        "function setAudioUrl(address nftAddress_, string memory audioUrl_) external "
      ]);
      
      const metadataContract = new ethers.Contract(this.mdAddress, metadataInterface, this.signer);

      try {
        const tx = await metadataContract.setAudioUrl(
          this.cAddress, 
          this.audioUrl
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

          this.toast("You have successfully set a new audio URL.", {
            type: "success",
            onClick: () => window.open(this.$config.blockExplorerBaseUrl+"/tx/"+tx.hash, '_blank').focus()
          });

          try {
            await axios.get('https://api.nftdegen.org/endpoints/music-nfts/add?nftAddress='+this.cAddress);
          } catch (e) {
            console.error(e);
          }

          this.audioUrl = null;

          this.waitingAudio = false;
        } else {
          this.toast.dismiss(toastWait);
          this.waitingAudio = false;
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

        this.waitingAudio = false;
      }
    },

    async setVideo() {
      this.waitingVideo = true;

      const metadataInterface = new ethers.utils.Interface([
        "function setAnimationUrl(address nftAddress_, string memory animationUrl_) external "
      ]);
      
      const metadataContract = new ethers.Contract(this.mdAddress, metadataInterface, this.signer);

      try {
        const tx = await metadataContract.setAnimationUrl(
          this.cAddress, 
          this.videoUrl
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

          this.toast("You have successfully set a new video URL.", {
            type: "success",
            onClick: () => window.open(this.$config.blockExplorerBaseUrl+"/tx/"+tx.hash, '_blank').focus()
          });

          try {
            await axios.get('https://api.nftdegen.org/endpoints/video-nfts/add?nftAddress='+this.cAddress);
          } catch (e) {
            console.error(e);
          }

          this.videoUrl = null;

          this.waitingVideo = false;
        } else {
          this.toast.dismiss(toastWait);
          this.waitingVideo = false;
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

        this.waitingVideo = false;
      }
    },

    async setYoutube() {
      this.waitingYoutube = true;

      const metadataInterface = new ethers.utils.Interface([
        "function setYoutubeUrl(address nftAddress_, string memory youtubeUrl_) external "
      ]);
      
      const metadataContract = new ethers.Contract(this.mdAddress, metadataInterface, this.signer);

      try {
        const tx = await metadataContract.setYoutubeUrl(
          this.cAddress, 
          this.youtubeUrl
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

          this.toast("You have successfully set a new YouTube URL.", {
            type: "success",
            onClick: () => window.open(this.$config.blockExplorerBaseUrl+"/tx/"+tx.hash, '_blank').focus()
          });

          try {
            await axios.get('https://api.nftdegen.org/endpoints/video-nfts/add?nftAddress='+this.cAddress);
          } catch (e) {
            console.error(e);
          }

          this.youtubeUrl = null;

          this.waitingYoutube = false;
        } else {
          this.toast.dismiss(toastWait);
          this.waitingYoutube = false;
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

        this.waitingYoutube = false;
      }
    },
  },

  setup() {
    const { signer } = useEthers();
    const toast = useToast();

    return { signer, toast };
  },
}
</script>