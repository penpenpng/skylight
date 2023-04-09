<script setup lang="ts">
import { PropType } from "vue";

import Username from "@/components/common/Username.vue";
import { ProfileView } from "@/lib/bsky";

defineProps({
  repostedBy: {
    type: Object as PropType<ProfileView>,
    required: true,
  },
});
</script>

<template>
  <span class="chip mb-1 text-dark">
    <img :src="repostedBy.avatar" class="avatar avatar-sm" />
    <span
      class="width-repost-chip text-ellipsis d-inline-block"
      style="max-width: 200px"
      >Reposted by
      <Username :user="repostedBy" font-weight-normal />
    </span>
  </span>
</template>
