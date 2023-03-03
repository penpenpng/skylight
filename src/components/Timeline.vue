<script setup lang="ts">
import TilePost from "@/components/TilePost.vue";
import { useState, refreshTimeline } from "@/store";

const state = useState();

if (state.timeline.length <= 0) {
  await refreshTimeline();
}
</script>

<template>
  <TilePost
    v-for="{ post } in state.timeline"
    :post="post"
    :key="post.cid"
    class="tile py-2 my-2"
  />
</template>
