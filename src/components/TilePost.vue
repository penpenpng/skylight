<script setup lang="ts">
import { PropType, computed, toRaw } from "vue";
import { Entity, Feed } from "@/lib/atp";
import { useSettings } from "@/lib/settings";

const props = defineProps({
  feed: { type: Object as PropType<Feed>, required: true },
});
const settings = useSettings();

const getTextElements = (text: string, entities: Entity[]) => {
  const arr: Array<
    | { type: "text"; text: string }
    | { type: "link"; text: string; href: string }
  > = [];
  const ent = [...entities].sort((a, b) => a.index.start - b.index.start);
  let idx = 0;

  for (const e of ent) {
    arr.push({
      type: "text",
      text: text.slice(idx, e.index.start),
    });
    arr.push({
      type: "link",
      text: text.slice(e.index.start, e.index.end),
      href: e.value,
    });
    idx = e.index.end;
  }

  arr.push({
    type: "text",
    text: text.slice(idx, text.length),
  });

  return arr;
};
const printFeedObject = () => {
  console.log(toRaw(props.feed));
};

const post = computed(() => props.feed.post);
const repostedBy = computed(() => {
  const by = props.feed.reason?.by as any;

  return by ? { name: by.displayName || by.handle, avatar: by.avatar } : null;
});
</script>

<template>
  <div>
    <span v-if="repostedBy" class="chip mb-1 text-dark">
      <img :src="repostedBy.avatar" class="avatar avatar-sm" />
      <span style="white-space: pre-line">
        Reposted by <span class="text-primary">{{ repostedBy.name }}</span>
      </span>
    </span>
    <div class="tile" :class="{ 'ml-2': repostedBy }">
      <div class="tile-icon">
        <figure v-if="post.author.avatar" class="avatar avatar-lg">
          <img :src="post.author.avatar" alt="" />
        </figure>
        <figure
          v-else
          class="avatar avatar-lg"
          :data-initial="(post.author.displayName || post.author.handle)[0]"
        ></figure>
      </div>
      <div class="tile-content">
        <div class="tile-title">
          <span class="text-primary text-bold">
            {{ post.author.displayName || post.author.handle }}
          </span>
          <small class="text-gray ml-2">
            {{ new Date(post.indexedAt).toLocaleTimeString() }}
          </small>
        </div>
        <div class="tile-subtitle">
          <template
            v-for="(e, idx) in getTextElements(
              post.record.text,
              post.record.entities || []
            )"
          >
            <span v-if="e.type === 'text'" :key="idx">{{ e.text }}</span>
            <a v-else :href="e.href" target="_blank">{{ e.text }}</a>
          </template>
        </div>
      </div>
      <div v-if="settings.enabledDeveloperMode" class="tile-action">
        <button class="btn btn-outline" @click="printFeedObject">
          Print Feed Object
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tile-subtitle a {
  overflow-wrap: anywhere;
}
</style>
