import { useEffect, DependencyList } from "react";

export function useDebounceEffect(
  fn: () => void,
  waitTime: number,
  deps: DependencyList = []
) {
  useEffect(() => {
    const t = setTimeout(() => {
      fn(); // Remova o operador de espalhamento e não passe deps aqui
    }, waitTime);

    return () => {
      clearTimeout(t);
    };
  }, [deps, fn, waitTime]);
}
