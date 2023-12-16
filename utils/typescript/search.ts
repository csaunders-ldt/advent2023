// Capture a set (e.g. `partialRight(pruneSeen, new Set())` and pass it to the below)
export function pruneSeen<T>(set: T[], seen: Set<string>) {
  return set.filter(
    (t) => !(seen.has(JSON.stringify(t)) || seen.add(JSON.stringify(t))),
  );
}

export function bfs<T>(
  set: T[],
  next: (t: T) => T[],
  prune: (set: T[]) => T[] = (set) => set,
  isDone: (t: T[]) => boolean = (set) => set.length === 0,
) {
  while (!isDone(set)) {
    set = prune(set.flatMap(next));
  }
  return set;
}

export function dfs<T>(
  set: T[],
  next: (t: T) => T[],
  isDone: (t: T[]) => boolean = (set) => set.length === 0,
) {
  while (!isDone(set)) {
    set.unshift(...next(set.shift()));
  }
  return set;
}
