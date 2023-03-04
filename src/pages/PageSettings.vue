<script setup lang="ts">
import { useSettings, updateSettings } from "@/lib/settings";

const settings = useSettings();
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
</template>
