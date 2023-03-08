<script setup lang="ts">
import ButtonAsync from "@/components/common/ButtonAsync.vue";
import ListNoti from "@/components/notifications/ListNoti.vue";
import Loadable from "@/components/common/Loadable.vue";

import { fetchNotifications } from "@/lib/query";
</script>

<template>
  <div class="columns col-oneline p-2">
    <ButtonAsync
      class="btn btn-secondary col-ml-auto"
      :onClick="fetchNotifications"
    >
      Refresh
    </ButtonAsync>
  </div>

  <Loadable>
    <ListNoti />
  </Loadable>
</template>
