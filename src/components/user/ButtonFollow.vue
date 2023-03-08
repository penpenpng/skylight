<script setup lang="ts">
import { ref, PropType } from "vue";
import { AtUri } from "@atproto/uri";

import { Actor, ActorDetail, followUser } from "@/lib/atp";
import { useUnfollowMutation } from "@/lib/query";

const props = defineProps({
  user: {
    type: Object as PropType<ActorDetail | Actor>,
    required: true,
  },
});

// Cannot useMutation return value?
// const { mutate: followUser } = useFollowMutation();
const { mutate: unfollowUser } = useUnfollowMutation();
const updatedFollowing = ref(false);
const followingUri = ref(props.user.viewer?.following);

const follow = async () => {
  try {
    const { uri } = await followUser({
      did: props.user.did,
      cid: props.user.declaration.cid,
    });
    followingUri.value = uri;
    updatedFollowing.value = !updatedFollowing.value;
  } catch {
    // Should display error
  }
};

const unfollow = async () => {
  try {
    if (followingUri.value) {
      const atUri = new AtUri(followingUri.value);
      await unfollowUser({
        did: atUri.hostname,
        rkey: atUri.rkey,
      });
      updatedFollowing.value = !updatedFollowing.value;
    }
  } catch {
    // Should display error
  }
};

const xor = (a: boolean, b: boolean) => (a || b) && !(a && b);
</script>

<template>
  <button
    v-if="xor(!user.viewer?.following, updatedFollowing)"
    class="btn btn-primary"
    @click="follow"
  >
    + Follow
  </button>
  <button v-else class="btn" @click="unfollow">Unfollow</button>
</template>
