<script setup lang="ts">
import { PropType } from "vue";

import Username from "@/components/common/Username.vue";
import { Embed } from "@/lib/bsky";

defineProps({
  embed: {
    type: Object as PropType<Embed.Record>,
    required: true,
  },
});
</script>

<template>
  <div class="card d-block card-record">
    <div class="card-header text-ellipsis">
      <Username :user="embed.record.author" />
    </div>
    <div class="card-body text-small pt-1">
      <div class="pre-line wrap-anywhere line-clamp-3">
        {{ embed.record.value.text }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-record {
  max-width: min(100%, 400px);
}
</style>
