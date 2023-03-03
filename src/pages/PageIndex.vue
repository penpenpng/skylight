<script setup lang="ts">
import { ref } from "vue";
import Loadable from "@/components/Loadable.vue";
import Timeline from "@/components/Timeline.vue";
import { postText } from "@/lib/atp";
import { refreshTimeline } from "@/store";

const text = ref("");

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

  <div class="columns col-oneline p-2">
    <button class="btn btn-secondary col-ml-auto" @click="refreshTimeline">
      Refresh
    </button>
  </div>

  <Loadable>
    <Timeline />
  </Loadable>
</template>
