import {
  QueryClient,
  QueryKey,
  useIsFetching,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryReturnType,
} from "@tanstack/vue-query";
import { computed, onActivated, Ref } from "vue";

import {
  deletePost,
  getAuthorFeed,
  getFollowers,
  getFollows,
  getNotifications,
  getPost,
  getProfile,
  getTimeline,
  like,
  postText,
  ProfileViewDetailed,
  repost,
  unfollow,
} from "@/lib/bsky";

import { Overwrite } from "./well-typed";

const defaultQueryOptions = {
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  suspense: true,
  keepPreviousData: true,
  enabled: true,
  staleTime: Infinity, // TODO: 個別に適当な値を与える
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: defaultQueryOptions,
  },
});

type QueryKeyToken<T> = T | Ref<T | null>;

export const QueryKeys = {
  homeTimeline: () => ["home-timeline"],
  authorFeed: (actor?: QueryKeyToken<string>) => ["author-feed", actor],
  actorProfile: (actor?: QueryKeyToken<string>) => ["actor-profile", actor],
  follows: (actor?: QueryKeyToken<string>) => ["follows", actor],
  followers: (actor?: QueryKeyToken<string>) => ["followers", actor],
  notifications: () => ["notifications"],
  post: (uri: QueryKeyToken<string>) => ["post", uri],
} as const;

interface QueryOptions {
  invalidateOnActivated?: boolean;
  staleTime?: number;
  enabled?: boolean | Ref<boolean>;
}

// useAdaptiveQuery() adapted to keep-alive component
const useAdaptiveQuery = <T>(
  queryKey: QueryKey,
  queryFn: () => Promise<T>,
  options?: QueryOptions
): UseQueryReturnType<T, unknown> => {
  if (options?.invalidateOnActivated) {
    const client = useQueryClient();
    onActivated(() => {
      client.invalidateQueries(queryKey);
    });
  }

  const result = useQuery(queryKey, queryFn, {
    staleTime: options?.staleTime ?? defaultQueryOptions.staleTime,
    enabled: options?.enabled ?? defaultQueryOptions.enabled,
  });

  if (!options?.invalidateOnActivated) {
    onActivated(() => {
      if (result.isStale.value) {
        result.refetch();
      }
    });
  }

  return result;
};

const useSuspenseQuery = async <T>(
  queryKey: QueryKey,
  queryFn: () => Promise<T>,
  options?: QueryOptions
): Promise<
  Omit<
    Overwrite<UseQueryReturnType<T, unknown>, [["data"], Ref<T>]>,
    "suspense"
  >
> => {
  const result = useAdaptiveQuery(queryKey, queryFn, options);
  await result.suspense();

  return { ...result, data: result.data as Ref<T> };
};

export const useFetchButton = (queryKey: QueryKey) => {
  const client = useQueryClient();
  const fetchings = useIsFetching({ queryKey });
  return {
    isFetching: computed(() => fetchings.value > 0),
    invalidate: () => client.invalidateQueries(queryKey),
  };
};

export const useHomeTimeline = async (options?: QueryOptions) => {
  const query = await useSuspenseQuery(
    QueryKeys.homeTimeline(),
    () => getTimeline({ limit: 100 }),
    options
  );

  return {
    ...query,
    data: computed(() => query.data.value?.[0]),
  };
};

export const useAuthorFeed = async (actor?: string, options?: QueryOptions) => {
  const query = await useSuspenseQuery(
    QueryKeys.authorFeed(actor),
    () => getAuthorFeed({ actor }),
    options
  );

  return {
    ...query,
    data: computed(() => query.data.value?.[0]),
  };
};

export const useActorProfile = (actor?: string, options?: QueryOptions) => {
  return useSuspenseQuery(
    QueryKeys.actorProfile(actor),
    () => getProfile({ actor }),
    options
  );
};

export const useFollows = async (actor?: string, options?: QueryOptions) => {
  const query = await useSuspenseQuery(
    QueryKeys.follows(actor),
    () => getFollows({ actor }),
    options
  );

  return {
    ...query,
    data: computed(() => query.data.value?.[0]),
  };
};

export const useFollowers = async (actor?: string, options?: QueryOptions) => {
  const query = await useSuspenseQuery(
    QueryKeys.followers(actor),
    () => getFollowers({ actor }),
    options
  );

  return {
    ...query,
    data: computed(() => query.data.value?.[0]),
  };
};

export const useNotifications = async (options?: QueryOptions) => {
  const query = await useSuspenseQuery(
    QueryKeys.notifications(),
    () => getNotifications(),
    options
  );

  return {
    ...query,
    data: computed(() => query.data.value?.[0]),
  };
};

export const usePost = async (
  params: { uri: string } | { handle: string; rkey: string },
  options?: QueryOptions
) => {
  if ("uri" in params) {
    const uri = params.uri;
    return useSuspenseQuery(
      QueryKeys.post(uri),
      () => getPost({ uri }),
      options
    );
  } else {
    const { handle, rkey } = params;
    const { data: profile } = useQuery(QueryKeys.actorProfile(handle), () =>
      getProfile({ actor: handle })
    );
    const uri = computed(() => {
      const did = profile.value?.did;
      return did ? `at://${did}/app.bsky.feed.post/${rkey}` : null;
    });
    const uriReady = computed(() => !!uri.value);

    return useSuspenseQuery(
      QueryKeys.post(uri),
      () => getPost({ uri: uri.value as string }),
      {
        enabled: uriReady,
      }
    );
  }
};

export const usePostMutation = () => {
  const client = useQueryClient();
  return useMutation(postText, {
    onSuccess: () => {
      client.invalidateQueries(QueryKeys.homeTimeline());
      client.invalidateQueries(QueryKeys.authorFeed());
    },
  });
};

export const useDeletePostMutation = () => {
  const client = useQueryClient();
  return useMutation(deletePost, {
    onSuccess: () => {
      client.invalidateQueries(QueryKeys.homeTimeline());
      client.invalidateQueries(QueryKeys.authorFeed());
    },
  });
};

// TODO: optimisitc mutation
export const useRepostMutation = () => {
  const client = useQueryClient();
  // TODO: リポストされたポストも
  return useMutation(repost, {
    onSuccess: () => {
      client.invalidateQueries(QueryKeys.homeTimeline());
      client.invalidateQueries(QueryKeys.authorFeed());
    },
  });
};

// TODO: optimisitc mutation
export const useLikeMutation = () => {
  const client = useQueryClient();
  // TODO: upvote されたポストも
  return useMutation(like, {
    onSuccess: () => {
      client.invalidateQueries(QueryKeys.homeTimeline());
      client.invalidateQueries(QueryKeys.authorFeed());
    },
  });
};

// TODO: optimisitc mutation
// export const useFollowMutation = () => {
//   return useMutation(followUser);
// };

// TODO: optimisitc mutation
export const useUnfollowMutation = () => {
  return useMutation(unfollow);
};

export const resolveDidToHandleForNavigationGuard = async (did: string) => {
  const profile: ProfileViewDetailed =
    queryClient.getQueryData(QueryKeys.actorProfile(did)) ??
    (await queryClient.fetchQuery(QueryKeys.actorProfile(did), () =>
      getProfile({ actor: did })
    ));
  const handle = profile.handle;
  queryClient.setQueryData(QueryKeys.actorProfile(handle), profile);
  return handle;
};
