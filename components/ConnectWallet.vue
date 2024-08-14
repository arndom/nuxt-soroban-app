<template>
  <div>
    <button class="btn btn-accent" @click="handleConnect">
      Connect Wallet
    </button>
    <p class="text-[0.6rem] text-center mt-1">Freighter only</p>
  </div>
</template>

<script setup lang="ts">
import { getShortAddress } from './utils';

const mySorobanContext = useSoroban();
const { address, disconnect, setActiveConnectorAndConnect, setActiveChain, connectors: browserWallets } = mySorobanContext.value;

const activeAccount = address;
const shortAddress = getShortAddress(activeAccount);

const handleConnect = () => {
  if (!setActiveConnectorAndConnect) return;
  setActiveConnectorAndConnect(browserWallets[0]);
}

const handleDisconnect = async () => {
  console.log("Disconnecting");
  await disconnect();
}
</script>