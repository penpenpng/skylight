<script setup lang="ts">
import { PropType } from "vue";

import TileUser from "@/components/user/TileUser.vue";
import { useFollowers, useFollows } from "@/lib/query";

const props = defineProps({
  actor: {
    type: String,
    default: undefined,
  },
  kind: {
    type: String as PropType<"follows" | "followers">,
    required: true,
  },
});

const { data: friends } =
  props.kind === "follows"
    ? await useFollows(props.actor)
    : await useFollowers(props.actor);
</script>

<template>
  <TileUser
    v-for="friend in friends"
    :key="friend.handle"
    :user="friend"
    class="py-2 my-2"
  />
</template>
