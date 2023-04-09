<script setup lang="ts">
import { usePost } from "@/lib/query";
const props = defineProps({
  actor: {
    type: String,
    required: true,
  },
  rkey: {
    type: String,
    required: true,
  },
});

const { data } = await usePost({ handle: props.actor, rkey: props.rkey });
</script>

<template>{{ data }}</template>

<style scoped></style>
