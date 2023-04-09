<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  src: {
    type: String,
    default: null,
  },
  displayName: {
    type: String,
    default: null,
  },
  handle: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: "lg",
  },
  disableLink: {
    type: Boolean,
  },
});

const router = useRouter();

const goProfile = () => {
  if (props.disableLink) {
    return;
  }

  router.push({
    name: "profile",
    params: {
      actor: props.handle,
    },
  });
};
const cssClass = computed(() => {
  const c = ["avatar", `avatar-${props.size}`];

  if (!props.disableLink) {
    c.push("c-hand");
  }

  return c;
});
</script>

<template>
  <figure v-if="src" :class="cssClass" @click="goProfile">
    <img :src="src" alt="" />
    <slot />
  </figure>
  <figure
    v-else
    :class="cssClass"
    :data-initial="(displayName || handle)[0]"
    @click="goProfile"
  ></figure>
</template>
