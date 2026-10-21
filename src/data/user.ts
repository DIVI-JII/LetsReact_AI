import type { Notification, User } from '../types';
import { hoursAgoISO } from '../utils/date';

export const mockUser: User = {
  id: 'user-1',
  name: 'Maya Patel',
  email: 'maya@example.com',
  initials: 'MP',
  goal: 'Build my first React app',
  joinedAt: '2026-09-01',
};

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    title: 'Understanding React State is ready',
    body: 'You finished Handling Events. The next lesson is unlocked.',
    at: hoursAgoISO(2),
  },
  {
    id: 'n2',
    title: 'Five days in a row',
    body: 'Nice rhythm. A short lesson today keeps your streak going.',
    at: hoursAgoISO(5),
  },
  {
    id: 'n3',
    title: 'New challenge: Build a Counter',
    body: 'Put what you know about state and events to work.',
    at: hoursAgoISO(26),
  },
];
