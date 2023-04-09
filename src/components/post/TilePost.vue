<script setup lang="ts">
import { computed, PropType } from "vue";
import { useRoute } from "vue-router";

import Avatar from "@/components/common/Avatar.vue";
import Dropdown from "@/components/common/Dropdown.vue";
import Actions from "@/components/post/TilePost/TilePostActions.vue";
import Content from "@/components/post/TilePost/TilePostContent.vue";
import EmbedExternal from "@/components/post/TilePost/TilePostEmbedExternal.vue";
import EmbedImage from "@/components/post/TilePost/TilePostEmbedImage.vue";
import EmbedRecord from "@/components/post/TilePost/TilePostEmbedRecord.vue";
import EmbedRecordNotFound from "@/components/post/TilePost/TilePostEmbedRecordNotFound.vue";
import Header from "@/components/post/TilePost/TilePostHeader.vue";
import RepostChip from "@/components/post/TilePost/TilePostRepostChip.vue";
import { Embed, FeedViewPost, isMe, Reason } from "@/lib/bsky";
import { useObjectInspector } from "@/lib/composable";
import { useDeletePostMutation } from "@/lib/query";

const props = defineProps({
  feed: { type: Object as PropType<FeedViewPost>, required: true },
});

const { printObject, copyObject } = useObjectInspector(props.feed);
const { mutate: deletePost } = useDeletePostMutation();

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

const goToPost = () => {
  // NOTE: Not implemented
  // router.push({
  //   name: "post-uri-resolver",
  //   params: {
  //     uri: props.feed.post.uri,
  //   },
  // });
};
</script>

<template>
  <div class="tile-post hoverable">
    <RepostChip
      v-if="Reason.isRepost(feed.reason)"
      :reposted-by="feed.reason.by"
    />
    <article
      class="tile c-hand"
      :class="{ 'pl-2': feed.reason?.by }"
      @click="goToPost"
    >
      <div class="tile-icon">
        <Avatar
          :src="post.author.avatar"
          :handle="post.author.handle"
          :display-name="post.author.displayName"
        />
      </div>
      <div class="tile-content" @click.stop>
        <div class="tile-title">
          <Header :feed="feed" />
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
          v-else-if="Embed.isRecord(feed.post.embed)"
          :embed="feed.post.embed"
          class="mt-3"
        />
        <EmbedRecordNotFound
          v-else-if="Embed.isRecordNotFound(feed.post.embed)"
          :embed="feed.post.embed"
          class="mt-3"
        />
        <Actions :feed="feed" />
      </div>
      <div v-if="menu.length > 0">
        <Dropdown
          :keys="menu"
          right
          @delete-post="() => deletePost({ uri: feed.post.uri })"
          @print-object="printObject"
          @copy-object="copyObject"
          @click.stop
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
