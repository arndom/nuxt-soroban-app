<template>
  <div v-if="!address">
    <button class="btn btn-accent" @click="handleConnect">
      Connect Wallet
    </button>
    <p class="text-[0.6rem] text-center mt-1">Freighter only</p>
  </div>

  <button v-else class="bg-primary p-4 rounded-2xl text-black" @click="handleDisconnect">
    Account: <span class="font-bold">{{ getShortAddress(address) }}</span>
  </button>
</template>

<script setup lang="ts">
import { getShortAddress } from '../utils';

const mySorobanContext = useSoroban();

const { disconnect, setActiveConnectorAndConnect, connectors: browserWallets } = mySorobanContext.value;

// toRef to make the address property reactive for the template
const address = toRef(mySorobanContext.value, "address")

const handleConnect = () => {
  if (!setActiveConnectorAndConnect) return;
  setActiveConnectorAndConnect(browserWallets[0]);
}

const handleDisconnect = async () => {
  console.log("Disconnecting");
  await disconnect();
}
</script>