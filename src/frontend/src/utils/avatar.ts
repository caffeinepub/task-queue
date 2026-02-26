const AVATAR_COLORS = [
  '#E53935', '#D81B60', '#8E24AA', '#5E35B1',
  '#1E88E5', '#039BE5', '#00ACC1', '#00897B',
  '#43A047', '#7CB342', '#F4511E', '#FB8C00',
];

export function getAvatarColor(name: string): string {
  if (!name) return AVATAR_COLORS[0];
  const index = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

export function getAvatarInitial(name: string): string {
  if (!name) return '?';
  return name.charAt(0).toUpperCase();
}
