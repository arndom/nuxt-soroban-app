<template>
  <main class="min-h-[100vh] flex flex-col items-center gap-4 justify-center">
    <SorobanProvider>
      <div class="flex gap-2 justify-center">
        <ChainSelect />
        <ConnectWallet />
      </div>

      <div class="relative w-80 md:w-1/2 max-w-lg">
        <ChatHeader />

        <div class="bg-black px-4 pb-4 max-h-[400px] min-h-[200px] overflow-y-auto chat-container rounded-b-lg">
          <div class="chat-block">
            <div class="chat chat-end">
              <div class="chat-header mb-1">Last msg sent via contract</div>
              <!-- Had to add "":key" because component was NOT updating with the new "lastMessage" -->
              <!-- Potential reason is because of how last message is updated? -->
              <!-- Or its just a DOM hint that works -->
              <ChatBlock :key="lastMessage" username="Anon" :msg="lastMessage" />
            </div>
          </div>

          <ChatFooter />
        </div>
      </div>
    </SorobanProvider>
  </main>
</template>

<script setup lang="ts">
import { testnet } from '@soroban-react/chains';
import { freighter } from '@soroban-react/freighter';
import type { ChainMetadata, Connector } from "@soroban-react/types";

import deployments from "./contract-deployments.json";

const chains: ChainMetadata[] = [testnet];
const connectors: Connector[] = [freighter()];
const appName = "Soroban Demo - Nuxt.js"

const mySorobanContext = useSoroban();
const getContractID = useContractID();
const lastMessage = useFetchLastMessage();

callOnce(() => {
  mySorobanContext.value.chains = chains
  mySorobanContext.value.appName = appName
  mySorobanContext.value.activeChain = testnet
  mySorobanContext.value.connectors = connectors
  mySorobanContext.value.deployments = deployments
  getContractID.value = "greeting"
})

useHead({
  title: 'Soroban Demo - Nuxt',
})
</script>
