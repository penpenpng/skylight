<script setup lang="ts">
import ButtonAsync from "@/components/common/ButtonAsync.vue";
import ListNoti from "@/components/notifications/ListNoti.vue";
import Loadable from "@/components/common/Loadable.vue";

import { useNotificationFetch } from "@/lib/query";
const refetch = useNotificationFetch();
</script>

<template>
  <div class="columns col-oneline p-2">
    <ButtonAsync class="btn btn-secondary col-ml-auto" :onClick="refetch">
      Refresh
    </ButtonAsync>
  </div>

  <Loadable>
    <ListNoti />
  </Loadable>
</template>
