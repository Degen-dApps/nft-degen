import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';

// https://nuxt.com/docs/api/configuration/nuxt-config 
export default defineNuxtConfig({
  app: {
    head: {
      meta: [
        {
          "name": "viewport",
          "content": "width=device-width, initial-scale=1"
        },
        {
          "charset": "utf-8"
        }
      ],
      link: [
        { // Bootstrap
          rel: "stylesheet",
          href: "	https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        },
        { // Bootstrap icons
          rel: "stylesheet",
          href: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"
        },
        { // Custom
          rel: "stylesheet",
          href: "/css/custom.css"
        }
      ],
      script: [
        {
          src: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
        }
      ]
    }
  },
  components: false,
  css: [
    'vue-toastification/dist/index.css' 
  ],
  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
  ],
  router: {
    options: {
      hashMode: false
    }
  },
  runtimeConfig: {
    public: {
      activityPointsAddress: "0x50045895e1983F39FDC149C9a5AC29C39BEA18fe",
      airdropApAddress: "", // chat token claim for APs
      airdropClaimDomainsAddress: "", // chat token claim for domain holders
      blockExplorerBaseUrl: "https://explorer.degen.tips",
      chatChannels: { // go to Orbis Dashboard (https://useorbis.com/dashboard), create a new Project and then create a new Context for each of the channels below
        "general": "kjzl6cwe1jw149zsapqlwdgyu1eu3a489jlhpmwsrcxbh7z3wh09lwgpclgay81", // general discussion channel
        "memesImages": "kjzl6cwe1jw148vo99d9oxi3eythf8lj1dluo9b2c53hxurj0swa9vy2rs50bme",
        "shill": "kjzl6cwe1jw146ovuujljzgifqngnau17coortsp5adn6ma7ylwtupa97x099eb",
        "nftLaunchpad": "kjzl6cwe1jw146vywbt9pa43w3yciyj9o3qp122hfghk4vh6fgvptplyaqqyyul",
        "friendKeys": "kjzl6cwe1jw1479c4tqbw9uxoxfa9gq5w4ttrwsx374t3hi6j7o25320tf71x8s",
      },
      chatTokenAddress: "", // chat token address
      chatTokenImage: "", // chat token image
      chatTokenSymbol: "", // chat token symbol or name
      domainRequiredToPost: false,
      expiryCollections: 1000 * 60 * 60 * 24 * 7, // must be in milliseconds (0 means no expiration)
      expiryUsernames: 1000 * 60 * 60 * 24 * 7, // must be in milliseconds (0 means no expiration)
      favicon: "/img/favicon.svg",
      fileUploadEnabled: true, // enable/disable file uploads (enable only if external file storage is used, e.g. IPFS via Thirdweb)
      fileUploadSizeLimit: 1 * 1024 * 1024, // max file upload size in bytes (1 * 1024 * 1024 = 1 MB)
      fileUploadTokenService: process.env.FILE_UPLOAD_SERVICE || "netlify", // "netlify" or "vercel" (or leave empty for no file uploads)
      getPostsLimit: 30, // number of posts to fetch from Orbis in the getPosts() function
      governanceUrl: "https://warpcast.com/~/channel/degen", // governance url (snapshot, Tally, etc.)
      iggyPostAddress: "0x99Dbf11aCd46baFBCE82506FaeB4F13E6Ea1726A",
      iggyPostMinterAddress: "0xabf9960132818049340253C3Ca0551F92Db856d7",
      iggyPostStatsAddress: "0x0BF6333Fc85159663A30Ac89FD02c5031B97c5ee",
      imagekitEndpoint: process.env.IMAGEKIT_ENDPOINT,
      imagekitPublicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      ipfsGateway: "https://ipfs.io/ipfs/", 
      ipfsGateway2: "https://nftdegeniggy.myfilebase.com/ipfs/", 
      ipfsGateway3: "https://cloudflare-ipfs.com/ipfs/", 
      keysAddress: "", // FriendKeys contract address 
      keysFeatured: ["tempe", "tekr"],
      linkPreviews: process.env.LINK_PREVIEW_SERVICE || "netlify", // "netlify", "vercel", or "microlink" (or leave empty for no link previews)
      lpTokenAddress: "", // liquidity pool token (token to stake in the staking contract)
      lpTokenSymbol: "LP tokens", // LP token symbol
      marketplacePostNftUrl: "https://explorer.degen.tips/token/0x99Dbf11aCd46baFBCE82506FaeB4F13E6Ea1726A",
      marketplacePostNftItemUrl: "https://explorer.degen.tips/token/0x99Dbf11aCd46baFBCE82506FaeB4F13E6Ea1726A/instance/", // url (append nft id to it)
      marketplaceNftCollectionBaseUrl: "https://explorer.degen.tips/token/", // url (append nft address to it)
      newsletterLink: "https://paragraph.xyz/@iggy?modal=subscribe",
      nftDefaultRatio: 169, // default ratio for the NFT price bonding curve
      nftLaunchpadBondingAddress: "0x1EB2Adc19eB3Df26D84427Be11F1eB1887c6631c", // NFT launchpad with bonding curve contract address
      nftLaunchpadLatestItems: 8, // number of latest NFTs to show in the NFT launchpad
      orbisTest: false, // if true, test context will be used instead of the production one
      orbisTestContext: "kjzl6cwe1jw145tfqv2eqv8tiz6puo27meyz4smz40atppuc13tulqca87k35z2", // test context
      previewImage: "/img/covers/cover.png",
      previewImageAirdrop: "/img/covers/cover-airdrop.png",
      previewMusicNfts: "/img/covers/cover-music-nfts.png",
      previewImageNftCollection: "/img/covers/cover-nft-collection.png",
      previewImageNftCreate: "/img/covers/cover-nft-create.png",
      previewImageNftLaunchpad: "/img/covers/cover-nft-launchpad.png",
      previewImagePost: "/img/covers/cover-post.png",
      previewImagePostNft: "/img/covers/cover-post-nft.png",
      previewImageProfile: "/img/covers/cover-profile.png",
      previewImageStake: "/img/covers/cover-stake.png",
      profileMintedPostIdsMax: 36, // max number of minted post ids to show in the profile page
      projectMetadataTitle: "NFTdegen.lol | NFT Launchpad & Marketplace on Degen Chain",
      projectName: "NFTdegen.lol",
      projectDescription: "NFTdegen.lol is a launchpad and marketplace where NFTs are always liquid!",
      projectTwitter: "https://twitter.com/iggysocial",
      projectUrl: "https://nftdegen.lol", // without trailing slash!
      punkMinterAddress: "0x1f8cf0bc042308677838fB50f264992A4e783610", // punk domain minter contract address
      punkNumberOfPrices: 5, // number of different prices (based on domain length), usually 1 (price()) or 5 (price1char() - price5char())
      punkTldAddress: "0x4087fb91A1fBdef05761C02714335D232a2Bf3a1", // punk domain TLD address
      randomPostsNumber: 1, // number of random post NFTs to show in the sidebar widget
      rpcCustom: process.env.RPC_CUSTOM || "https://rpc.degen.tips", // Custom RPC URL
      showFeatures: { // show/hide features in sidebars (if you have too many "true", make the sidebar scrollable --> sidebarLeftSticky: false)
        "activityPoints": true, 
        "airdrop": false, 
        "friendKeys": false, 
        "governance": false,
        "newsletter": false, 
        "nftLaunchpad": true, 
        "randomMintedPosts": true, 
        "searchPosts": false, 
        "swap": false, 
        "stake": false, 
        "sendTokens": true, 
        "spotify": false
      }, 
      showRepliesOnHomepage: true, // show replies on the homepage  
      sidebarLeftSticky: false, // make the left sidebar sticky (always visible)
      spotifyPlaylistId: "5y7f2Wxfq49G5KuNQfMPbk", // enter just the ID of the playlist (not the full URL)  
      stakingContractAddress: "", // this is also the stake/gov token address
      stakeTokenSymbol: "", // stake token symbol (governance token symbol)
      supportedChainId: 666666666,
      swapPriceImpactMaxBps: 1000, // max price impact in bips (1 bps = 0.01%, 1000bps = 10%) for the swap function
      swapRouterAddress: "0x0b7F9c544FAF10DFc6137Bd2ba9fF423cC62FBD7", // iggy swap router contract address
      tenorApiKey: process.env.TENOR_KEY || "",
      thirdwebClientId: process.env.THIRDWEB_CLIENT_ID || "",
      tldName: ".degen",
      tokenAddress: null, // leave null if it's a native token of the chain
      tokenDecimals: 18,
      tokenSymbol: "DEGEN"
    }
  },
  vite: {
    build: {
      target: ['es2020'] // fix big integer literals error
    },
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: 'globalThis'  // fix nuxt3 global
        },
        plugins: [
          NodeGlobalsPolyfillPlugin({
            process: true,  // fix nuxt3 process
            buffer: true
          }),
          NodeModulesPolyfillPlugin()
        ],
        target: "es2020" // fix big integer literals error
      }
    }
  }
})
