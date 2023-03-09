<script setup lang="ts">
import { PropType } from "vue";

import Avatar from "@/components/common/Avatar.vue";
import Username from "@/components/common/Username.vue";
import Dropdown from "@/components/common/Dropdown.vue";
import ButtonFollow from "@/components/user/ButtonFollow.vue";

import { Actor, ActorDetail } from "@/lib/atp";
import { useSettings } from "@/lib/settings";
import { useObjectInspector } from "@/lib/composable";

const props = defineProps({
  user: {
    type: Object as PropType<ActorDetail | Actor>,
    required: true,
  },
});

const settings = useSettings();
const { printObject, copyObject } = useObjectInspector(props.user);
</script>

<template>
  <article class="tile hoverable">
    <div class="tile-icon">
      <Avatar
        :src="user.avatar"
        :display-name="user.displayName"
        :handle="user.handle"
      />
    </div>
    <div class="tile-content">
      <div class="tile-title">
        <Username :user="user" />
      </div>
      <div class="tile-subtitle">
        <small class="text-dark">@{{ user.handle }}</small>
      </div>
      <span v-if="!!user.viewer?.followedBy" class="chip">Follows You</span>
    </div>
    <div class="tile-action mx-2">
      <ButtonFollow :user="user" class="mr-2" />
      <Dropdown
        :keys="['print-object', 'copy-object']"
        right
        @print-object="printObject"
        @copy-object="copyObject"
      >
        <template #print-object>Print Object</template>
        <template #copy-object>Copy Object</template>
      </Dropdown>
    </div>
  </article>
</template>
