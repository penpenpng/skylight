<script setup lang="ts">
import { PropType,ref } from "vue";

import { useOnClickOutside } from "@/lib/composable";

const emit = defineEmits<{ (key: string): void }>();
defineProps({
  keys: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  right: {
    type: Boolean,
    default: false,
  },
});

const shown = ref(false);
const dropdownRef = ref<HTMLDivElement>();

useOnClickOutside(dropdownRef, () => {
  shown.value = false;
});

const onClickItem = (key: string) => {
  emit(key);
  shown.value = false;
};
</script>

<template>
  <div ref="dropdownRef" class="dropdown" :class="{ 'dropdown-right': right }">
    <a
      href="#"
      class="btn btn-link dropdown-toggle"
      tabindex="0"
      @click.prevent="shown = !shown"
    >
      <slot name="trigger">
        <i class="bi bi-three-dots"></i>
      </slot>
    </a>
    <ul class="menu" :class="{ shown, hidden: !shown }">
      <li v-for="key in keys" :key="key" class="menu-item">
        <a href="#" @click.prevent="onClickItem(key)"><slot :name="key" /></a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.shown {
  display: block !important;
}

.hidden {
  display: none !important;
}
</style>
