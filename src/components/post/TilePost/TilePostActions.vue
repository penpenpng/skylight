<script setup lang="ts">
import { ref, PropType, computed } from "vue";
import InputPost from "@/components/post/InputPost.vue";
import TilePostActionButton from "@/components/post/TilePost/TilePostActionButton.vue";

import { useRepostMutation, useUpvoteMutation } from "@/lib/query";
import { Feed } from "@/lib/atp";

const props = defineProps({
  feed: { type: Object as PropType<Feed>, required: true },
});

const { mutate: repost } = useRepostMutation();
const { mutate: upvote } = useUpvoteMutation();

const expandedInput = ref(false);

const post = computed(() => props.feed.post);
const replyTarget = computed(() => {
  const parent = {
    cid: props.feed.post.cid,
    uri: props.feed.post.uri,
  };
  const root = props.feed.reply?.root || parent;

  return { parent, root };
});
</script>

<template>
  <div class="mt-2">
    <TilePostActionButton
      aria-label="reply"
      icon-class="bi bi-reply"
      @click="expandedInput = !expandedInput"
    >
      {{ post.replyCount }}
    </TilePostActionButton>
    <TilePostActionButton
      aria-label="repost"
      icon-class="bi bi-megaphone"
      @click="
        repost({
          cid: post.cid,
          uri: post.uri,
        })
      "
    >
      {{ post.repostCount }}
    </TilePostActionButton>
    <TilePostActionButton
      aria-label="like"
      icon-class="bi bi-heart"
      @click="
        upvote({
          cid: post.cid,
          uri: post.uri,
        })
      "
    >
      {{ post.upvoteCount }}
    </TilePostActionButton>
  </div>
  <div v-if="expandedInput" class="d-flex">
    <InputPost
      class="column"
      :replay="replyTarget"
      @success="expandedInput = false"
    />
    <button
      class="btn btn-link btn-icon col-auto col-ml-auto mt-1"
      @click="expandedInput = false"
    >
      <i class="bi bi-x-lg"></i>
    </button>
  </div>
</template>
