<script setup lang="ts">
import ModalChangeHandle from "@/components/ModalChangeHandle.vue";
import { useSettings, updateSettings } from "@/lib/settings";
import { ref } from "vue";

const settings = useSettings();
const activeModalChangeHandle = ref(false);
const toggleModalChangeHandle = () => {
  activeModalChangeHandle.value = !activeModalChangeHandle.value;
};
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
    <button class="btn" @click="toggleModalChangeHandle">
      Change my handle...
    </button>
  </div>
  <div v-if="activeModalChangeHandle">
    <ModalChangeHandle @close="toggleModalChangeHandle" />
  </div>
</template>
