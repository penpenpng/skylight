<script setup lang="ts">
import { reactive } from "vue";
import { searchUsers, ActorDetail } from "@/lib/atp";
import TileUser from "@/components/profile/TileUser.vue";

const state = reactive({
  query: "",
  sent: false,
  users: [] as ActorDetail[],
});

const submit = async () => {
  if (state.query) {
    const [users] = await searchUsers({ term: state.query });
    state.users = users;
    state.sent = true;
  } else {
    state.users = [];
    state.sent = false;
  }
};
</script>

<template>
  <form @submit.prevent="submit" class="input-group my-2">
    <input
      v-model="state.query"
      type="text"
      class="form-input"
      placeholder="Display name or handle..."
    />
    <button
      type="submit"
      class="btn btn-primary input-group-btn"
      @click="submit"
    >
      Search
    </button>
  </form>

  <template v-if="state.sent && state.users.length <= 0">
    <div class="empty">
      <p class="empty-title h5">No Users Found</p>
      <p class="empty-subtitle">Try a different search query again.</p>
    </div>
  </template>
  <template v-if="state.users.length > 0">
    <TileUser
      v-for="user in state.users"
      class="py-2 my-2"
      :user="user"
      :key="user.handle"
    />
  </template>
</template>

<style scoped>
.tile:hover {
  background: #f1f1fc;
}
</style>
