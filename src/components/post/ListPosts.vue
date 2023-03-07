<script setup lang="ts">
import TilePost from "@/components/post/TilePost.vue";
import { getMyFeed } from "@/lib/atp";

const [feeds] = await getMyFeed();
</script>

<template>
  <TilePost v-for="feed in feeds" :feed="feed" :key="feed.post.cid" />
</template>
