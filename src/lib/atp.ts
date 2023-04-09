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

export const getMyHandle = () => self?.handle || "";

export const isMe = (actor: string) =>
  actor === self?.did || actor === self?.handle;

export class AtpError extends Error {
  constructor(msg?: string) {
    super(msg);
  }
}

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
    throw new AtpError("getTimeline failed");
  }

  return [data.feed as unknown as Feed[], data.cursor];
};

export const getNotifications = async (): CursoredResponse<Notification[]> => {
  const { success, data } = await agent.api.app.bsky.notification.list();
  if (!success) {
    throw new AtpError("getTimeline failed");
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

export const deletePost = async (params: { uri: string }) =>
  agent.api.com.atproto.repo.deleteRecord(parseUri(params.uri));

export const searchUsers = async (params: {
  term: string;
}): CursoredResponse<ActorDetail[]> => {
  const { success, data } = await agent.api.app.bsky.actor.search(params);
  if (!success) {
    throw new AtpError("searchUsers failed");
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

export const unfollowUser = async (params: { uri: string }) =>
  agent.api.app.bsky.graph.follow.delete(parseUri(params.uri));

export const getProfile = async (params?: {
  // If omitted, get login user's profile
  actor?: string;
}): Promise<ActorProfile> => {
  const actor = params?.actor || self?.handle;
  if (!actor) {
    throw new AtpError();
  }

  const { success, data } = await agent.api.app.bsky.actor.getProfile({
    actor,
  });

  if (!success) {
    throw new AtpError("getProfile failed");
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
    throw new AtpError();
  }

  const { success, data } = await agent.api.app.bsky.graph.getFollows({
    user,
  });
  if (!success) {
    throw new AtpError("getFollows failed");
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
    throw new AtpError();
  }
  const { success, data } = await agent.api.app.bsky.graph.getFollowers({
    user,
  });
  if (!success) {
    throw new AtpError("getFollowers failed");
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
    throw new AtpError();
  }

  const { success, data } = await agent.api.app.bsky.feed.getAuthorFeed({
    author,
  });
  if (!success) {
    throw new AtpError("getAuthorFeed failed");
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

export const getPostThread = async (params: {
  uri: string;
  depth?: number;
}): Promise<PostThread.Any> => {
  const { success, data } = await agent.api.app.bsky.feed.getPostThread({
    ...params,
    depth: params.depth ?? 0,
  });
  if (!success) {
    throw new AtpError("getPostThread failed");
  }

  return data.thread as PostThread.Any;
};

export const updateHandle = async (params: { handle: string }) =>
  agent.api.com.atproto.handle.update({ handle: params.handle });

export const parseUri = (uri: string) => {
  const aturi = new AtUri(uri);

  return {
    did: aturi.hostname,
    collection: aturi.collection,
    rkey: aturi.rkey,
  };
};

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
  embed?: Embed.Any;
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
  export type Any =
    | Embed.Image
    | Embed.External
    | Embed.Record
    | Embed.RecordNotFound;

  export interface Image {
    images: {
      thumb: string;
      fullsize: string;
      alt: string;
    }[];
  }
  export const isImage = (
    embed: Embed.Any | undefined | null
  ): embed is Embed.Image => !!(embed && (embed as any).images);

  export interface External {
    external: {
      uri: string;
      title: string;
      description: string;
      thumb?: string;
    };
  }
  export const isExternal = (
    embed: Embed.Any | undefined | null
  ): embed is Embed.External => !!(embed && (embed as any).external);

  export interface Record {
    record: {
      uri: string;
      cid: string;
      author: Actor;
      record: Record.Post;
    };
  }
  export const isRecord = (
    embed: Embed.Any | undefined | null
  ): embed is Embed.Record => !!(embed && (embed as any).record?.cid);

  export interface RecordNotFound {
    record: {
      uri: string;
    };
  }
  export const isRecordNotFound = (
    embed: Embed.Any | undefined | null
  ): embed is Embed.RecordNotFound =>
    !!(embed && (embed as any).record) && !(embed as any).record?.cid;
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

export namespace PostThread {
  export type Any = Found | NotFound;

  export const isFound = (thread: Any): thread is Found => "post" in thread;
  export interface Found {
    post: Post;
    parent?: PostThread.Any;
    replies?: PostThread.Any[];
  }

  export const isNotFound = (thread: Any): thread is NotFound =>
    !("post" in thread);
  export interface NotFound {
    notFound: true;
    uri: string;
  }
}

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
