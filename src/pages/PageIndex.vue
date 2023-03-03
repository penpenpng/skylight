<script setup lang="ts">
import { ref } from "vue";
import Post from "@/components/Post.vue";
import { postText } from "@/lib/atp";
import { useState, refreshTimeline } from "@/store";

const state = useState();
const text = ref("");

await refreshTimeline();

const submit = async () => {
  const v = text.value;
  if (!v) {
    return;
  }

  text.value = "";
  await postText(v);
  refreshTimeline();
};
</script>

<template>
  <div class="columns col-oneline p-2">
    <h1 class="col-10" style="font-family: 'Segoe UI Mono'">Skylight</h1>
    <button class="btn btn-secondary col-2" @click="refreshTimeline">
      Refresh
    </button>
  </div>
  <div class="input-group my-2">
    <input
      v-model="text"
      type="text"
      class="form-input"
      placeholder="What's up?"
    />
    <button class="btn btn-primary input-group-btn" @click="submit">
      Submit
    </button>
  </div>

  <Post
    v-for="{ post } in state.timeline"
    :post="post"
    :key="post.cid"
    class="tile py-2 my-2"
  />
</template>
