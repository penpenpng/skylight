import { useMutation, useQuery, useQueryClient } from "vue-query";

import {
  unfollowUser,
  getAuthorFeed,
  getFollowers,
  getFollows,
  getPost,
  getProfile,
  getTimeline,
  postText,
  repost,
  upvote,
  getNotifications,
} from "@/lib/atp";
import { computed } from "vue";

const Keys = {
  homeTimeline: () => "home-timeline",
  authorFeed: (actor?: string) => ["author-feed", actor],
  actorProfile: (actor?: string) => ["actor-profile", actor],
  follows: (actor?: string) => ["follows", actor],
  followers: (actor?: string) => ["followers", actor],
  notifications: () => "notifications",
  post: (uri: string) => ["post", uri],
} as const;

export const useHomeTimeline = () => {
  const query = useQuery(Keys.homeTimeline(), () =>
    getTimeline({ limit: 100 })
  );

  return {
    ...query,
    data: computed(() => query.data.value?.[0]),
  };
};

export const useAuthorFeed = (actor?: string) => {
  const query = useQuery(Keys.authorFeed(actor), () =>
    getAuthorFeed({ actor })
  );

  return {
    ...query,
    data: computed(() => query.data.value?.[0]),
  };
};

export const useActorProfile = (actor?: string) => {
  return useQuery(Keys.actorProfile(actor), () => getProfile({ actor }));
};

export const useFollows = (actor?: string) => {
  const query = useQuery(Keys.follows(actor), () => getFollows({ actor }));

  return {
    ...query,
    data: computed(() => query.data.value?.[0]),
  };
};

export const useFollowers = (actor?: string) => {
  const query = useQuery(Keys.followers(actor), () => getFollowers({ actor }));

  return {
    ...query,
    data: computed(() => query.data.value?.[0]),
  };
};

export const useNotifications = () => {
  const query = useQuery(Keys.notifications(), () => getNotifications());

  return {
    ...query,
    data: computed(() => query.data.value?.[0]),
  };
};

export const usePost = (uri: string) => {
  return useQuery(Keys.post(uri), () => getPost({ uri }));
};

export const fetchHomeTimeline = async () => {
  const client = useQueryClient();
  client.fetchQuery(Keys.homeTimeline(), () => getTimeline({ limit: 100 }));
};

export const fetchNotifications = () => {
  const client = useQueryClient();
  client.fetchQuery(Keys.notifications(), () => getNotifications());
};

export const usePostMutation = () => {
  return useMutation(postText, {
    onSuccess: fetchHomeTimeline,
  });
};

// TODO: optimisitc mutation
export const useRepostMutation = () => {
  return useMutation(repost, {
    onSuccess: fetchHomeTimeline,
  });
};

// TODO: optimisitc mutation
export const useUpvoteMutation = () => {
  return useMutation(upvote, {
    onSuccess: fetchHomeTimeline,
  });
};

// TODO: optimisitc mutation
// export const useFollowMutation = () => {
//   return useMutation(followUser);
// };

// TODO: optimisitc mutation
export const useUnfollowMutation = () => {
  return useMutation(unfollowUser);
};
