<script setup lang="ts">
import { computed, PropType, toRaw } from "vue";

import Username from "@/components/common/Username.vue";
import { Entity, Facet, FacetFeature, FeedViewPost } from "@/lib/bsky";

const props = defineProps({
  feed: { type: Object as PropType<FeedViewPost>, required: true },
});

const post = computed(() => props.feed.post);
const replyTo = computed(() => props.feed.reply?.parent.author);

const getElements = (text: string, entities: Entity[], facets: Facet[]) => {
  const arr: Array<
    | { type: "text"; text: string }
    | { type: "link"; text: string; href: string }
    | { type: "mention"; text: string; href: string }
  > = [];
  const bytes = Array.from(new TextEncoder().encode(text));
  const decoder = new TextDecoder();
  const decode = (arr: number[]) => decoder.decode(Uint8Array.from(arr));
  const getPos = (idx: number): number => decode(bytes.slice(0, idx)).length;
  const ent: Entity[] = [
    ...entities,
    ...facets.map((e) => {
      const feat = e.features[0];
      return {
        type: FacetFeature.isLink(feat) ? "link" : "mention",
        index: {
          start: getPos(e.index.byteStart),
          end: getPos(e.index.byteEnd),
        },
        value: FacetFeature.isLink(feat) ? feat.uri : feat.did,
      };
    }),
  ].sort((a, b) => a.index.start - b.index.start);
  let idx = 0;

  for (const e of ent) {
    arr.push({
      type: "text",
      text: text.slice(idx, e.index.start),
    });
    arr.push({
      type: e.type as "link" | "mention" /* FIXME */,
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
        post.record.entities || [],
        post.record.facets || []
      )"
      ><span v-if="e.type === 'text'" :key="`text-${idx}`">{{ e.text }}</span
      ><RouterLink
        v-else-if="e.type === 'mention' && e.href"
        :key="`mention-${idx}`"
        :to="{ name: 'profile', params: { actor: e.href } }"
        >{{ e.text }}</RouterLink
      ><a
        v-else-if="e.type === 'link' && e.href"
        :key="`link-${idx}`"
        :href="e.href"
        target="_blank"
        class="line-clamp-1"
        >{{ e.text }}</a
      >
    </template>
  </div>
</template>

<style scoped></style>
