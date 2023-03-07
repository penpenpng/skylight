<script setup lang="ts">
import { reactive, toRaw } from "vue";

import Avatar from "@/components/common/Avatar.vue";
import Loadable from "@/components/common/Loadable.vue";
import ListUsers from "@/components/profile/ListUsers.vue";
import ListPosts from "@/components/post/ListPosts.vue";

import { useSettings } from "@/lib/settings";
import { getMyProfile } from "@/lib/atp";

interface State {
  tab: "follows" | "followers" | null;
}

const state = reactive<State>({
  tab: null,
});

const user = await getMyProfile();
const settings = useSettings();

const switchTab = (tab: State["tab"]) => {
  state.tab = state.tab === tab ? null : tab;
};
const printUserObject = () => {
  console.log(toRaw(user));
};
</script>

<template>
  <div class="mx-2" style="margin-top: 30px">
    <div class="panel">
      <div class="panel-header">
        <div class="columns">
          <div class="column col-auto">
            <Avatar
              :src="user.avatar"
              :display-name="user.displayName"
              :handle="user.handle"
              size="xl"
            />
          </div>
          <div class="panel-title column">
            <div class="text-large my-1">
              {{ user.displayName || user.handle }}
            </div>
            <small class="text-dark d-block">@{{ user.handle }}</small>
          </div>
          <div v-if="settings.enabledDeveloperMode" class="column col-auto">
            <button class="btn" @click="printUserObject">Print Object</button>
          </div>
        </div>
        <div class="panel-subtitle mx-2 mt-2">{{ user.description }}</div>
      </div>
      <div class="panel-nav">
        <ul class="tab tab-block">
          <li class="tab-item" :class="{ active: state.tab === 'follows' }">
            <a href="#" @click.prevent="switchTab('follows')"
              >Follows ({{ user.followsCount }})</a
            >
          </li>
          <li class="tab-item" :class="{ active: state.tab === 'followers' }">
            <a href="#" @click.prevent="switchTab('followers')"
              >Followers ({{ user.followersCount }})</a
            >
          </li>
        </ul>
      </div>
      <div class="panel-body">
        <Loadable v-if="state.tab === 'follows'">
          <ListUsers kind="follows" />
        </Loadable>
        <Loadable v-if="state.tab === 'followers'">
          <ListUsers kind="followers" />
        </Loadable>
      </div>
    </div>

    <section class="mt-2 pt-2">
      <div class="panel-title"><h2 class="text-large">Recent Posts</h2></div>
      <Loadable>
        <ListPosts />
      </Loadable>
    </section>
  </div>
</template>
