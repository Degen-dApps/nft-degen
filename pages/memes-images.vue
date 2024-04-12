<template>
  <Head>
    <Title>Memes & Images | {{ $config.projectMetadataTitle }}</Title>
    <Meta property="og:title" :content="'Memes & Images | ' + $config.projectMetadataTitle" />
    <Link rel="canonical" :href="$config.projectUrl+'/memes-images'" />
  </Head>

  <ChatFeed 
    class="mt-1" 
    :showQuotedPost="$config.showRepliesOnHomepage" 
    :orbisContext="$config.chatChannels.memesImages" 
  />
</template>

<script>
import ChatFeed from "../components/chat/ChatFeed.vue"

export default {
  name: "MemesImages",

  components: {
    ChatFeed
  }
}
</script>