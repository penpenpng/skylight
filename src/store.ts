import { reactive } from "vue";

import { Feed, getTimeline } from "@/lib/atp";

interface State {
  timelineCursor: string | null;
  timeline: Feed[];
}

const state = reactive<State>({
  timelineCursor: null,
  timeline: [],
});

export const useState = (): Readonly<State> => state;

export const refreshTimeline = async () => {
  const { feed, cursor } = await getTimeline({
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

  state.timelineCursor = cursor || null;
  state.timeline = timeline;
};
