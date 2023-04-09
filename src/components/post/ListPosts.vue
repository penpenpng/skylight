<script setup lang="ts">
import { PropType } from "vue";

import TilePost from "@/components/post/TilePost.vue";
import { Reason } from "@/lib/bsky";
import { useAuthorFeed, useHomeTimeline } from "@/lib/query";

const props = defineProps({
  kind: {
    type: String as PropType<"home" | "author-feed">,
    required: true,
  },
  actor: {
    type: String,
    default: undefined,
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
    :key="feed.post.uri + `+${Reason.getRepost(feed.reason)?.by.handle}`"
    :feed="feed"
  />
</template>
