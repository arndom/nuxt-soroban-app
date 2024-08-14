<template>
  <div class="bg-black absolute bottom-0 left-0 px-4 w-full rounded-b-lg">
    <div class="flex items-center gap-1 my-4">
      <div class="h-[40px]">
        <ChatAvatar :username="getShortAddress(address)" />
      </div>

      <input type="text" placeholder="Type message here..." class="input w-full rounded-3xl" v-model="message" />

      <button class="btn btn-primary rounded-3xl" :disabled="!address || isSending" @click="handleSend">
        {{ !isSending ? "Send" : "Sending..."  }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nativeToScVal } from '@stellar/stellar-sdk';
import { getShortAddress } from '~/utils';

const mySorobanContext = useSoroban();
const address = toRef(mySorobanContext.value, "address")

const getContract = useRegisteredContract();
const contract = getContract.value;

const lastMessage = useFetchLastMessage();

const isSending = ref(false);
const message = ref("");

const handleSend = async () => {
  isSending.value = true;

  try {
    const result = await contract?.invoke({
      method: "set_title",
      args: [nativeToScVal(message.value, { type: "string" })],
      signAndSend: true,
    });

    console.log("🚀 « result:", result);
    alert("New message published");

    lastMessage.value = message.value;
    message.value = "";
  } catch (e) {
    console.error(e);
    alert("Error while sending tx. Try again…");
  } finally {
    isSending.value = false;
  }
}
</script>