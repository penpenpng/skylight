<script setup lang="ts">
import { useNotifications } from "@/lib/query";
import TileNoti from "./TileNoti.vue";

const { data: notifications, suspense } = useNotifications();
await suspense();
</script>

<template>
  <TileNoti v-for="noti in notifications" :noti="noti" :key="noti.cid" />
</template>
