import type { QueryFunction } from "@tanstack/react-query";
import type { FC } from "react";

type PropsWithStyles<T, K, P extends string = ""> = K extends (
  props: infer U,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => any
  ? T & Omit<U, P>
  : never;
type PropsWithClassName<T = object> = T & { className?: string };
type CompoundComponent<K, T = object> = FC<T> & K;
type ComponentWithSkeleton<T> = CompoundComponent<{ Skeleton: FC }, T>;
type UnwrapPromise<T> = T extends Promise<infer U> ? U : never;
type InferQueryKey<T> = T extends QueryFunction<unknown, infer U> ? U : never;

export type {
  PropsWithClassName,
  CompoundComponent,
  ComponentWithSkeleton,
  UnwrapPromise,
  InferQueryKey,
  PropsWithStyles,
};
