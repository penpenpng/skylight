<script setup lang="ts">
import Loadable from "@/components/common/Loadable.vue";
import ButtonAsync from "@/components/common/ButtonAsync.vue";
import InputPost from "@/components/post/InputPost.vue";

import { useHomeTimelineFetch, useHomeTimeline } from "@/lib/query";
import ListPosts from "@/components/post/ListPosts.vue";

const { isFetching } = useHomeTimeline();
const refetch = useHomeTimelineFetch();
</script>

<template>
  <InputPost class="input-post" />

  <div class="columns col-oneline p-2">
    <ButtonAsync
      class="btn btn-secondary col-ml-auto"
      :onClick="refetch"
      :forceLoading="isFetching"
    >
      Refresh
    </ButtonAsync>
  </div>

  <Loadable>
    <ListPosts kind="home" />
  </Loadable>
</template>
