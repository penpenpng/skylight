<script setup lang="ts">
import { PropType } from "vue";

import Username from "@/components/common/Username.vue";

import { Post } from "@/lib/atp";

defineProps({
  post: { type: Object as PropType<Post>, required: true },
});
</script>

<template>
  <div class="d-inline-flex">
    <Username
      :user="post.author"
      class="width-user-name text-ellipsis d-inline-block"
    />
    <small class="text-gray ml-2">
      {{ new Date(post.indexedAt).toLocaleTimeString() }}
    </small>
  </div>
</template>
