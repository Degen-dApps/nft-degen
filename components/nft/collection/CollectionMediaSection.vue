<template>
<!-- YouTube video -->
<div class="card border mt-3">
  <div class="card-body">

    <!-- Tabs Navigation -->
    <ul class="nav nav-tabs nav-fill">
      <li class="nav-item" v-if="audioUrl">
        <button 
          class="nav-link" 
          :class="currentTab === 'audio' ? 'active' : ''" 
          @click="currentTab = 'audio'" 
        >Audio</button>
      </li>

      <li class="nav-item" v-if="videoUrl">
        <button 
          class="nav-link" 
          :class="currentTab === 'video' ? 'active' : ''" 
          @click="currentTab = 'video'" 
        >Video</button>
      </li>

      <li class="nav-item" v-if="youtubeUrl">
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
      <div class="col-12 col-lg-8" v-if="currentTab === 'audio' && audioUrl">
        <p class="text-center mt-3">
          <audio class="ratio ratio-16x9" controls>
            <source :src="audioUrl" type="audio/mpeg">
            Your browser does not support mp3 audio player.
          </audio>
        </p>
      </div>

      <!-- Video player Tab -->
      <div class="col-12 col-lg-8" v-if="currentTab === 'video' && videoUrl">
        <video class="ratio ratio-16x9 rounded" controls>
          <source :src="videoUrl" type="video/mp4">
          Your browser does not support mp4 video player.
        </video>
      </div>

      <!-- YouTube Tab -->
      <div class="col-12 col-lg-8" v-if="currentTab === 'youtube' && youtubeUrl">
        <span v-html="youtubeParsing(youtubeUrl)"></span>
      </div>
    </div>

  </div>
</div>
</template>

<script>
import axios from 'axios';
import { youtubeParsing } from '~/utils/textUtils';

export default {
  name: 'CollectionMediaSection',
  props: ["metadataUrl"],

  data() {
    return {
      audioUrl: null,
      currentTab: "audio",
      videoUrl: null,
      youtubeUrl: null,
    };
  },

  mounted() {
    this.fetchMetadata();
  },

  methods: {
    youtubeParsing,

    async fetchMetadata() {
      // if metadata URL is set, fetch metadata from it
      if (this.metadataUrl) {
        try {
          const metadataResponse = await axios.get(this.metadataUrl);

          if (metadataResponse.data?.youtube_url) {
            this.youtubeUrl = metadataResponse.data.youtube_url;
          }

          if (metadataResponse.data?.audio_url) {
            let aUrl = metadataResponse.data.audio_url;

            if (aUrl.startsWith("ipfs://")) {
              aUrl = aUrl.replace("ipfs://", this.$config.ipfsGateway);
            } else if (aUrl.startsWith("https://ipfs.itslit.org/ipfs/")) {
              aUrl = aUrl.replace("https://ipfs.itslit.org/ipfs/", this.$config.ipfsGateway);
            }

            this.audioUrl = aUrl;
          }

          if (metadataResponse.data?.animation_url) {
            let vUrl = metadataResponse.data.animation_url;

            if (vUrl.startsWith("ipfs://")) {
              vUrl = vUrl.replace("ipfs://", this.$config.ipfsGateway);
            } else if (vUrl.startsWith("https://ipfs.itslit.org/ipfs/")) {
              vUrl = vUrl.replace("https://ipfs.itslit.org/ipfs/", this.$config.ipfsGateway);
            }

            this.videoUrl = vUrl;
          }
        } catch (e) {
          console.log(e);
        }
      }

      if (this.youtubeUrl) {
        this.currentTab = "youtube";
      } else if (this.audioUrl) {
        this.currentTab = "audio";
      } else if (this.videoUrl) {
        this.currentTab = "video";
      }
    }
  },
}
</script>