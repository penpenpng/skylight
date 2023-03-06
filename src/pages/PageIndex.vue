<script setup lang="ts">
import Loadable from "@/components/Loadable.vue";
import Timeline from "@/components/Timeline.vue";
import InputPost from "@/components/InputPost.vue";

import { refreshTimeline } from "@/store";
import ButtonAsync from "@/components/ButtonAsync.vue";
</script>

<template>
  <InputPost class="input-post" />

  <div class="columns col-oneline p-2">
    <ButtonAsync
      class="btn btn-secondary col-ml-auto"
      :onClick="refreshTimeline"
    >
      Refresh
    </ButtonAsync>
  </div>

  <Loadable>
    <Timeline />
  </Loadable>
</template>
