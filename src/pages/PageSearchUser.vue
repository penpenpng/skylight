<script setup lang="ts">
import { reactive } from "vue";
import { searchUsers, User } from "@/lib/atp";
import TileUser from "@/components/TileUser.vue";

const state = reactive({
  query: "",
  users: [] as User[],
});

const submit = async () => {
  if (state.query) {
    state.users = await searchUsers({ term: state.query });
  } else {
    state.users = [];
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
      Submit
    </button>
  </form>

  <TileUser
    v-for="user in state.users"
    class="py-2 my-2"
    :user="user"
    :key="user.handle"
  />
</template>

<style scoped>
.tile:hover {
  background: #f1f1fc;
}
</style>
