<template>
  <Head>
    <Title>About | {{ $config.projectMetadataTitle }}</Title>
    <Meta property="og:title" :content="'About | ' + $config.projectMetadataTitle" />
  </Head>

  <div class="card border scroll-500">
    <div class="card-body">
      <p class="fs-3" @click="$router.back()">
        <i class="bi bi-arrow-left-circle cursor-pointer"></i>
      </p>

      <h3 class="mb-3 mt-3">The First NFT Launchpad on the Degen Chain</h3>

      <p class="text-break mt-3">
        NFTdegen.lol is the first NFT launchpad and marketplace on the Degen Chain.
      </p>

      <p class="text-break mt-3">
        (Also accessible via NFTdegen.org, if you're of a more serious nature 🤪)
      </p>

      <h5>New kind of NFTs</h5>

      <p class="text-break mt-3">
        NFTs created on NFTdegen.lol are not your usual NFTs. Each NFT collection has a built-in pool which allows 
        the NFT to be <strong>always liquid</strong>.
      </p>

      <p class="text-break mt-3">
        This means that you can always sell your NFT back to the pool (except if you're the last one owning it 😄).
      </p>

      <h5>Useful links</h5>

      <ul>
        <li><a href="https://github.com/Degen-dApps" target="_blank">GitHub org</a></li>
        <li><a href="https://degendapps.lol" target="_blank">List of dApps on Degen Chain</a></li>
        <li><a href="https://degenname.lol/" target="_blank">DegenName.lol</a></li>
        <li><a href="https://warpcast.com/tempetechie.eth" target="_blank">Tempe Techie 🎩</a></li>
        <li><a href="https://warpcast.com/tekr0x.eth" target="_blank">Tekr 🎩</a></li>
      </ul>

      <h5>Tech stack</h5>

      <p class="text-break mt-3">
        This app is built on top of various decentralized and open source technologies, such as:
      </p>

      <ul>
        <li><a href="https://ipfs.tech/" target="_blank">IPFS</a></li>
        <li><a href="https://ceramic.network/" target="_blank">Ceramic Network</a></li>
        <li><a href="https://useorbis.com/" target="_blank">Orbis</a></li>
        <li><a href="https://punk.domains/" target="_blank">Punk Domains</a></li>
        <li><a href="https://iggy.social/" target="_blank">Iggy Social</a></li>
        <li>... and others.</li>
      </ul>

      <p class="text-break mt-3">
        There is no reliance on any web2 backend code/database, which means you can easily run your own instance of this app. 
        It will show the same content as this instance, but you can add your touches to the frontend.
      </p>

      <hr />

      <h5>Feedback</h5>

      <p class="text-break mt-3">
        Feel free to contact 
        <a href="https://warpcast.com/tempetechie.eth" target="_blank">Tempe Techie 🎩</a> or
        <a href="https://warpcast.com/tekr0x.eth" target="_blank">Tekr 🎩</a> 
        via Warpcast. 
      </p>

    </div>
  </div>
</template>

<script>
export default {
  name: 'About'
}
</script>