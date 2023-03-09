<script setup lang="ts">
import { PropType, computed } from "vue";
import { useRoute } from "vue-router";

import Avatar from "@/components/common/Avatar.vue";
import Dropdown from "@/components/common/Dropdown.vue";
import RepostChip from "@/components/post/TilePost/TilePostRepostChip.vue";
import Header from "@/components/post/TilePost/TilePostHeader.vue";
import Content from "@/components/post/TilePost/TilePostContent.vue";
import Actions from "@/components/post/TilePost/TilePostActions.vue";
import EmbedImage from "@/components/post/TilePost/TilePostEmbedImage.vue";
import EmbedExternal from "@/components/post/TilePost/TilePostEmbedExternal.vue";
import EmbedRecord from "@/components/post/TilePost/TilePostEmbedRecord.vue";

import { Embed, Feed, isMe, deletePost } from "@/lib/atp";
import { useObjectInspector } from "@/lib/composable";
import { useAuthorFeedFetch, useHomeTimelineFetch } from "@/lib/query";

const props = defineProps({
  feed: { type: Object as PropType<Feed>, required: true },
});

const { printObject, copyObject } = useObjectInspector(props.feed);
const refetchAuthorFeed = useAuthorFeedFetch();
const refetchHomeTimeline = useHomeTimelineFetch();

const post = computed(() => props.feed.post);
const route = useRoute();

const menu = computed(() => {
  const keys: string[] = [];

  if (
    isMe(props.feed.post.author.did) &&
    ["my-profile", "index"].includes(String(route.name))
  ) {
    keys.push("delete-post");
  }
  keys.push("print-object");
  keys.push("copy-object");

  return keys;
});

const deletePostAndRefetch = async () => {
  await deletePost({ uri: props.feed.post.uri });
  if (route.name === "my-profile") {
    refetchAuthorFeed();
  } else if (route.name === "index") {
    refetchHomeTimeline();
  }
};
</script>

<template>
  <div class="tile-post hoverable">
    <RepostChip v-if="feed.reason?.by" :reposted-by="feed.reason?.by" />
    <article class="tile" :class="{ 'pl-2': feed.reason?.by }">
      <div class="tile-icon">
        <Avatar
          :src="post.author.avatar"
          :handle="post.author.handle"
          :display-name="post.author.displayName"
        />
      </div>
      <div class="tile-content">
        <div class="tile-title">
          <Header :post="feed.post" />
        </div>
        <div class="tile-subtitle">
          <Content :feed="feed" />
        </div>
        <EmbedImage
          v-if="Embed.isImage(feed.post.embed)"
          :embed="feed.post.embed"
          class="mt-3"
        />
        <EmbedExternal
          v-else-if="Embed.isExternal(feed.post.embed)"
          :embed="feed.post.embed"
          class="mt-3"
        />
        <EmbedRecord
          v-else-if="
            Embed.isRecord(feed.post.embed) ||
            Embed.isRecordNotFound(feed.post.embed)
          "
          :embed="feed.post.embed"
          class="mt-3"
        />
        <Actions :feed="feed" />
      </div>
      <div v-if="menu.length > 0">
        <Dropdown
          :keys="menu"
          right
          @delete-post="deletePostAndRefetch"
          @print-object="printObject"
          @copy-object="copyObject"
        >
          <template #delete-post>Delete Post</template>
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
