import { shallowReactive } from "vue";

import {
  Feed,
  getNotifications,
  getTimeline,
  Post,
  getPost,
  Notification,
} from "@/lib/atp";

// TODO: 整理する
interface State {
  timeline: Feed[];
  notifications: Notification[];
  posts: Record<string, Post>;
}

const state = shallowReactive<State>({
  timeline: [],
  notifications: [],
  posts: shallowReactive({}),
});

export const useState = (): Readonly<State> => state;

export const refreshTimeline = async () => {
  const [feed] = await getTimeline({
    limit: 100,
  });

  const cids = new Set<string>();
  const timeline: State["timeline"] = [];

  // uniq by cid
  for (const f of feed as Feed[]) {
    const cid = f.post.cid;
    if (cids.has(cid)) {
      continue;
    }

    cids.add(cid);
    timeline.push(f);
  }

  state.timeline = timeline;
};

export const refreshNotification = async () => {
  const posts: Record<string, Post> = shallowReactive({});
  const [notifications] = await getNotifications();

  for (const { reason, record } of notifications) {
    if (reason === "vote" || reason === "repost") {
      const uri = record.subject.uri;
      if (state.posts[uri]) {
        posts[uri] = state.posts[uri];
      } else {
        getPost({ uri }).then((post) => {
          if (post) posts[uri] = post;
        });
      }
    }
  }

  state.posts = posts;
  state.notifications = notifications;
};
