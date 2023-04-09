<script setup lang="ts">
import { ref, shallowRef } from "vue";

import ButtonAsync from "@/components/common/ButtonAsync.vue";
import { getProfile, tryResumeSession, updateHandle } from "@/lib/bsky";

const emits = defineEmits<{
  (ev: "close"): void;
}>();

const serviceDomain = "bsky.social";
const user = shallowRef(await getProfile());
const handleText = ref(user.value.handle);
const handleError = ref("");

const close = () => {
  emits("close");
};
const verifyHandle = async () => {
  const text = handleText.value;
  handleError.value = "";
  try {
    await updateHandle({ handle: text });
    await tryResumeSession();
    close();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
    if (error?.message === "Internal Server Error") {
      handleError.value =
        "Something went wrong. Check your DNS record is correct.";
    } else {
      handleError.value = String(error);
    }
  }
};
</script>

<template>
  <div class="modal active">
    <a class="modal-overlay" @click="close"></a>
    <div class="modal-container">
      <div class="modal-header">
        <button class="btn btn-clear float-right" @click="close"></button>
        <h5 class="modal-title">Edit your handle</h5>
      </div>
      <div class="modal-body">
        <div class="content">
          <div class="form-group" :class="{ 'has-error': !!handleError }">
            <div class="input-group">
              <span class="input-group-addon">@</span>
              <input
                v-model="handleText"
                placeholder="Your handle"
                class="form-input"
                type="text"
                @input="handleError = ''"
              />
            </div>
            <p class="form-input-hint">{{ handleError }}</p>
          </div>
          <div
            v-show="!(handleText || user.handle).endsWith(`.${serviceDomain}`)"
          >
            <p>Add following record to your domain:</p>
            <ul>
              <li>
                Domain: <code>_atproto.{{ handleText || user.handle }}</code>
              </li>
              <li>Type: <code>TXT</code></li>
              <li>
                Value: <code>did={{ user.did }}</code>
              </li>
            </ul>
          </div>
          <div>
            <p>
              You can use your original domain, or just use
              <code>xxxxx.{{ serviceDomain }}</code
              >.
            </p>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <ButtonAsync
          class="btn btn-primary"
          :on-click="verifyHandle"
          :disabled="!handleText || user.handle === handleText"
        >
          Verify
        </ButtonAsync>
        <button class="btn btn-link" @click="close">Close</button>
      </div>
    </div>
  </div>
</template>
