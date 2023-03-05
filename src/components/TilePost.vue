<script setup lang="ts">
import { PropType, computed, toRaw } from "vue";
import { Entity, Feed, upvotePost, repost } from "@/lib/atp";
import { useSettings } from "@/lib/settings";
import { refreshTimeline } from "@/store";

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
  const user = props.feed.reason?.by as any;

  return user
    ? { name: user.displayName || user.handle, avatar: user.avatar }
    : null;
});
const replyTo = computed(() => {
  const user = props.feed.reply?.parent.author;

  return user
    ? { name: user.displayName || user.handle, avatar: user.avatar }
    : null;
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
        <span class="text-primary">{{ repostedBy.name }}</span></span
      >
    </span>
    <article class="tile" :class="{ 'pl-2': repostedBy }">
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
        <div class="tile-title d-inline-flex">
          <span
            class="width-user-name text-primary text-bold text-ellipsis d-inline-block"
          >
            {{ post.author.displayName || post.author.handle }}
          </span>
          <small class="text-gray ml-2">
            {{ new Date(post.indexedAt).toLocaleTimeString() }}
          </small>
        </div>
        <div class="tile-subtitle">
          <small v-if="replyTo" class="d-block mb-1">
            &gt; Replied to <span class="text-primary">{{ replyTo.name }}</span>
          </small>
          <div class="pre-line wrap-anywhere">
            <template
              v-for="(e, idx) in getTextElements(
                post.record.text,
                post.record.entities || []
              )"
              ><span v-if="e.type === 'text'" :key="idx">{{ e.text }}</span
              ><a v-else :href="e.href" target="_blank">{{ e.text }}</a>
            </template>
          </div>
        </div>
        <div>
          <div class="d-inline-block mr-2">
            <button class="btn btn-link" disabled>
              <i class="bi bi-reply" aria-label="reply"></i>
            </button>
            {{ post.replyCount }}
          </div>
          <div class="d-inline-block mr-2">
            <button
              class="btn btn-link"
              @click="
                repost({
                  cid: post.cid,
                  uri: post.uri,
                }).then(refreshTimeline)
              "
            >
              <i class="bi bi-repeat" aria-label="repost"></i>
            </button>
            {{ post.repostCount }}
          </div>
          <div class="d-inline-block">
            <button
              class="btn btn-link"
              @click="
                upvotePost({
                  cid: post.cid,
                  uri: post.uri,
                }).then(refreshTimeline)
              "
            >
              <i class="bi bi-heart" aria-label="like"></i>
            </button>
            {{ post.upvoteCount }}
          </div>
        </div>
      </div>
      <div v-if="settings.enabledDeveloperMode">
        <button class="btn" @click="printFeedObject">Print Object</button>
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

.btn-link {
  padding: 0;
}
</style>
