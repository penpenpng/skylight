<script setup lang="ts">
import Loadable from "@/components/common/Loadable.vue";
import Timeline from "@/components/post/Timeline.vue";
import InputPost from "@/components/post/InputPost.vue";

import ButtonAsync from "@/components/common/ButtonAsync.vue";

import { fetchHomeTimeline } from "@/lib/query";
</script>

<template>
  <InputPost class="input-post" />

  <div class="columns col-oneline p-2">
    <ButtonAsync
      class="btn btn-secondary col-ml-auto"
      :onClick="fetchHomeTimeline"
    >
      Refresh
    </ButtonAsync>
  </div>

  <Loadable>
    <Timeline />
  </Loadable>
</template>
