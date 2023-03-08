<script setup lang="ts">
import TilePost from "@/components/post/TilePost.vue";

import { useHomeTimeline } from "@/lib/query";

const { data, suspense } = useHomeTimeline();
await suspense();
</script>

<template>
  <TilePost v-for="feed in data" :feed="feed" :key="feed.post.cid" />
</template>
