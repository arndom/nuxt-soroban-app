<script setup lang="ts">
  interface Props {
    username?: string;
  }

  const props = defineProps<Props>()
  const defaultName = "anon"
</script>

<template>
  <div class="chat-image avatar">
    <div class="w-10 rounded-full">
      <img alt="Tailwind CSS chat bubble component" width="200px" height="200px"
        :src="`https://robohash.org/${Boolean(props.username) ? props.username : defaultName}`" class="bg-neutral" />
    </div>
  </div>
</template>
