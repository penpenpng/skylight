<script setup lang="ts">
import { computed } from "vue";
import { usePost } from "@/lib/query";
import { Post, PostThread } from "@/lib/atp";
import { PostRecord } from "@atproto/api";
const props = defineProps({
  actor: {
    type: String,
    required: true,
  },
  rkey: {
    type: String,
    required: true,
  },
});

const { data } = await usePost({ handle: props.actor, rkey: props.rkey });
const MAX_ANCESTORS = 10;
const MAX_DESENDANTS_WIDTH = 10;
interface ThreadWindow {
  hasMore: boolean;
  posts: Post[];
}
interface Struct {
  ancestors: ThreadWindow;
  post: Post | null;
  descendants: ThreadWindow[];
}
const struct = computed<Struct>(() => {
  if (PostThread.isNotFound(data.value)) {
    return {
      ancestors: {
        hasMore: false,
        posts: [],
      },
      post: null,
      descendants: [],
    };
  } else {
    const post = data.value.post;
    const ancestors: ThreadWindow = (() => {
      const posts: Post[] = [];
      let cur: PostThread.Found = data.value;
      for (let i = 0; i < MAX_ANCESTORS; i++) {
        const parent = cur.parent;
        if (!parent || PostThread.isNotFound(parent)) {
          break;
        }

        posts.unshift(parent.post);
        cur = parent;
      }

      return {
        posts,
        hasMore: !!(cur.parent && PostThread.isFound(cur.parent)),
      };
    })();
    const descendants: ThreadWindow[] = (() => {
      const threads: ThreadWindow[] = [];
      for (
        let i = 0;
        i < Math.min(MAX_DESENDANTS_WIDTH, data.value.replies?.length || 0);
        i++
      ) {
        let cur = data.value.replies?.[i];
        if (!cur || PostThread.isNotFound(cur)) {
          continue;
        }

        const posts: Post[] = [];
        while (true) {
          posts.push(cur.post);
          if (
            cur.replies?.length === 1 &&
            cur.replies?.[0] &&
            PostThread.isFound(cur.replies?.[0])
          ) {
            cur = cur.replies?.[0];
          } else {
            break;
          }
        }
        threads.push({ posts, hasMore: false });
      }

      return threads;
    })();

    return {
      post,
      ancestors,
      descendants,
    };
  }
});
</script>

<template>{{ data }}</template>

<style scoped></style>
