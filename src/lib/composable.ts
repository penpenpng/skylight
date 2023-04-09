import { onBeforeUnmount, onMounted, Ref, toRaw, unref } from "vue";

export const useOnClickOutside = (
  el: Ref<HTMLElement | undefined>,
  callback: () => void
) => {
  const clickOutside = (ev: MouseEvent) => {
    if (ev.target instanceof Node && !el.value?.contains(ev.target)) {
      callback();
    }
  };
  onMounted(() => {
    addEventListener("click", clickOutside);
  });
  onBeforeUnmount(() => {
    removeEventListener("click", clickOutside);
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useObjectInspector = (obj: any) => {
  return {
    printObject: () => {
      console.info(toRaw(unref(obj)));
    },
    copyObject: () => {
      navigator.clipboard.writeText(JSON.stringify(toRaw(unref(obj))));
    },
  };
};
