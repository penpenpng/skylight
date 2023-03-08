import { QueryClient, useMutation, useQuery } from "vue-query";

import {
  followUser,
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

const client = new QueryClient();

export const useHomeTimeline = () => {
  const query = useQuery(
    Keys.homeTimeline(),
    () => getTimeline({ limit: 100 }),
    {
      suspense: true,
    }
  );

  return {
    ...query,
    data: computed(() => query.data.value?.[0]),
  };
};

export const useAuthorFeed = (actor?: string) => {
  const query = useQuery(
    Keys.authorFeed(actor),
    () => getAuthorFeed({ actor }),
    {
      suspense: true,
    }
  );

  return {
    ...query,
    data: computed(() => query.data.value?.[0]),
  };
};

export const useActorProfile = (actor?: string) => {
  return useQuery(Keys.actorProfile(actor), () => getProfile({ actor }), {
    suspense: true,
  });
};

export const useFollows = (actor?: string) => {
  const query = useQuery(Keys.follows(actor), () => getFollows({ actor }), {
    suspense: true,
  });

  return {
    ...query,
    data: computed(() => query.data.value?.[0]),
  };
};

export const useFollowers = (actor?: string) => {
  const query = useQuery(Keys.followers(actor), () => getFollowers({ actor }), {
    suspense: true,
  });

  return {
    ...query,
    data: computed(() => query.data.value?.[0]),
  };
};

export const useNotifications = () => {
  const query = useQuery(Keys.notifications(), () => getNotifications(), {
    suspense: true,
  });

  return {
    ...query,
    data: computed(() => query.data.value?.[0]),
  };
};

export const usePost = (uri: string) => {
  return useQuery(Keys.post(uri), () => getPost({ uri }), { suspense: true });
};

export const fetchHomeTimeline = () => {
  client.setQueryData(Keys.homeTimeline(), () => getTimeline({ limit: 100 }));
};

export const fetchNotifications = () => {
  client.setQueryData(Keys.notifications(), () => getNotifications());
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
