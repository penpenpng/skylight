<script setup lang="ts">
import { createSession } from "@/lib/atp";
import { reactive } from "vue";
import { useRouter } from "vue-router";

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

  <form @submit.prevent="login" :class="{ 'has-error': state.hasError }">
    <div class="form-group">
      <label class="form-label" for="identifier">Identifier (Email)</label>
      <input
        v-model="state.identifier"
        class="form-input"
        type="text"
        id="identifier"
        placeholder="your.email@example.com"
        @input="state.hasError = false"
      />
    </div>

    <div class="form-group">
      <label class="form-label" for="password">Password</label>
      <input
        v-model="state.password"
        class="form-input"
        type="password"
        id="password"
        @input="state.hasError = false"
      />
    </div>

    <p v-if="state.hasError" class="form-input-hint">
      Invalid identifier or password.
    </p>

    <button type="submit" class="btn btn-primary">Take off</button>
  </form>
</template>
