<script setup lang="ts">
import { PropType } from "vue";
import { Notification } from "@/lib/atp";
import Avatar from "@/components/common/Avatar.vue";
import Username from "@/components/common/Username.vue";

import TileNotiVote from "./TileNotiVote.vue";
import TileNotiRepost from "./TileNotiRepost.vue";

const props = defineProps({
  noti: {
    type: Object as PropType<Notification>,
    required: true,
  },
});
</script>

<template>
  <TileNotiVote v-if="noti.reason === 'vote'" :noti="noti" />
  <TileNotiRepost v-else-if="noti.reason === 'repost'" :noti="noti" />
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
        <Username class="ml-2" :user="noti.author" /><span
          class="text-dark ml-1"
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
