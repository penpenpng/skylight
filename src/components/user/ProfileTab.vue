<script setup lang="ts">
import { PropType } from "vue";
import { ActorProfile } from "@/lib/atp";

defineEmits<{ (ev: "switch", tab: string): void }>();
defineProps({
  tab: {
    type: String,
  },
  user: {
    type: Object as PropType<ActorProfile>,
    required: true,
  },
});
</script>

<template>
  <ul class="tab tab-block">
    <li class="tab-item" :class="{ active: tab === 'posts' }">
      <a href="#" @click.prevent="$emit('switch', 'posts')"
        >Posts<br /><small>({{ user.postsCount }})</small></a
      >
    </li>
    <li class="tab-item" :class="{ active: tab === 'follows' }">
      <a href="#" @click.prevent="$emit('switch', 'follows')"
        >Follows<br /><small>({{ user.followsCount }})</small></a
      >
    </li>
    <li class="tab-item" :class="{ active: tab === 'followers' }">
      <a href="#" @click.prevent="$emit('switch', 'followers')"
        >Followers<br /><small>({{ user.followersCount }})</small></a
      >
    </li>
  </ul>
</template>
