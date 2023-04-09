<script setup lang="ts">
import ButtonAsync from "@/components/common/ButtonAsync.vue";
import Loadable from "@/components/common/Loadable.vue";
import InputPost from "@/components/post/InputPost.vue";
import ListPosts from "@/components/post/ListPosts.vue";
import { QueryKeys,useFetchButton } from "@/lib/query";

const { invalidate, isFetching } = useFetchButton(QueryKeys.homeTimeline());
</script>

<template>
  <InputPost class="input-post" />

  <div class="columns col-oneline p-2">
    <ButtonAsync
      class="btn btn-secondary col-ml-auto"
      :on-click="invalidate"
      :force-loading="isFetching"
    >
      Refresh
    </ButtonAsync>
  </div>

  <Loadable>
    <ListPosts kind="home" />
  </Loadable>
</template>
