<script setup lang="ts">
import ButtonAsync from "@/components/common/ButtonAsync.vue";
import Loadable from "@/components/common/Loadable.vue";
import ListNoti from "@/components/notifications/ListNoti.vue";
import { QueryKeys,useFetchButton } from "@/lib/query";

const { invalidate, isFetching } = useFetchButton(QueryKeys.notifications());
</script>

<template>
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
    <ListNoti />
  </Loadable>
</template>
