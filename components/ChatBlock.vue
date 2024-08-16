<script setup lang="ts">
  interface Props {
    username: string;
    msg: string;
  }

  const props = defineProps<Props>()
  const { username, msg } = props;
</script>

<template>
  <ChatAvatar :username="username" />
  <div class="chat-bubble">{{ msg }}</div>
</template>
