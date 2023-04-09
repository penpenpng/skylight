<script setup lang="ts">
import { reactive } from "vue";
import { useRouter } from "vue-router";

import { createSession } from "@/lib/bsky";

const router = useRouter();
const state = reactive({
  identifier: "",
  password: "",
  hasError: false,
});

const login = async () => {
  const { success } = await createSession(state);

  state.hasError = !success;

  if (success) {
    router.replace({ name: "index" });
  }
};
</script>

<template>
  <p>Minimal Bluesky Client for bsky.social</p>

  <form :class="{ 'has-error': state.hasError }" @submit.prevent="login">
    <div class="form-group">
      <label class="form-label" for="identifier"
        >Identifier (email or handle)</label
      >
      <input
        id="identifier"
        v-model="state.identifier"
        class="form-input"
        type="text"
        @input="state.hasError = false"
      />
    </div>

    <div class="form-group">
      <label class="form-label" for="password">Password</label>
      <input
        id="password"
        v-model="state.password"
        class="form-input"
        type="password"
        @input="state.hasError = false"
      />
    </div>

    <p v-if="state.hasError" class="form-input-hint">
      Invalid identifier or password.
    </p>

    <button type="submit" class="btn btn-primary">Take off</button>
  </form>
</template>
