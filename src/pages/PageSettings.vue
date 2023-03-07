<script setup lang="ts">
import { ref, reactive } from "vue";

import ButtonAsync from "@/components/common/ButtonAsync.vue";
import ModalChangeHandle from "@/components/ModalChangeHandle.vue";
import { useSettings, updateSettings } from "@/lib/settings";

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
        :checked="settings.enabledDeveloperMode"
        @change="
          updateSettings({
            enabledDeveloperMode: !settings.enabledDeveloperMode,
          })
        "
      />
      <i class="form-icon"></i>Enable developer mode
    </label>
  </div>
  <div>
    <ButtonAsync
      class="btn"
      @click="state.showsModalChangeHandle = true"
      :force-loading="state.loadingModalChangeHandle"
    >
      Change my handle...
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
