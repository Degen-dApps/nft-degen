<template>
<div class="card border mt-3">
  <div class="card-body">

    <!-- Tabs Navigation -->
    <ul class="nav nav-tabs nav-fill">
      <li class="nav-item" v-if="aUrl">
        <button 
          class="nav-link" 
          :class="currentTab === 'audio' ? 'active' : ''" 
          @click="currentTab = 'audio'" 
        >Audio</button>
      </li>

      <li class="nav-item" v-if="vUrl">
        <button 
          class="nav-link" 
          :class="currentTab === 'video' ? 'active' : ''" 
          @click="currentTab = 'video'" 
        >Video</button>
      </li>

      <li class="nav-item" v-if="yUrl">
        <button 
          class="nav-link" 
          :class="currentTab === 'youtube' ? 'active' : ''" 
          @click="currentTab = 'youtube'" 
        >YouTube</button>
      </li>
    </ul>

    <!-- Tabs Content -->
    <div class="tab-content mt-3 d-flex justify-content-center">

      <!-- Audio Player Tab -->
      <div class="col-12 col-lg-8" v-if="currentTab === 'audio' && aUrl">
        <p class="text-center mt-3">
          <audio class="ratio ratio-16x9" controls>
            <source :src="aUrl" type="audio/mpeg" @error="handleAudioError">
            Your browser does not support mp3 audio player.
          </audio>
        </p>
      </div>

      <!-- Video player Tab -->
      <div class="col-12 col-lg-8" v-if="currentTab === 'video' && vUrl">
        <video class="ratio ratio-16x9 rounded" controls>
          <source :src="vUrl" type="video/mp4" @error="handleVideoError">
          Your browser does not support mp4 video player.
        </video>
      </div>

      <!-- YouTube Tab -->
      <div class="col-12 col-lg-8" v-if="currentTab === 'youtube' && yUrl">
        <span v-html="youtubeParsing(yUrl)"></span>
      </div>
    </div>

  </div>
</div>
</template>

<script>
import { youtubeParsing } from '~/utils/textUtils';

export default {
  name: 'CollectionMediaSection',
  props: ["audioUrl", "videoUrl", "youtubeUrl"],

  data() {
    return {
      aUrl: null,
      currentTab: "audio",
      vUrl: null,
      yUrl: null
    };
  },

  mounted() {
    this.fetchMetadata();
  },

  methods: {
    youtubeParsing,

    async fetchMetadata() {
      try {
        if (this.youtubeUrl) {
          this.yUrl = this.youtubeUrl;
        }

        if (this.audioUrl) {
          this.aUrl = this.audioUrl;

          if (this.aUrl.startsWith("ipfs://")) {
            this.aUrl = this.aUrl.replace("ipfs://", this.$config.ipfsGateway);
          } else if (this.aUrl.startsWith("https://ipfs.itslit.org/ipfs/")) {
            this.aUrl = this.aUrl.replace("https://ipfs.itslit.org/ipfs/", this.$config.ipfsGateway);
          } /*else if (this.aUrl.startsWith("https://ipfs.dylmusic.com/ipfs/")) {
            this.aUrl = this.aUrl.replace("https://ipfs.dylmusic.com/ipfs/", this.$config.ipfsGateway);
          }*/
        }

        if (this.videoUrl) {
          this.vUrl = this.videoUrl;

          if (this.vUrl.startsWith("ipfs://")) {
            this.vUrl = this.vUrl.replace("ipfs://", this.$config.ipfsGateway);
          } else if (this.vUrl.startsWith("https://ipfs.itslit.org/ipfs/")) {
            this.vUrl = this.vUrl.replace("https://ipfs.itslit.org/ipfs/", this.$config.ipfsGateway);
          } /*else if (this.vUrl.startsWith("https://ipfs.dylmusic.com/ipfs/")) {
            this.vUrl = this.vUrl.replace("https://ipfs.dylmusic.com/ipfs/", this.$config.ipfsGateway);
          }*/
        }
      } catch (e) {
        console.log(e);
      }

      if (this.yUrl) {
        this.currentTab = "youtube";
      } else if (this.aUrl) {
        this.currentTab = "audio";
      } else if (this.vUrl) {
        this.currentTab = "video";
      }
    },

    handleAudioError() {
      if (this.aUrl.startsWith(this.$config.ipfsGateway)) {
        this.aUrl = this.aUrl.replace(this.$config.ipfsGateway, this.$config.ipfsGateway2);
      }
    },

    handleVideoError() {
      if (this.vUrl.startsWith(this.$config.ipfsGateway)) {
        this.vUrl = this.vUrl.replace(this.$config.ipfsGateway, this.$config.ipfsGateway2);
      }
    },
  },
}
</script>