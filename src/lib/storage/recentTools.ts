const RECENTS_KEY = 'devdeck-recents';
const MAX_RECENTS = 10;

export function getRecentTools(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(RECENTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addRecentTool(slug: string): void {
  const recents = getRecentTools().filter((s) => s !== slug);
  recents.unshift(slug);
  localStorage.setItem(RECENTS_KEY, JSON.stringify(recents.slice(0, MAX_RECENTS)));
}
