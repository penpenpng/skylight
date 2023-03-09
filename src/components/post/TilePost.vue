<script setup lang="ts">
import { PropType, computed } from "vue";

import Avatar from "@/components/common/Avatar.vue";
import Username from "@/components/common/Username.vue";
import Dropdown from "@/components/common/Dropdown.vue";
import TilePostRepostChip from "@/components/post/TilePost/TilePostRepostChip.vue";
import TilePostContent from "@/components/post/TilePost/TilePostContent.vue";
import TilePostActions from "@/components/post/TilePost/TilePostActions.vue";
import TileEmbedImage from "@/components/post/TilePost/TileEmbedImage.vue";

import { Embed, Feed } from "@/lib/atp";
import { useSettings } from "@/lib/settings";
import { useObjectInspector } from "@/lib/composable";

const props = defineProps({
  feed: { type: Object as PropType<Feed>, required: true },
});
const settings = useSettings();

const { printObject, copyObject } = useObjectInspector(props.feed);

const post = computed(() => props.feed.post);
</script>

<template>
  <div class="tile-post hoverable">
    <TilePostRepostChip v-if="feed.reason?.by" :reposted-by="feed.reason?.by" />
    <article class="tile" :class="{ 'pl-2': feed.reason?.by }">
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
          <TilePostContent :feed="feed" />
        </div>
        <TileEmbedImage
          v-if="Embed.isImage(feed.post.embed)"
          :embed="feed.post.embed"
        />
        <TilePostActions :feed="feed" />
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
