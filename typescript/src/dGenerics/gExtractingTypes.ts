// Advanced - examine later
type ReturnType<T> =
  T extends (...args: any[]) => infer R ? R : never;

type Fn = () => number;
type R = ReturnType<Fn>; // number

// This is type metaprogramming
