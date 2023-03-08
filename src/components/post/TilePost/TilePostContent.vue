<script setup lang="ts">
import { PropType, computed } from "vue";

import { Feed, Entity } from "@/lib/atp";

const props = defineProps({
  feed: { type: Object as PropType<Feed>, required: true },
});

const post = computed(() => props.feed.post);
const replyTo = computed(() => props.feed.reply?.parent.author);

const getElements = (text: string, entities: Entity[]) => {
  const arr: Array<
    | { type: "text"; text: string }
    | { type: "link"; text: string; href: string }
    | { type: "mention"; text: string; href: string }
  > = [];
  const ent = [...entities].sort((a, b) => a.index.start - b.index.start);
  let idx = 0;

  for (const e of ent) {
    arr.push({
      type: "text",
      text: text.slice(idx, e.index.start),
    });
    arr.push({
      type: e.type,
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
</script>

<template>
  <small v-if="replyTo" class="d-block mb-1">
    &gt; Replied to <Username :user="replyTo" font-weight-normal />
  </small>
  <div class="pre-line wrap-anywhere">
    <template
      v-for="(e, idx) in getElements(
        post.record.text,
        post.record.entities || []
      )"
      ><span v-if="e.type === 'text'" :key="idx">{{ e.text }}</span
      ><RouterLink
        v-else-if="e.type === 'mention'"
        :to="{ name: 'profile', params: { actor: e.href } }"
        >{{ e.text }}</RouterLink
      ><a v-else :href="e.href" target="_blank">{{ e.text }}</a>
    </template>
  </div>
</template>

<style scoped></style>
