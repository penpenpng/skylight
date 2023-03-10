<script setup lang="ts">
import { PropType } from "vue";

import { Embed } from "@/lib/atp";

const props = defineProps({
  embed: {
    type: Object as PropType<Embed.External>,
    required: true,
  },
});

const openExternal = () => {
  window.open(props.embed.external.uri);
};
</script>

<template>
  <div class="card external c-hand" @click="openExternal">
    <div class="external-body">
      <div class="card-header">
        <h5 class="card-title mb-0">
          <div class="text-ellipsis">{{ embed.external.title }}</div>
        </h5>
        <div class="card-subtitle text-gray">
          <div class="text-ellipsis">{{ embed.external.uri }}</div>
        </div>
      </div>
      <div v-if="embed.external.description" class="card-body text-small pt-1">
        <div class="line-clamp-3">{{ embed.external.description }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.external {
  height: 150px;
  max-width: 400px;
  width: 100%;
}

.external-image img {
  object-fit: cover;
  max-height: 100%;
  max-width: 100%;
  height: 100%;
}
</style>
