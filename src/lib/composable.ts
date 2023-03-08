import { onMounted, onBeforeUnmount, Ref, toRaw, unref } from "vue";

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

export const useObjectInspector = (obj: {}) => {
  return {
    printObject: () => {
      console.log(toRaw(unref(obj)));
    },
    copyObject: () => {
      navigator.clipboard.writeText(JSON.stringify(toRaw(unref(obj))));
    },
  };
};
