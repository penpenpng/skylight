<script setup lang="ts">
import ButtonAsync from "@/components/ButtonAsync.vue";
import ListNoti from "@/components/ListNoti.vue";
import Loadable from "@/components/Loadable.vue";

import { refreshNotification } from "@/store";
</script>

<template>
  <div class="columns col-oneline p-2">
    <ButtonAsync
      class="btn btn-secondary col-ml-auto"
      :onClick="refreshNotification"
    >
      Refresh
    </ButtonAsync>
  </div>

  <Loadable>
    <ListNoti />
  </Loadable>
</template>
