<script setup lang="ts">
import TilePost from "@/components/post/TilePost.vue";
import { useAuthorFeed } from "@/lib/query";

const props = defineProps({
  actor: {
    type: String,
  },
});

const { data: feeds, suspense } = useAuthorFeed(props.actor);
await suspense();
</script>

<template>
  <TilePost v-for="feed in feeds" :feed="feed" :key="feed.post.cid" />
</template>
