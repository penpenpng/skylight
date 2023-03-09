<script setup lang="ts">
import { PropType } from "vue";

import Username from "@/components/common/Username.vue";

import { Embed } from "@/lib/atp";

defineProps({
  embed: {
    type: Object as PropType<Embed.Record | Embed.RecordNotFound>,
    required: true,
  },
});
</script>

<template>
  <div class="card" style="max-width: 400px">
    <template v-if="Embed.isRecordNotFound(embed)"
      >{{ embed.record.uri }}
    </template>
    <template v-if="Embed.isRecord(embed)">
      <div class="card-header"><Username :user="embed.record.author" /></div>
      <div class="card-body text-small text-ellipsis pt-1">
        <div class="text-content pre-line">{{ embed.record.record.text }}</div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.text-content {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
</style>
