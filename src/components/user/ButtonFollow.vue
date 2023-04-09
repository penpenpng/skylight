<script setup lang="ts">
import { PropType,ref } from "vue";

import {
  follow as _follow,
  ProfileView,
  ProfileViewDetailed,
} from "@/lib/bsky";
import { useUnfollowMutation } from "@/lib/query";

const props = defineProps({
  user: {
    type: Object as PropType<ProfileView | ProfileViewDetailed>,
    required: true,
  },
});

// Cannot useMutation return value?
// const { mutate: followUser } = useFollowMutation();
const { mutate: _unfollow } = useUnfollowMutation();
const updatedFollowing = ref(false);
const followingUri = ref(props.user.viewer?.following);

const follow = async () => {
  try {
    const { uri } = await _follow({
      did: props.user.did,
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
      await _unfollow({
        uri: followingUri.value,
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
