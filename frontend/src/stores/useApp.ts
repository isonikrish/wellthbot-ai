import type { Habit, LifeEvent, MoodLog, Ritual, UserType } from "@/lib/types";
import { create } from "zustand";
import axios from "axios";
type useAppType = {
  user: UserType | null;
  fetchUser: () => void;
  logout: () => void;
  setUser: (data: UserType) => void;
  fetchRituals: () => Promise<Ritual[]>;
  fetchHabits: () => Promise<Habit[]>;
  fetchLifeEvents: () => Promise<LifeEvent[]>;
  fetchMoodlogs: () => Promise<MoodLog[]>;
};

export const BACKEND_URL = "http://localhost:5003";

const token = localStorage.getItem("token");
export const useApp = create<useAppType>((set) => ({
  user: null,
  setUser: (data) => {
    set({ user: data });
  },
  fetchUser: async () => {
    const res = await axios.get(`${BACKEND_URL}/api/user/get-user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.status === 200) {
      set({ user: res.data });
    }
  },
  logout: () => {
    localStorage.removeItem("token");
    set({ user: null });
  },

  fetchRituals: async () => {
    const res = await axios.get(`${BACKEND_URL}/api/user/my-rituals`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 200) {
      return res.data;
    }
  },
  fetchHabits: async () => {
    const res = await axios.get(`${BACKEND_URL}/api/user/my-habits`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 200) {
      return res.data;
    }
  },
  fetchLifeEvents: async () => {
    const res = await axios.get(`${BACKEND_URL}/api/user/my-lifeevents`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 200) {
      return res.data;
    }
  },
  fetchMoodlogs: async () => {
    const res = await axios.get(`${BACKEND_URL}/api/user/my-moodlogs`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 200) {
      return res.data;
    }
  },
}));
