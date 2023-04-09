export type ElementType<T extends ArrayLike<T>> = T[number];
export type Overwrite<T, U> = {
  [K in keyof T | keyof U]: K extends keyof U
    ? U[K]
    : K extends keyof T
    ? T[K]
    : never;
};
