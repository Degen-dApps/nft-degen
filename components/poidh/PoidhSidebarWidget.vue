<template>
  <div class="card m-2 bg-light">
    <div class="card-header bg-light">Random poidh bounty</div>
    <div class="card-body sidebar-card-body">
      <PoidhRandomBounty :cls="cls" />
    </div>
  </div>
</template>

<script>
import PoidhRandomBounty from './PoidhRandomBounty.vue';

export default {
  name: 'PoidhSidebarWidget',
  props: ["cls"],

  components: {
    PoidhRandomBounty
  }
  
}
</script>