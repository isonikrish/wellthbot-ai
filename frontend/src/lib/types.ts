export type UserType = {
  id: number;
  name: string;
  email: string;
  password: string;
};
export type CreateRitual = {
  title: string;
  ritualType: string;
  duration: number;
  ritualSteps: string[];
  notes: string;
};
export type Ritual = {
  id: number;
  title: string;
  ritualType: string;
  duration: number;
  ritualSteps: string[];
  notes: string;
  logs: RitualLog[];
};
export type RitualLog = {
  id: number;
  status: string;
  date: Date;
  startedAt: Date;
  pausedAt: Date;
  resumedAt: Date;
  completedAt: Date;
};

export type LifeEvent = {
  id: number;
  title: string;
  description: string;
  emotionType: string;
  userId: number;
  createdAt: Date;
};
export type Habit = {
  id: number;
  title: string;
  createdAt: Date;
  userId: number

}
export type MoodLog = {
  id: number;
  mood: string;
  energyLevel: number;
  stressLevel: number;
  userId: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date
}