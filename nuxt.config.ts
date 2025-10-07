import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: false, // disables Nuxt Webtools
  ssr: false, // full static site generation
  modules: ['@wagmi/vue/nuxt'],
  css: ['vue-toastification/dist/index.css'],
  components: false,
  app: {
    head: {
      meta: [
        {
          charset: 'utf-8',
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        {
          name: 'fc:miniapp',
          content: '{"version":"next", "imageUrl":"https://nftdegen.lol/img/farcaster/fc-image.png", "button":{"title":"Launch and Trade Liquid NFTs", "action":{ "type":"launch_miniapp", "name":"NFTdegen", "url":"https://nftdegen.lol", "splashImageUrl":"https://nftdegen.lol/img/farcaster/fc-icon.png", "splashBackgroundColor":"#212529"}}}',
        },
      ],
      link: [
        {
          // Bootstrap
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
        },
        {
          // Bootstrap icons
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css',
        },
        {
          // Custom
          rel: 'stylesheet',
          href: '/css/custom.css',
        },
      ],
      script: [
        {
          src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
        },
      ],
    },
  },
  runtimeConfig: {
    public: {
      activityPointsAddress: '0x50045895e1983F39FDC149C9a5AC29C39BEA18fe',
      airdropApAddress: '', // chat token claim for APs
      airdropClaimDomainsAddress: '', // chat token claim for domain holders
      arweaveAddress: process.env.ARWEAVE_ADDRESS,
      arweaveGateway: 'https://arweave.net/',
      arweaveMinBalance: 0.02, // minimum AR balance to upload files
      blockExplorerBaseUrl: 'https://explorer.degen.tips',
      chat: {
        contexts: {
          general: '0x2FbE49507442d8d4B7d2d3010bCac2e76b01a248', // general discussion channel
          memesImages: '0x2FbE49507442d8d4B7d2d3010bCac2e76b01a248',
          shill: '0x2FbE49507442d8d4B7d2d3010bCac2e76b01a248',
          nftLaunchpad: '0x7f8fAc07e9F55f7016113E44A49D4d15Eb895928', // comments context
        },
        storage: 'arweave', // storage type: 'arweave' or 'ipfs'
      },
      chatTokenAddress: '', // chat token address
      chatTokenDecimals: 18,
      chatTokenImage: 'https://www.pngall.com/wp-content/uploads/8/Gold-Dollar-Coin-PNG-180x180.png', // chat token image
      chatTokenSymbol: 'DEMO', // chat token symbol or name
      domainRequiredToPost: true,
      expiryCollections: 1000 * 60 * 60 * 24 * 7, // must be in milliseconds (0 means no expiration)
      expiryMods: 1000 * 60 * 60 * 24 * 7, // must be in milliseconds (0 means no expiration)
      expiryPfps: 1000 * 60 * 60 * 24 * 10, // must be in milliseconds (0 means no expiration)
      expiryUsernames: 1000 * 60 * 60 * 24 * 7, // must be in milliseconds (0 means no expiration)
      farcasterShareText: 'Check out NFTdegen.lol - NFT Launchpad And Marketplace on Degen Chain!',
      favicon: '/img/favicon.ico',
      fileUploadEnabled: true, // enable/disable file uploads (enable only if external file storage is used, e.g. Arweave)
      fileUploadSizeLimit: 1 * 1024 * 1024, // max file upload size in bytes (1 * 1024 * 1024 = 1 MB)
      fileUploadStorageType: "arweave", // "arweave" or "imagekit"
      fileUploadTokenService: process.env.FILE_UPLOAD_SERVICE || 'netlify', // "netlify" or "vercel" (or leave empty for no file uploads)
      getPostsLimit: 10, // number of posts to fetch
      governanceUrl: 'https://farcaster.xyz/~/channel/degen', // governance url (snapshot, Tally, etc.)
      imagekitEndpoint: process.env.IMAGEKIT_ENDPOINT,
      imagekitPublicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      ipfsGateway: 'https://ipfs.io/ipfs/',
      ipfsGateway2: 'https://cloudflare-ipfs.com/ipfs/',
      ipfsGateway3: 'https://ipfs.filebase.io/ipfs/',
      linkPreviews: process.env.LINK_PREVIEW_SERVICE || 'netlify', // "netlify", "vercel", or "microlink" (or leave empty for no link previews)
      lpTokenAddress: '', // liquidity pool token (token to stake in the staking contract)
      lpTokenSymbol: 'LP tokens', // LP token symbol
      lpTokenDecimals: 18,
      marketplaceNftCollectionBaseUrl: 'https://explorer.degen.tips/token/', // url (append nft address to it)
      newsletterLink: 'https://paragraph.xyz/@iggy?modal=subscribe',
      nftDefaultRatio: 169, // default ratio for the NFT price bonding curve
      nftLaunchpadBondingAddress: '0x1EB2Adc19eB3Df26D84427Be11F1eB1887c6631c', // NFT launchpad with bonding curve contract address
      nftLaunchpadLatestItems: 8, // number of latest NFTs to show in the NFT launchpad
      previewImage: '/img/covers/cover.png',
      previewImageAirdrop: '/img/covers/cover-airdrop.png',
      previewImageNftCollection: '/img/covers/cover-nft-collection.png',
      previewImageNftCreate: '/img/covers/cover-nft-create.png',
      previewImageNftLaunchpad: '/img/covers/cover-nft-launchpad.png',
      previewImagePost: '/img/covers/cover-post.png',
      previewImagePostNft: '/img/covers/cover-post-nft.png',
      previewImageProfile: '/img/covers/cover-profile.png',
      previewImageStake: '/img/covers/cover-stake.png',
      previewMusicNfts: '/img/covers/cover-music-nfts.png',
      previewVideoNfts: '/img/covers/cover-video-nfts.png',
      projectMetadataTitle: 'NFTdegen.lol | NFT Launchpad And Marketplace on Degen Chain',
      projectName: 'NFTdegen.lol',
      projectDescription: 'NFTdegen.lol is a launchpad and marketplace on Degen Chain where NFTs are always liquid!',
      projectTwitter: '@iggysocial',
      projectUrl: 'https://nftdegen.lol', // without trailing slash!
      punkMinterAddress: '0x1f8cf0bc042308677838fB50f264992A4e783610', // punk domain minter contract address
      punkNumberOfPrices: 5, // number of different prices (based on domain length), usually 1 (price()) or 5 (price1char() - price5char())
      punkTldAddress: '0x4087fb91A1fBdef05761C02714335D232a2Bf3a1', // punk domain TLD address
      showFeatures: {
        // show/hide features in sidebars (if you have too many "true", make the sidebar scrollable --> sidebarLeftSticky: false)
        activityPoints: true,
        airdrop: false,
        governance: false,
        newsletter: false,
        nftLaunchpad: true,
        swap: false,
        stake: false,
        sendTokens: true,
      },
      sidebarLeftSticky: false, // make the left sidebar sticky (always visible)
      stakingContractAddress: '', // this is also the stake/gov token address
      stakeTokenDecimals: 18,
      stakeTokenSymbol: 'IGT', // stake token symbol (governance token symbol)
      supportedChainId: 666666666,
      swapPriceImpactMaxBps: 1000, // max price impact in bips (1 bps = 0.01%, 1000bps = 10%) for the swap function
      swapRouterAddress: '0x0b7F9c544FAF10DFc6137Bd2ba9fF423cC62FBD7', // iggy swap router contract address
      tenorApiKey: process.env.TENOR_KEY || '',
      tldName: '.degen',
      tokenAddress: undefined, // leave undefined if it's a native token of the chain
      tokenDecimals: 18,
      tokenSymbol: 'DEGEN',
    }
  },
  compatibilityDate: '2025-06-21',
  vite: {
    server: {
      allowedHosts: true
    }
  },
})