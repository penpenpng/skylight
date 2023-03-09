<script setup lang="ts">
import { PropType } from "vue";

import { Embed } from "@/lib/atp";

defineProps({
  embed: {
    type: Object as PropType<Embed.External>,
    required: true,
  },
});
</script>

<template>
  <div class="card" style="max-width: 400px">
    <div v-if="embed.external.thumb" class="card-image c-hand">
      <a :href="embed.external.uri" target="_blank" style="color: black">
        <img :src="embed.external.thumb" class="img-responsive" />
      </a>
    </div>
    <div class="card-header">
      <h5 class="card-title text-ellipsis mb-0">
        <a :href="embed.external.uri" target="_blank" style="color: black">{{
          embed.external.title
        }}</a>
      </h5>
      <div class="card-subtitle text-gray text-ellipsis">
        {{ embed.external.uri }}
      </div>
    </div>
    <div
      v-if="embed.external.description"
      class="card-body text-small text-ellipsis pt-1"
    >
      {{ embed.external.description }}
    </div>
  </div>
</template>
