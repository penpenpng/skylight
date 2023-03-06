<script setup lang="ts">
import { refreshNotification, useState } from "@/store";
import TileNoti from "./TileNoti.vue";

const state = useState();

if (state.notifications.length <= 0) {
  await refreshNotification();
}
</script>

<template>
  <TileNoti v-for="noti in state.notifications" :noti="noti" :key="noti.cid" />
</template>
