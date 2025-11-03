/**
 * Split number string into 3-digit groups from right to left
 */
export function splitIntoGroups(numStr: string): string[] {
  const groups: string[] = []
  let i = numStr.length

  while (i > 0) {
    const start = Math.max(0, i - 3)
    groups.unshift(numStr.slice(start, i))
    i = start
  }

  return groups
}

/**
 * Check if all groups after the given index are zeros
 */
export function allFollowingGroupsAreZero(
  groups: string[],
  index: number,
): boolean {
  for (let j = index + 1; j < groups.length; j++) {
    const g = groups[j]
    if (g !== '000' && g !== '00' && g !== '0') {
      return false
    }
  }
  return true
}
