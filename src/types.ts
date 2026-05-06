/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum ActionType {
  RAID = 'RAID',
  TACKLE = 'TACKLE',
  BONUS = 'BONUS',
  ALL_OUT = 'ALL_OUT',
  TIMEOUT = 'TIMEOUT',
  REVIVAL = 'REVIVAL',
}

export enum RaidResult {
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL',
  EMPTY = 'EMPTY',
  SUPER_RAID = 'SUPER_RAID',
}

export enum TackleResult {
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL',
  SUPER_TACKLE = 'SUPER_TACKLE',
}

export interface Player {
  id: string;
  name: string;
  number: number;
  role: 'RAIDER' | 'DEFENDER' | 'ALL_ROUNDER';
  image?: string;
  stats: {
    raids: number;
    tackles: number;
    points: number;
    efficiency: number;
  };
}

export interface Team {
  id: string;
  name: string;
  logo?: string;
  players: Player[];
  shortName: string;
}

export interface MatchAction {
  id: string;
  type: ActionType;
  result: RaidResult | TackleResult | string;
  points: number;
  playerId?: string;
  opponentPlayerId?: string;
  teamId: string;
  timestamp: number;
  zone?: ZoneId; 
}

export type ZoneId = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'D1' | 'D2';

export interface ZoneIntensity {
  id: ZoneId;
  count: number;
  weight: number; // 0 to 1
  lastActivity: number;
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  date: string;
  actions: MatchAction[];
  isLive: boolean;
  half: 1 | 2;
  score: {
    home: number;
    away: number;
  };
  revivalQueue: {
    home: string[]; // Player IDs
    away: string[];
  };
  momentum: number; // -100 to 100
  aiInsights?: string[];
  winProbability: {
    home: number;
    away: number;
  };
}

export interface User {
  uid: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'COACH' | 'ANALYST' | 'MANAGER' | 'SPECTATOR';
  createdAt: any;
}

export interface Tournament {
  id: string;
  name: string;
  standings: {
    teamId: string;
    played: number;
    won: number;
    lost: number;
    draw: number;
    points: number;
  }[];
}
