<script setup lang="ts">
import { PropType } from "vue";

import Avatar from "@/components/common/Avatar.vue";
import Username from "@/components/common/Username.vue";
import ButtonFollow from "@/components/user/ButtonFollow.vue";
import { ProfileView, ProfileViewDetailed } from "@/lib/bsky";

defineProps({
  user: {
    type: Object as PropType<ProfileView | ProfileViewDetailed>,
    required: true,
  },
});
</script>

<template>
  <article class="tile-user tile hoverable">
    <div class="tile-icon mr-1">
      <Avatar
        :src="user.avatar"
        :display-name="user.displayName"
        :handle="user.handle"
      />
    </div>
    <div class="tile-content">
      <div class="tile-title">
        <Username :user="user" />
      </div>
      <div class="tile-subtitle">
        <small class="text-dark">@{{ user.handle }}</small>
      </div>
      <span v-if="!!user.viewer?.followedBy" class="chip">Follows You</span>
    </div>
    <div class="tile-action">
      <ButtonFollow :user="user" class="mr-2" />
    </div>
  </article>
</template>

<style scoped>
.tile-user {
  border-bottom: 1px solid #e3e3e3;
  align-items: center;
}
</style>
