<script setup lang="ts">
import TileUser from "@/components/user/TileUser.vue";
import { getFollowers, getFollows } from "@/lib/atp";
import { PropType } from "vue";

const props = defineProps({
  actor: {
    type: String,
  },
  kind: {
    type: String as PropType<"follows" | "followers">,
    required: true,
  },
});

const [{ users: frieds }] =
  props.kind === "follows"
    ? await getFollows({ actor: props.actor })
    : await getFollowers({ actor: props.actor });
</script>

<template>
  <TileUser
    v-for="friend in frieds"
    :user="friend"
    :key="friend.handle"
    class="py-2 my-2"
  />
</template>
