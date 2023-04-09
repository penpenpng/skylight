<script setup lang="ts">
import { PropType } from "vue";
import TilePost from "@/components/post/TilePost.vue";
import { useAuthorFeed, useHomeTimeline } from "@/lib/query";

const props = defineProps({
  kind: {
    type: String as PropType<"home" | "author-feed">,
    required: true,
  },
  actor: {
    type: String,
  },
});

const { data: feeds } =
  props.kind == "home"
    ? await useHomeTimeline()
    : await useAuthorFeed(props.actor);
</script>

<template>
  <TilePost
    v-for="feed in feeds"
    :feed="feed"
    :key="feed.post.uri + (`+${feed.reason?.by.handle}` || '')"
  />
</template>
