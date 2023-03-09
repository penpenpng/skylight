import { AtpAgent, AtpSessionData } from "@atproto/api";
import { AtUri } from "@atproto/uri";

const SES_LOCAL_STORAGE_KEY = "sess";

const agent = new AtpAgent({
  service: "https://bsky.social",
  persistSession: (evt, sess) => {
    localStorage.setItem(SES_LOCAL_STORAGE_KEY, JSON.stringify(sess));
  },
});

let self: { did: string; handle: string } | null = null;

type CursoredResponse<T> = Promise<[data: T, cursor?: string]>;

const getCreatedAt = () => new Date().toISOString();

export const isMe = (actor: string) =>
  actor === self?.did || actor === self?.handle;

export const tryResumeSession = async () => {
  const session = (() => {
    const sessStr = localStorage.getItem(SES_LOCAL_STORAGE_KEY);
    if (!sessStr) {
      return null;
    }
    try {
      return JSON.parse(sessStr) as AtpSessionData;
    } catch {
      return null;
    }
  })();

  if (!session) {
    return { success: false };
  }

  const { success, data } = await agent.resumeSession(session);

  if (success) {
    self = data;
  }

  return { success };
};

export const createSession = async (params: {
  identifier: string;
  password: string;
}) => {
  try {
    const { success, data } = await agent.login(params);

    if (success) {
      self = data;
    }

    return { success };
  } catch {
    return { success: false };
  }
};

export const deleteSession = () => {
  localStorage.removeItem(SES_LOCAL_STORAGE_KEY);
  self = null;
};

export const getTimeline = async (params: {
  limit?: number;
  cursor?: string;
}): CursoredResponse<Feed[]> => {
  const { success, data } = await agent.api.app.bsky.feed.getTimeline({
    ...params,
    algorithm: "reverse-chronological",
  });
  if (!success) {
    throw new Error("getTimeline failed");
  }

  return [data.feed as unknown as Feed[], data.cursor];
};

export const getNotifications = async (): CursoredResponse<Notification[]> => {
  const { success, data } = await agent.api.app.bsky.notification.list();
  if (!success) {
    throw new Error("getTimeline failed");
  }

  return [data.notifications as unknown as Notification[], data.cursor];
};

export const postText = async (params: {
  text: string;
  urls?: { url: string; indices: [number, number] }[];
  reply?: ReplyRef;
}) => {
  const { text, reply, urls = [] } = params;

  return agent.api.app.bsky.feed.post.create(
    { did: self?.did },
    {
      text,
      entities: urls.map(({ url, indices }) => ({
        type: "link",
        index: {
          start: indices[0],
          end: indices[1],
        },
        value: url,
      })),
      reply: reply as any,
      createdAt: getCreatedAt(),
    }
  );
};

export const searchUsers = async (params: {
  term: string;
}): CursoredResponse<ActorDetail[]> => {
  const { success, data } = await agent.api.app.bsky.actor.search(params);
  if (!success) {
    throw new Error("searchUsers failed");
  }

  return [data.users as ActorDetail[], data.cursor];
};

export const followUser = async (params: { did: string; cid: string }) =>
  agent.api.app.bsky.graph.follow.create(
    { did: self?.did },
    {
      subject: { did: params.did, declarationCid: params.cid },
      createdAt: new Date().toISOString(),
    }
  );

export const unfollowUser = async (params: { did: string; rkey: string }) =>
  agent.api.app.bsky.graph.follow.delete(params);

export const getProfile = async (params?: {
  // If omitted, get login user's profile
  actor?: string;
}): Promise<ActorProfile> => {
  const actor = params?.actor || self?.handle;
  if (!actor) {
    throw new Error();
  }

  const { success, data } = await agent.api.app.bsky.actor.getProfile({
    actor,
  });

  if (!success) {
    throw new Error("getProfile failed");
  }

  return data as ActorProfile;
};

export const getFollows = async (params?: {
  // If omitted, get login user's follows
  actor?: string;
}): CursoredResponse<{
  subject: Actor;
  users: Actor[];
}> => {
  const user = params?.actor || self?.handle;
  if (!user) {
    throw new Error();
  }

  const { success, data } = await agent.api.app.bsky.graph.getFollows({
    user,
  });
  if (!success) {
    throw new Error("getFollows failed");
  }

  return [
    { subject: data.subject as Actor, users: data.follows as Actor[] },
    data.cursor,
  ];
};

export const getFollowers = async (params?: {
  // If omitted, get login user's followers
  actor?: string;
}): CursoredResponse<{
  subject: Actor;
  users: Actor[];
}> => {
  const user = params?.actor || self?.handle;
  if (!user) {
    throw new Error();
  }
  const { success, data } = await agent.api.app.bsky.graph.getFollowers({
    user,
  });
  if (!success) {
    throw new Error("getFollowers failed");
  }

  return [
    { subject: data.subject as Actor, users: data.followers as Actor[] },
    data.cursor,
  ];
};

export const getAuthorFeed = async (params?: {
  // If omitted, get login user's feed
  actor?: string;
}): CursoredResponse<Feed[]> => {
  const author = params?.actor || self?.handle;
  if (!author) {
    throw new Error();
  }

  const { success, data } = await agent.api.app.bsky.feed.getAuthorFeed({
    author,
  });
  if (!success) {
    throw new Error("getAuthorFeed failed");
  }

  return [data.feed as unknown as Feed[], data.cursor];
};

export const repost = async (params: { uri: string; cid: string }) =>
  agent.api.app.bsky.feed.repost.create(
    { did: self?.did },
    {
      subject: params,
      direction: "up",
      createdAt: getCreatedAt(),
    }
  );

export const upvote = async (params: { uri: string; cid: string }) =>
  agent.api.app.bsky.feed.vote.create(
    { did: self?.did },
    {
      subject: params,
      direction: "up",
      createdAt: getCreatedAt(),
    }
  );

export const getPost = async (params: {
  uri: string;
}): Promise<Post | null> => {
  const thread = await getPostThread({ ...params, depth: 0 });

  if (!thread.notFound) {
    return thread.post;
  } else {
    return null;
  }
};

export const getPostThread = async (params: {
  uri: string;
  depth?: number;
}): Promise<PostThread> => {
  const { success, data } = await agent.api.app.bsky.feed.getPostThread(params);
  if (!success) {
    throw new Error("getPostThread failed");
  }

  return data.thread as unknown as PostThread;
};

export const updateHandle = async (params: { handle: string }) =>
  agent.api.com.atproto.handle.update({ handle: params.handle });

export const getDidByUri = (uri: string): string => new AtUri(uri).hostname;

export interface Feed {
  post: Post;
  reply?: {
    parent: Post;
    root: Post;
  };
  reason?: Reason.Repost;
}

export interface Post {
  uri: string;
  cid: string;
  author: Actor;
  record: Record.Post;
  embed?: Embed.Image | Embed.External | Embed.Record;
  replyCount: number;
  repostCount: number;
  upvoteCount: number;
  downvoteCount: number;
  indexedAt: string;
  viewer: Viewer.Post;
}

export interface Actor {
  did: string;
  declaration: Declaration;
  handle: string;
  displayName?: string;
  avatar?: string;
  viewer?: Viewer.Actor;
}

export interface ActorDetail {
  did: string;
  declaration: Declaration;
  handle: string;
  displayName?: string;
  description?: string;
  avatar?: string;
  indexedAt?: string;
  viewer?: Viewer.Actor;
}

export interface ActorProfile {
  did: string;
  declaration: Declaration;
  handle: string;
  displayName?: string;
  description?: string;
  avatar?: string;
  banner?: string;
  followersCount: number;
  followsCount: number;
  postsCount: number;
  creator: string;
  indexedAt?: string;
  viewer?: Viewer.Actor;
  myState?: {
    follow?: string;
    muted?: boolean;
  };
}

export interface Declaration {
  cid: string;
  actorType: "app.bsky.system.actorUser";
}

export namespace Reason {
  export interface Repost {
    by: Actor;
    indexedAt: string;
  }
}

export namespace Embed {
  export interface Image {
    images: {
      thumb: string;
      fullsize: string;
      alt: string;
    }[];
  }
  export const isImage = (
    embed: Embed.Image | Embed.External | Embed.Record | undefined | null
  ): embed is Embed.Image => !!(embed && (embed as any).images);

  export interface External {
    external: {
      uri: string;
      title: string;
      description: string;
      thumb?: string;
    };
  }

  export interface Record {
    record:
      | {
          uri: string;
          cid: string;
          author: Actor;
          record: {};
        }
      | {
          uri: string;
        };
  }
}

export namespace Viewer {
  export interface Actor {
    muted?: boolean;
    following?: string;
    followedBy?: string;
  }

  export interface Post {
    repost?: string;
    upvote?: string;
    downvote?: string;
  }
}

export namespace Record {
  export interface Post {
    createdAt: string;
    text: string;
    embed?: {
      external?: Embed.External;
    };
    entities?: Entity[];
    reply?: ReplyRef;
  }

  export interface Vote {
    createdAt: string;
    direction: "up" | "down";
    subject: { cid: string; uri: string };
  }

  export interface Repost {
    createdAt: string;
    subject: { cid: string; uri: string };
  }

  export interface Follow {
    createdAt: string;
    subject: { declarationCid: string; did: string };
  }
}

export interface Entity {
  type: "link" | "mention";
  index: { start: number; end: number };
  value: string;
}

export interface ReplyRef {
  root: {
    cid: string;
    uri: string;
  };
  parent: {
    cid: string;
    uri: string;
  };
}

export type PostThread =
  | {
      notFound: undefined; // Not actually present, but for convenience.
      post: Post;
      parent?: PostThread;
      replies?: PostThread[];
    }
  | {
      notFound: true;
      uri: string;
    };

type NotificationOf<K, R> = {
  uri: string;
  cid: string;
  author: Actor;
  reason: K;
  reasonSubject?: string;
  record: R;
  isRead: boolean;
  indexedAt: string;
};

export type VoteNotification = NotificationOf<"vote", Record.Vote>;
export type RepostNotification = NotificationOf<"repost", Record.Repost>;
export type FollowNotification = NotificationOf<"follow", Record.Follow>;
export type MentionNotification = NotificationOf<"mention", Record.Post>;
export type ReplyNotification = NotificationOf<"reply", Record.Post>;

export type Notification =
  | VoteNotification
  | RepostNotification
  | FollowNotification
  | MentionNotification
  | ReplyNotification;
