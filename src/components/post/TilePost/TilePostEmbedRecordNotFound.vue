<script setup lang="ts">
import { PropType } from "vue";

import { Embed } from "@/lib/bsky";

defineProps({
  embed: {
    type: Object as PropType<Embed.RecordNotFound>,
    required: true,
  },
});
</script>

<template>
  <div class="card d-block card-record">
    {{ embed.record.uri }}
  </div>
</template>

<style scoped>
.card-record {
  max-width: min(100%, 400px);
}
</style>
