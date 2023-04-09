<script setup lang="ts">
import _FsLightbox from "fslightbox-vue/v3.js";
import { PropType, ref } from "vue";

import { Embed } from "@/lib/bsky";

// https://github.com/banthagroup/fslightbox-vue/issues/67
const FsLightbox = _FsLightbox.default || _FsLightbox;

defineProps({
  embed: {
    type: Object as PropType<Embed.Image>,
    required: true,
  },
});

const toggler = ref(false);
const slide = ref<number>(0);
const onClickThumb = (index: number) => {
  slide.value = index + 1;
  toggler.value = !toggler.value;
};
</script>

<template>
  <div class="image-container">
    <img
      v-for="({ thumb, alt }, idx) in embed.images"
      :key="idx"
      :src="thumb"
      :alt="alt"
      class="c-hand image-thumb"
      @click.stop="onClickThumb(idx)"
    />
    <Teleport to="#lightbox">
      <FsLightbox
        type="image"
        disable-local-storage
        exit-fullscreen-on-close
        :toggler="toggler"
        :sources="embed.images.map((e) => e.fullsize)"
        :custom-attributes="embed.images.map((e) => ({ alt: e.alt }))"
        :slide="slide"
      />
    </Teleport>
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
