// Single import point for course content. A future API client can replace
// these exports with fetched data without touching any component.
export { achievements, getAchievement } from './achievements';
export { challenges, counterChallenge, getChallenge } from './challenges';
export { course, getWeek, months, weeks } from './course';
export { getLesson, lessons } from './lessons';
export { getProject, projects } from './projects';
export { createSeedProgress } from './seedProgress';
export { mockNotifications, mockUser } from './user';
