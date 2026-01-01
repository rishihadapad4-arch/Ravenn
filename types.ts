
export enum Role {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER'
}

export enum Permission {
  MANAGE_MEMBERS = 'MANAGE_MEMBERS',
  PIN_MESSAGES = 'PIN_MESSAGES',
  CREATE_EVENTS = 'CREATE_EVENTS',
  DELETE_MESSAGES = 'DELETE_MESSAGES',
  MANAGE_ROLES = 'MANAGE_ROLES'
}

export interface HouseRole {
  id: string;
  name: string;
  color: string;
  permissions: Permission[];
}

export interface HouseMember {
  id: string;
  username: string;
  avatar: string;
  roleId: string; // ID of the HouseRole
  joinedAt: number;
}

export interface Friend {
  id: string;
  username: string;
  avatar: string;
  commsCode: string;
  lastMessage?: string;
}

export interface User {
  id: string;
  username: string;
  avatar: string;
  bio: string;
  joinedAt: number;
  commsCode: string;
}

export interface House {
  id: string;
  name: string;
  description: string;
  emblem: string;
  ownerId: string;
  membersCount: number;
  isPrivate: boolean;
  roles: HouseRole[];
  members: HouseMember[];
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: number;
  houseId?: string; // If undefined, it's a DM
  recipientId?: string;
  reactions?: Record<string, number>;
  status?: 'sending' | 'sent' | 'flagged';
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  houseId: string;
  timestamp: number;
}

export interface ModerationResult {
  isSafe: boolean;
  reason?: string;
}
