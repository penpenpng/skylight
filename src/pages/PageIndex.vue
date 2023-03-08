<script setup lang="ts">
import Loadable from "@/components/common/Loadable.vue";
import ButtonAsync from "@/components/common/ButtonAsync.vue";
import Timeline from "@/components/post/Timeline.vue";
import InputPost from "@/components/post/InputPost.vue";

import { useHomeTimelineFetch, useHomeTimeline } from "@/lib/query";

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
    <Timeline />
  </Loadable>
</template>
