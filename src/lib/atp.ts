import { AtpAgent, AtpSessionData } from "@atproto/api";
const SES_LOCAL_STORAGE_KEY = "sess";

const agent = new AtpAgent({
  service: "https://bsky.social",
  persistSession: (evt, sess) => {
    localStorage.setItem(SES_LOCAL_STORAGE_KEY, JSON.stringify(sess));
  },
});

let did: string | null = null;

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
    did = data.did;
  }

  return { success };
};

export const hasSession = () => !!did;

export const createSession = async (params: {
  identifier: string;
  password: string;
}) => {
  try {
    const { success, data } = await agent.login(params);

    if (success) {
      did = data.did;
    }

    return { success };
  } catch {
    return { success: false };
  }
};

export const deleteSession = () => {
  localStorage.removeItem(SES_LOCAL_STORAGE_KEY);
  did = null;
};

export type AtpResponse<T extends (...arg: any) => any> = Awaited<
  ReturnType<T>
>;

export const getTimeline = async (params: {
  limit?: number;
  cursor?: string;
}) => {
  const { success, data } = await agent.api.app.bsky.feed.getTimeline(params);

  if (!success) {
    throw new Error("getTimeline failed");
  }

  return data;
};

export const postText = async (text: string) =>
  agent.api.app.bsky.feed.post.create(
    { did },
    { text, createdAt: new Date().toISOString() }
  );

export const searchUsers = async (params: { term: string }) => {
  const { success, data } = await agent.api.app.bsky.actor.search(params);

  if (!success) {
    throw new Error("searchUsers failed");
  }

  return data.users;
};

export const followUser = async (params: { did: string; cid: string }) =>
  agent.api.app.bsky.graph.follow.create(
    { did },
    {
      subject: { did: params.did, declarationCid: params.cid },
      createdAt: new Date().toISOString(),
    }
  );

export const unfollowUser = async (params: { did: string; rkey: string }) =>
  agent.api.app.bsky.graph.follow.delete(params);

export const getProfile = async () =>
  agent.api.app.bsky.actor.getProfile({ actor: "" });

export type Feed = AtpResponse<typeof getTimeline>["feed"][number] & {
  post: { record: Record };
};
export type Post = Feed["post"];

// $type: app.bsky.feed.post
export interface Record {
  text: string;
  embed?: {
    external?: {
      title?: string;
      description?: string;
      uri?: string;
      thumbs: {
        cid: string;
        mineType: string;
      };
    };
  };
  entities?: Entity[];
}

export type Entity = {
  type: "link";
  index: { start: number; end: number };
  value: string;
};

export type User = AtpResponse<typeof searchUsers>[number];
