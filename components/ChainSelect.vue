<template>
  <select class="select select-primary">
    <option
      v-for="chain in supportedChains"
      :key="chain.name"
    >
      {{ chain.name }}
    </option>
  </select>
</template>

<script setup lang="ts">
const mySorobanContext = useSoroban();
const { activeChain, setActiveChain, chains: supportedChains } = mySorobanContext.value;
</script>