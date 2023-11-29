export type Path<T> = T[];
export function aStar<T>(
  node: T,
  getSiblings: (node: T) => T[],
  isFinalNode: (node: T) => boolean,
  heuristic: (path: Path<T>) => number = ({ length }) => length,
): Path<T> {
  const paths: Path<T>[] = [[node]];
  const visited = new Set<string>();
  while (paths.length) {
    const path = paths.shift()!;
    const node = path[path.length - 1];
    if (visited.has(node.toString())) continue;
    if (isFinalNode(node)) return path;

    visited.add(node.toString());
    const siblings = getSiblings(node);
    const unvisitedSiblings = siblings.filter(
      (sibling) => !visited.has(sibling.toString()),
    );
    const newPaths = unvisitedSiblings.map((sibling) => [...path, sibling]);
    paths.push(...newPaths);
    paths.sort((a, b) => heuristic(a) - heuristic(b));
  }
  return [];
}
