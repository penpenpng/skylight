<script setup lang="ts">
import TilePost from "@/components/TilePost.vue";
import { getMyFeed, Feed } from "@/lib/atp";

const feeds = (await (await getMyFeed()).feed) as Feed[];
</script>

<template>
  <TilePost
    v-for="feed in feeds"
    :feed="feed"
    :key="feed.post.cid"
    class="py-2 my-2"
  />
</template>
