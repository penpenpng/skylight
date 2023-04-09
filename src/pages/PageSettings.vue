<script setup lang="ts">
import { reactive } from "vue";

import ButtonAsync from "@/components/common/ButtonAsync.vue";
import ModalChangeHandle from "@/components/ModalChangeHandle.vue";
import { updateSettings,useSettings } from "@/lib/settings";

const settings = useSettings();
const state = reactive({
  showsModalChangeHandle: false,
  loadingModalChangeHandle: false,
});
</script>

<template>
  <div class="form-group">
    <label class="form-switch">
      <input
        type="checkbox"
        :checked="settings.enableRelativeTime"
        @change="
          updateSettings({
            enableRelativeTime: !settings.enableRelativeTime,
          })
        "
      />
      <i class="form-icon"></i>Enable relative time
    </label>
  </div>
  <div>
    <ButtonAsync
      class="btn"
      :force-loading="state.loadingModalChangeHandle"
      @click="state.showsModalChangeHandle = true"
    >
      Edit your handle...
    </ButtonAsync>
  </div>
  <Suspense
    @pending="state.loadingModalChangeHandle = true"
    @resolve="state.loadingModalChangeHandle = false"
    @fallback="state.loadingModalChangeHandle = false"
  >
    <ModalChangeHandle
      v-if="state.showsModalChangeHandle"
      @close="state.showsModalChangeHandle = false"
    />
  </Suspense>
</template>
