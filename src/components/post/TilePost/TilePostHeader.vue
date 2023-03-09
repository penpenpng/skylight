<script setup lang="ts">
import { PropType } from "vue";

import Username from "@/components/common/Username.vue";

import { Post } from "@/lib/atp";
import { useDatetimeString } from "@/lib/datetime";

const props = defineProps({
  post: { type: Object as PropType<Post>, required: true },
});

const datetime = useDatetimeString(props.post.indexedAt);
</script>

<template>
  <div class="d-inline-flex">
    <Username
      :user="post.author"
      class="width-user-name text-ellipsis d-inline-block"
    />
    <small class="text-gray ml-2">
      {{ datetime }}
    </small>
  </div>
</template>
