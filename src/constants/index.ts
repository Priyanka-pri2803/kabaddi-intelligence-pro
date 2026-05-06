export const COLORS = ['#FF6B00', '#3B82F6', '#10B981', '#EF4444'];

export const COURT_ZONES = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2'] as const;

export const ROLES = {
  ADMIN: 'ADMIN',
  COACH: 'COACH',
  ANALYST: 'ANALYST',
  MANAGER: 'MANAGER',
  SPECTATOR: 'SPECTATOR'
} as const;

export const PLAYER_ROLES = {
  RAIDER: 'RAIDER',
  DEFENDER: 'DEFENDER',
  ALL_ROUNDER: 'ALL_ROUNDER'
} as const;
