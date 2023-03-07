<script setup lang="ts">
import TilePost from "@/components/post/TilePost.vue";
import { getFeed } from "@/lib/atp";

const props = defineProps({
  actor: {
    type: String,
  },
});

const [feeds] = await getFeed({ actor: props.actor });
</script>

<template>
  <TilePost v-for="feed in feeds" :feed="feed" :key="feed.post.cid" />
</template>
