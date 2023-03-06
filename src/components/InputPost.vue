<script setup lang="ts">
import { reactive, watch, toRaw } from "vue";
import twtext from "twitter-text";

import { postText } from "@/lib/atp";
import { smartMerge, debounce } from "@/lib/algorithm";
import { refreshTimeline } from "@/store";
import ButtonAsync from "./ButtonAsync.vue";

const DEBOUNCE_INTERVAL = 500;
const MAX_PARSABLE_URL = 4;

interface State {
  text: string;
  urls: {
    id: number;
    url: string;
    indices: [number, number];
    includes: boolean;
  }[];
}

let nextId = 1;
const state = reactive<State>({
  text: "",
  urls: [],
});

const updateUrls = () => {
  const before = toRaw(state.urls);
  const after = twtext
    .extractUrlsWithIndices(state.text)
    .map((e) => ({ ...e, includes: true, id: nextId++ }))
    .slice(0, MAX_PARSABLE_URL);

  state.urls = smartMerge(
    before,
    after,
    (a, b) => a.url === b.url,
    (a, b) => ({ ...a, indices: b.indices })
  );
};

const debouncedUpdateUrls = debounce(updateUrls, DEBOUNCE_INTERVAL);

watch(() => state.text, debouncedUpdateUrls);

const submit = async () => {
  const text = state.text;
  if (!text) {
    return;
  }

  updateUrls();
  const urls = state.urls.filter((e) => e.includes);

  state.text = "";
  state.urls = [];

  await postText({ text, urls });
  refreshTimeline();
};
const onkeydown = (ev: KeyboardEvent) => {
  if ((ev.ctrlKey || ev.metaKey) && ev.key === "Enter") {
    submit();
  }
};
</script>

<template>
  <div class="input-group my-2">
    <textarea
      v-model="state.text"
      type="text"
      class="form-input"
      placeholder="What's up?"
      @keydown="onkeydown"
    />
  </div>

  <div class="d-flex">
    <div>
      <span
        v-for="({ url, id }, idx) in state.urls.filter((e) => e.includes)"
        :key="id"
        class="chip"
      >
        <i class="bi bi-link-45deg"></i>
        <a
          :href="url"
          class="text-ellipsis d-inline-block"
          target="_blank"
          style="max-width: 200px"
          >{{ url }}</a
        >
        <a
          href="#"
          class="btn btn-clear"
          aria-label="Close"
          role="button"
          @click="state.urls[idx].includes = false"
        ></a>
      </span>
    </div>
    <ButtonAsync
      class="btn btn-primary input-group-btn column col-auto col-ml-auto"
      :onClick="submit"
    >
      Submit
    </ButtonAsync>
  </div>
</template>
