<script setup lang="ts">
defineEmits<{ (ev: "switch", tab: string): void }>();
defineProps({
  tab: {
    type: String,
  },
});
</script>

<template>
  <ul class="tab tab-block">
    <li class="tab-item" :class="{ active: tab === 'posts' }">
      <a href="#" @click.prevent="$emit('switch', 'posts')">Posts</a>
    </li>
    <li class="tab-item" :class="{ active: tab === 'follows' }">
      <a href="#" @click.prevent="$emit('switch', 'follows')">Follows</a>
    </li>
    <li class="tab-item" :class="{ active: tab === 'followers' }">
      <a href="#" @click.prevent="$emit('switch', 'followers')">Followers</a>
    </li>
  </ul>
</template>
