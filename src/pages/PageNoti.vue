<script setup lang="ts">
import { onActivated } from "vue";

import ButtonAsync from "@/components/common/ButtonAsync.vue";
import ListNoti from "@/components/notifications/ListNoti.vue";
import Loadable from "@/components/common/Loadable.vue";

import { useNotificationFetch, useNotifications } from "@/lib/query";

const { isFetching } = useNotifications();
const refetch = useNotificationFetch();

onActivated(() => {
  refetch();
});
</script>

<template>
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
    <ListNoti />
  </Loadable>
</template>
