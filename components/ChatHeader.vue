<template>
  <div class="bg-primary absolute top-0 left-0 p-5 w-full text-center text-black rounded-t-lg">
    <p>
      Greeter -
      <NuxtLink externa :to="explorerLink" target="_blank" class="underline underline-offset-4">
        Explore Contract
      </NuxtLink>
    </p>
  </div>

  <div class="h-[60px]"></div>
</template>

<script setup lang="ts">
import { fetchLastMessage } from '~/utils';

const lastMessage = useFetchLastMessage();
const getContract = useRegisteredContract();
const contract = getContract.value;

const getExplorerLink = () => {
  const baseURL = "https://stellar.expert/explorer/testnet/contract/";

  if (!contract) return baseURL;
  const contractAddress = contract.deploymentInfo.contractAddress
  const hasAddress = Boolean(contractAddress);

  if (!hasAddress) return baseURL;

  return baseURL + contractAddress;
}

await callOnce(async () => {
  if (contract) {
    lastMessage.value = await fetchLastMessage(contract)
  }
})

const explorerLink = getExplorerLink()

</script>