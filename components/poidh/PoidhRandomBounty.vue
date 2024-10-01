<template>
  <div>
    <div v-if="waiting" class="d-flex justify-content-center mb-3">
      <span class="spinner-border spinner-border-lg" role="status" aria-hidden="true"></span>
    </div>

    <div v-if="!waiting">
      <p>Bounty #{{ bountyId }}: {{ title }}</p>
      <p class="mb-4">{{ description }}</p>
      <p class="text-center">
        <a class="btn btn-outline-primary" target="_blank" :href="link">
          Go to bounty
          <i class="bi bi-box-arrow-up-right ms-1"></i>
        </a>
      </p>
    </div>
  </div>
</template>

<script>
import { ethers } from 'ethers';
import { useEthers } from '~/store/ethers'

export default {
  name: 'PoidhRandomBounty',

  data() {
    return {
      bountyId: null,
      contractAddress: "0x2445BfFc6aB9EEc6C562f8D7EE325CddF1780814",
      description: null,
      descriptionMaxLength: 200,
      link: null,
      title: null,
      waiting: false
    }
  },

  mounted() {
    this.fetchRandomBounty();
  },

  methods: {
    async fetchRandomBounty() {
      this.waiting = true;

      let provider = this.$getFallbackProvider(this.$config.supportedChainId);

      if (this.isActivated && this.chainId === this.$config.supportedChainId) {
        // fetch provider from user's wallet
        provider = this.signer;
      }

      const poidhInterface = new ethers.utils.Interface([
        "function bountyCounter() public view returns (uint256)",
        {
          "name": "bounties",
          "type": "function",
          "stateMutability": "view",
          "inputs": [{ "name": "", "type": "uint256" }],
          "outputs": [
              { "name": "", "type": "uint256" },    // id
              { "name": "", "type": "address" },    // issuer
              { "name": "", "type": "string" },     // name
              { "name": "", "type": "string" },     // description
              { "name": "", "type": "uint256" },    // amount
              { "name": "", "type": "address" },    // claimer
              { "name": "", "type": "uint256" },    // createdAt
              { "name": "", "type": "uint256" }     // claimId
          ]
        }
      ]);

      const poidhContract = new ethers.Contract(
        this.contractAddress,
        poidhInterface,
        provider
      );

      try {
        const bountyCounter = Number(await poidhContract.bountyCounter());

        /* */
        if (bountyCounter > 0) {
          const randomIndex = Math.floor(Math.random() * bountyCounter);

          const bounties = await poidhContract.bounties(randomIndex);

          this.title = bounties[2];
          this.description = bounties[3];

          if (this.description.length === 0) {
            this.description = 'No description provided';
          }

          // trim any spaces from the beginning and end of the description
          this.description = this.description.trim();

          // capitalize the first letter of the description and title
          this.description = this.description.charAt(0).toUpperCase() + this.description.slice(1);
          this.title = this.title.charAt(0).toUpperCase() + this.title.slice(1);

          // if the last character in the description is not a period, add one
          if (this.description.charAt(this.description.length - 1) !== '.') {
            this.description += '.';
          }

          // make sure description is not longer than 300 characters
          if (this.description.length > this.descriptionMaxLength) {
            this.description = this.description.substring(0, this.descriptionMaxLength) + '...';
          }

          this.bountyId = Number(bounties[0]);

          this.link = `https://poidh.xyz/degen/bounty/${this.bountyId}`;
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.waiting = false;
      }
    }
  },

  setup() {
    const { chainId, isActivated, signer } = useEthers();

    return {
      chainId,
      isActivated,
      signer
    }
  },
  
}
</script>