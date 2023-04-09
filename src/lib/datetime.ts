import { computed, ref } from "vue";

import { useSettings } from "@/lib/settings";

const current = ref(new Date().getTime());
setInterval(() => {
  current.value = new Date().getTime();
}, 1000 * 32);

const relativeDatetime = (datetime: string) => {
  const time = new Date(datetime).getTime();
  return computed(() => toRelativeString(current.value - time));
};
const absoluteDatetime = (datetime: string) =>
  new Date(datetime).toLocaleTimeString();

export const useDatetimeString = (datetime: string) => {
  const settings = useSettings();

  return computed(() =>
    settings.enableRelativeTime
      ? relativeDatetime(datetime).value
      : absoluteDatetime(datetime)
  );
};

const divide = (a: number, b: number): [number, number] => [
  Math.floor(a / b),
  a % b,
];

const toRelativeString = (diff: number): string => {
  const relativeTime = Math.max(diff, 0);

  const [day, lessDay] = divide(relativeTime, 1000 * 60 * 60 * 24);
  if (day > 0) {
    return `${day}d`;
  }

  const [hour, lessHour] = divide(lessDay, 1000 * 60 * 60);
  if (hour > 0) {
    return `${hour}h`;
  }

  const [min] = divide(lessHour, 1000 * 60);
  if (min > 0) {
    return `${min}m`;
  }

  return "now";
};
