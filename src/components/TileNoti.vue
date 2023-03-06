<script setup lang="ts">
import { PropType } from "vue";
import { Notification } from "@/lib/atp";
import { useState } from "@/store";
import Avatar from "./Avatar.vue";

defineProps({
  noti: {
    type: Object as PropType<Notification>,
    required: true,
  },
});

const state = useState();
</script>

<template>
  <article v-if="noti.reason === 'vote'" class="tile tile-noti hoverable">
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
        <span class="text-primary text-bold ml-2">{{
          noti.author.displayName || noti.author.handle
        }}</span
        ><span class="text-dark ml-1">liked:</span>
      </div>
      <div class="tile-subtitle pre-line p-2 text-small text-muted">
        {{ state.posts[noti.record.subject.uri]?.record?.text }}
      </div>
    </div>
  </article>
  <article
    v-else-if="noti.reason === 'repost'"
    class="tile tile-noti hoverable"
  >
    <div class="tile-icon">
      <Avatar
        :src="noti.author.avatar"
        :handle="noti.author.handle"
        :display-name="noti.author.displayName"
        size="rg"
      >
        <i
          class="avatar-reaction bi bi-megaphone-fill text-tiny"
          style="color: #38b738"
        ></i>
      </Avatar>
    </div>
    <div class="tile-content mt-1">
      <div class="tile-title">
        <span class="text-primary text-bold ml-2">{{
          noti.author.displayName || noti.author.handle
        }}</span
        ><span class="text-dark ml-1">reposted:</span>
      </div>
      <div class="tile-subtitle pre-line p-2 text-small text-muted">
        {{ state.posts[noti.record.subject.uri]?.record?.text }}
      </div>
    </div>
  </article>
  <article
    v-else-if="noti.reason === 'mention' || noti.reason === 'reply'"
    class="tile tile-noti hoverable"
  >
    <div class="tile-icon">
      <Avatar
        :src="noti.author.avatar"
        :handle="noti.author.handle"
        :display-name="noti.author.displayName"
      />
    </div>
    <div class="tile-content mt-1">
      <div class="tile-title">
        <span class="text-primary text-bold ml-2">{{
          noti.author.displayName || noti.author.handle
        }}</span
        ><span class="text-dark ml-1"
          >{{ noti.reason === "mention" ? "mentioned" : "replied" }}:</span
        >
      </div>
      <div class="tile-subtitle pre-line p-2">
        {{ noti.record.text }}
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
