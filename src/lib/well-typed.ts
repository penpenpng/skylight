export type ElementType<T extends ArrayLike<T>> = T[number];
export type IsNever<T> = [T] extends [never] ? true : false;

export type Overwrite<
  T,
  A1 extends [string[], any],
  A2 extends [string[], any] = never,
  A3 extends [string[], any] = never
> = _Overwrite_n<
  T,
  [..._Overwrite_box<A1>, ..._Overwrite_box<A2>, ..._Overwrite_box<A3>]
>;
type _Overwrite_box<T> = [T] extends [never] ? [] : [T];
type _Overwrite_n<T, A extends [string[], any][]> = A extends [[string[], any]]
  ? _Overwrite_1<T, A[0][0], A[0][1]>
  : A extends [[string[], any], ...infer Tail]
  ? Tail extends [string[], any][]
    ? _Overwrite_n<_Overwrite_1<T, A[0][0], A[0][1]>, Tail>
    : never
  : never;
type _Overwrite_1<T, K extends string[], U> = K extends [keyof T]
  ? {
      [k in keyof T]: k extends K[0] ? U : T[k];
    }
  : K extends [keyof T, ...infer Tail]
  ? Tail extends string[]
    ? {
        [k in keyof T]: k extends K[0] ? _Overwrite_1<T[K[0]], Tail, U> : T[k];
      }
    : never
  : never;
