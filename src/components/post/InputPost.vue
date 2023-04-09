<script setup lang="ts">
import twtext from "twitter-text";
import { PropType, reactive, toRaw, watch } from "vue";

import ButtonAsync from "@/components/common/ButtonAsync.vue";
import { debounce, smartMerge } from "@/lib/algorithm";
import { FeedViewPost } from "@/lib/bsky";
import { usePostMutation } from "@/lib/query";

const emits = defineEmits<{
  (ev: "success"): void;
  (ev: "error"): void;
}>();
const props = defineProps({
  replyTo: {
    type: Object as PropType<FeedViewPost>,
    default: undefined,
  },
});

const { mutate: postText, isLoading: processingPost } = usePostMutation();
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

  try {
    await postText({ text, urls, replyTo: props.replyTo });
    emits("success");
  } catch {
    emits("error");
  }
};
const onkeydown = (ev: KeyboardEvent) => {
  if ((ev.ctrlKey || ev.metaKey) && ev.key === "Enter") {
    submit();
  }
};
</script>

<template>
  <div>
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
      <ButtonAsync
        class="btn btn-primary input-group-btn column col-auto"
        :on-click="submit"
        :force-loading="processingPost"
      >
        Submit
      </ButtonAsync>
      <div class="px-2">
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
    </div>
  </div>
</template>
