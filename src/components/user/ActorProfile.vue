<script setup lang="ts">
import { reactive } from "vue";

import defaultHero from "@/assets/default-hero.jpg?url";
import Avatar from "@/components/common/Avatar.vue";
import Dropdown from "@/components/common/Dropdown.vue";
import Loadable from "@/components/common/Loadable.vue";
import ListPosts from "@/components/post/ListPosts.vue";
import ButtonFollow from "@/components/user/ButtonFollow.vue";
import ListUsers from "@/components/user/ListUsers.vue";
import ProfileTab from "@/components/user/ProfileTab.vue";
import { useObjectInspector } from "@/lib/composable";
import { useActorProfile } from "@/lib/query";

const props = defineProps({
  actor: {
    type: String,
    required: true,
  },
});

const { data: user } = await useActorProfile(props.actor);

interface State {
  tab: string;
}

const state = reactive<State>({
  tab: "posts",
});

const { printObject, copyObject } = useObjectInspector(user);
</script>

<template>
  <div class="card-profile card d-block">
    <div class="card-hero">
      <div class="img-filter">
        <img
          :src="user.banner || defaultHero"
          style="object-fit: cover; max-height: 150px; width: 100%"
        />
      </div>
    </div>
    <div class="card-profile-body">
      <div class="card-header d-flex" style="align-items: center">
        <div class="column col-auto">
          <Avatar
            :src="user.avatar"
            :display-name="user.displayName"
            :handle="user.handle"
            size="xl"
            disable-link
          />
        </div>
        <div class="column">
          <h5 class="mb-1">{{ user.displayName || user.handle }}</h5>
          <small class="text-dark d-block">@{{ user.handle }}</small>
        </div>
        <div v-if="actor" class="column col-auto">
          <ButtonFollow :user="user" />
        </div>
        <div class="column col-auto">
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
      </div>
      <div class="card-body pre-line">{{ user.description }}</div>
    </div>
  </div>

  <ProfileTab :user="user" :tab="state.tab" @switch="state.tab = $event" />

  <Loadable v-if="state.tab === 'follows'">
    <ListUsers kind="follows" :actor="actor" />
  </Loadable>
  <Loadable v-else-if="state.tab === 'followers'">
    <ListUsers kind="followers" :actor="actor" />
  </Loadable>
  <Loadable v-else-if="state.tab === 'posts'">
    <ListPosts kind="author-feed" :actor="actor" />
  </Loadable>
</template>

<style scoped>
.card-profile {
  position: relative;
  padding-top: 120px;
}

.card-hero {
  position: absolute;
  z-index: 1;
  width: 100%;
  top: 0;
}

.card-profile-body {
  position: relative;
  z-index: 3;
}

.img-filter {
  box-sizing: border-box;
  position: relative;
}
.img-filter img {
  display: block;
  box-sizing: border-box;
}
.img-filter:after {
  position: absolute;
  z-index: 2;
  box-sizing: border-box;
  content: "";
  height: calc(100% + 5px);
  width: 100%;
  top: 0;
  left: 0;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 1) 85%,
    rgba(255, 255, 255, 1) 100%
  );
}
</style>
