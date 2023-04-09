<script setup lang="ts">
import ButtonAsync from "@/components/common/ButtonAsync.vue";
import ListNoti from "@/components/notifications/ListNoti.vue";
import Loadable from "@/components/common/Loadable.vue";

import { useFetchButton, QueryKeys } from "@/lib/query";

const { invalidate, isFetching } = useFetchButton(QueryKeys.notifications());
</script>

<template>
  <div class="columns col-oneline p-2">
    <ButtonAsync
      class="btn btn-secondary col-ml-auto"
      :onClick="invalidate"
      :forceLoading="isFetching"
    >
      Refresh
    </ButtonAsync>
  </div>

  <Loadable>
    <ListNoti />
  </Loadable>
</template>
