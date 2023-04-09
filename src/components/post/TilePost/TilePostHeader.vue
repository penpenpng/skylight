<script setup lang="ts">
import { PropType } from "vue";

import Username from "@/components/common/Username.vue";
import { FeedViewPost } from "@/lib/bsky";
import { useDatetimeString } from "@/lib/datetime";

const props = defineProps({
  feed: { type: Object as PropType<FeedViewPost>, required: true },
});

const datetime = useDatetimeString(props.feed.post.indexedAt);
</script>

<template>
  <div class="d-inline-flex">
    <Username
      :user="feed.post.author"
      class="width-user-name text-ellipsis d-inline-block"
    />
    <small class="text-gray ml-2">
      {{ datetime }}
    </small>
  </div>
</template>
