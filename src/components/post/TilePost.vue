<script setup lang="ts">
import { PropType, computed, toRaw, ref } from "vue";

import Avatar from "@/components/common/Avatar.vue";
import Username from "@/components/common/Username.vue";
import Dropdown from "@/components/common/Dropdown.vue";
import TilePostActionButton from "@/components/post/TilePostActionButton.vue";
import InputPost from "@/components/post/InputPost.vue";

import { Entity, Feed } from "@/lib/atp";
import { useSettings } from "@/lib/settings";
import { useRepostMutation, useUpvoteMutation } from "@/lib/query";
import { useObjectInspector } from "@/lib/composable";

const { mutate: repost } = useRepostMutation();
const { mutate: upvote } = useUpvoteMutation();

const props = defineProps({
  feed: { type: Object as PropType<Feed>, required: true },
});
const settings = useSettings();
const expandedInput = ref(false);

const getTextElements = (text: string, entities: Entity[]) => {
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
const { printObject, copyObject } = useObjectInspector(props.feed);

const post = computed(() => props.feed.post);
const repostedBy = computed(() => props.feed.reason?.by);
const replyTo = computed(() => props.feed.reply?.parent.author);
const replyTarget = computed(() => {
  const parent = {
    cid: props.feed.post.cid,
    uri: props.feed.post.uri,
  };
  const root = props.feed.reply?.root || parent;

  return { parent, root };
});
</script>

<template>
  <div class="tile-post hoverable">
    <span v-if="repostedBy" class="chip mb-1 text-dark">
      <img :src="repostedBy.avatar" class="avatar avatar-sm" />
      <span
        class="width-repost-chip text-ellipsis d-inline-block"
        style="max-width: 200px"
        >Reposted by
        <Username :user="repostedBy" font-weight-normal />
      </span>
    </span>
    <article class="tile" :class="{ 'pl-2': repostedBy }">
      <div class="tile-icon">
        <Avatar
          :src="post.author.avatar"
          :handle="post.author.handle"
          :display-name="post.author.displayName"
        />
      </div>
      <div class="tile-content">
        <div class="tile-title d-inline-flex">
          <Username
            :user="post.author"
            class="width-user-name text-ellipsis d-inline-block"
          />
          <small class="text-gray ml-2">
            {{ new Date(post.indexedAt).toLocaleTimeString() }}
          </small>
        </div>
        <div class="tile-subtitle">
          <small v-if="replyTo" class="d-block mb-1">
            &gt; Replied to <Username :user="replyTo" font-weight-normal />
          </small>
          <div class="pre-line wrap-anywhere">
            <template
              v-for="(e, idx) in getTextElements(
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
        </div>
        <div class="mt-2">
          <TilePostActionButton
            aria-label="reply"
            icon-class="bi bi-reply"
            @click="expandedInput = !expandedInput"
          >
            {{ post.replyCount }}
          </TilePostActionButton>
          <TilePostActionButton
            aria-label="repost"
            icon-class="bi bi-megaphone"
            @click="
              repost({
                cid: post.cid,
                uri: post.uri,
              })
            "
          >
            {{ post.repostCount }}
          </TilePostActionButton>
          <TilePostActionButton
            aria-label="like"
            icon-class="bi bi-heart"
            @click="
              upvote({
                cid: post.cid,
                uri: post.uri,
              })
            "
          >
            {{ post.upvoteCount }}
          </TilePostActionButton>
        </div>
        <div v-if="expandedInput" class="d-flex">
          <InputPost
            class="column"
            :replay="replyTarget"
            @success="expandedInput = false"
          />
          <button
            class="btn btn-link btn-icon col-auto col-ml-auto mt-1"
            @click="expandedInput = false"
          >
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
      </div>
      <div v-if="settings.enabledDeveloperMode">
        <Dropdown
          :keys="['print-object', 'copy-object']"
          right
          @print-object="printObject"
          @copy-object="copyObject"
        >
          <template #print-object>Print Object</template>
          <template #copy-object>Copy Object</template>
        </Dropdown>
      </div>
    </article>
  </div>
</template>

<style scoped>
.tile-post {
  padding: 0.8rem 0.4rem 0.6rem;
  border-bottom: 1px solid #e3e3e3;
}

.chip .avatar.avatar-right {
  margin-left: 0.2rem;
  margin-right: -0.4rem;
  float: right;
}

@media screen and (max-width: 600px) {
  .width-repost-chip {
    max-width: 200px;
  }
  .width-user-name {
    max-width: 150px;
  }
}
</style>
