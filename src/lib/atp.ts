import { AtpAgent, AtpSessionData } from "@atproto/api";

const SES_LOCAL_STORAGE_KEY = "sess";

const agent = new AtpAgent({
  service: "https://bsky.social",
  persistSession: (evt, sess) => {
    localStorage.setItem(SES_LOCAL_STORAGE_KEY, JSON.stringify(sess));
    console.log({ evt, sess });
  },
});

export let did: string | null = null;

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

export const login = async (params: {
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
