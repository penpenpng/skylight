<script setup lang="ts">
import { PropType } from "vue";
import VueEasyLightbox, { useEasyLightbox } from "vue-easy-lightbox";

import { Embed } from "@/lib/atp";

const props = defineProps({
  embed: {
    type: Object as PropType<Embed.Image>,
    required: true,
  },
});

const { show, onHide, visibleRef, indexRef, imgsRef } = useEasyLightbox({
  imgs: props.embed.images.map((e) => e.fullsize),
  initIndex: 0,
});
</script>

<template>
  <div class="image-container">
    <img
      v-for="({ thumb, alt }, idx) in embed.images"
      :key="idx"
      :src="thumb"
      :alt="alt"
      class="c-hand image-thumb"
      @click="show(idx)"
    />
    <VueEasyLightbox
      :visible="visibleRef"
      :imgs="imgsRef"
      :index="indexRef"
      loop
      move-disabled
      @hide="onHide"
    >
    </VueEasyLightbox>
  </div>
</template>

<style scoped>
.image-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 150px;
  grid-auto-rows: 150px;
  row-gap: 10px;
  column-gap: 10px;
  justify-items: stretch;
  align-items: stretch;
}

.image-thumb {
  transition: transform 0.2s ease;
}

.image-thumb:hover {
  transform: scale(1.02);
}

.image-container img {
  object-fit: cover;
  max-height: 100%;
  width: 100%;
}
</style>
