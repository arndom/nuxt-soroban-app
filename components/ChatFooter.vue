<template>
  <div class="bg-black absolute bottom-0 left-0 px-4 w-full rounded-b-lg">
    <div class="flex items-center gap-1 my-4">
      <div class="h-[40px]">
        <ChatAvatar />
      </div>

      <input type="text" placeholder="Type message here..." class="input w-full rounded-3xl" />

      <button class="btn btn-primary rounded-3xl" disabled>
        Send
      </button>
    </div>
  </div>
</template>
