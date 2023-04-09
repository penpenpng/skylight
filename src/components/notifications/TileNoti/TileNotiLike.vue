<script setup lang="ts">
import { PropType } from "vue";

import Avatar from "@/components/common/Avatar.vue";
import Username from "@/components/common/Username.vue";
import { Notification } from "@/lib/bsky";
import { usePost } from "@/lib/query";

const props = defineProps({
  noti: {
    type: Object as PropType<Notification.Like>,
    required: true,
  },
});

const { data: post } = await usePost({ uri: props.noti.record.subject.uri });
</script>

<template>
  <article class="tile tile-noti hoverable">
    <div class="tile-icon">
      <Avatar
        :src="noti.author.avatar"
        :handle="noti.author.handle"
        :display-name="noti.author.displayName"
        size="rg"
      >
        <i
          class="avatar-reaction bi bi-heart-fill text-tiny"
          style="color: #fd4f4f"
        ></i>
      </Avatar>
    </div>
    <div class="tile-content mt-1">
      <div class="tile-title">
        <Username class="ml-2" :user="noti.author" /><span
          class="text-dark ml-1"
          >liked:</span
        >
      </div>
      <div class="tile-subtitle pre-line p-2 text-small text-muted">
        {{ post?.record.text }}
      </div>
    </div>
  </article>
</template>

<style scoped>
.tile-noti {
  padding: 0.8rem 0.4rem 0.6rem;
  border-bottom: 1px solid #e3e3e3;
}

.avatar-reaction {
  bottom: 14.64%;
  height: 50%;
  padding: 0.1rem;
  position: absolute;
  right: 14.64%;
  transform: translate(50%, 50%);
  width: 50%;
  z-index: 2;
}
</style>
