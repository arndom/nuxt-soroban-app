<script setup lang="ts">
  const mySorobanContext = useSoroban();

  const { activeChain, setActiveChain, chains: supportedChains } = mySorobanContext.value;

  const selected = ref(activeChain?.name)

  watch(selected, () => {
    const chain = supportedChains.find((chain) => chain.name === selected.value);

    if (chain) {
      setActiveChain && setActiveChain(chain);
      alert(`Active chain changed to ${chain.name}`);
    }
  })
</script>

<template>
  <select class="select select-primary" v-model="selected">
    <option
      v-for="chain in supportedChains"
      :key="chain.name"
      :value="chain.name"
    >
      {{ chain.name }}
    </option>
  </select>
</template>
