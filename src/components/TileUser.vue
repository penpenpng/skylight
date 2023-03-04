<script setup lang="ts">
import { ref, PropType } from "vue";
import Avatar from "@/components/Avatar.vue";
import { User, followUser, unfollowUser } from "@/lib/atp";

const props = defineProps({
  user: {
    type: Object as PropType<User>,
    required: true,
  },
});

const updatedFollowing = ref(false);

const follow = async () => {
  try {
    await followUser({ did: props.user.did, cid: props.user.declaration.cid });
    updatedFollowing.value = !updatedFollowing.value;
  } catch {
    // Should display error
  }
};

const unfollow = async () => {
  try {
    await unfollowUser({
      did: props.user.did,
      rkey: "", // TODO: ???
    });
    updatedFollowing.value = !updatedFollowing.value;
  } catch {
    // Should display error
  }
};

const xor = (a: boolean, b: boolean) => (a || b) && !(a && b);
</script>

<template>
  <article class="tile">
    <div class="tile-icon">
      <Avatar
        :src="user.avatar"
        :display-name="user.displayName"
        :handle="user.handle"
      />
    </div>
    <div class="tile-content">
      <div class="tile-title">
        <span class="text-primary text-bold">
          {{ user.displayName || user.handle }}
        </span>
        <small class="text-dark ml-2">@{{ user.handle }}</small>
        <span v-if="!!user.viewer?.followedBy" class="chip ml-2"
          >Follows You</span
        >
      </div>
      <div class="tile-subtitle">
        {{ user.description }}
      </div>
    </div>
    <div class="tile-action mx-2">
      <button
        v-if="xor(!user.viewer?.following, updatedFollowing)"
        class="btn btn-primary"
        @click="follow"
      >
        + Follow
      </button>
      <button v-else class="btn btn-outline" @click="unfollow">
        Unfollow (Not Implemented. Sorry!)
      </button>
    </div>
  </article>
</template>

<style scoped>
.tile:hover {
  background: #f1f1fc;
}
</style>
