<script setup lang="ts">
import Post from "@/components/Post.vue";
import { useState, refreshTimeline } from "@/store";

const state = useState();

await refreshTimeline();
</script>

<template>
  <Post
    v-for="{ post } in state.timeline"
    :post="post"
    :key="post.cid"
    class="tile py-2 my-2"
  />
</template>
