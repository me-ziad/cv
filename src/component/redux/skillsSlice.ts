// src/redux/skillsSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = "https://node-hr.vercel.app"; 

//  Fetch skills
export const fetchSkills = createAsyncThunk(
  "skills/fetchSkills",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${API_BASE}/auth/skills`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data.skills;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to load skills");
    }
  }
);

//  Add skill
export const addSkill = createAsyncThunk(
  "skills/addSkill",
  async (skill: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `${API_BASE}/auth/skills`,
        { skill },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data.skills;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to add skill");
    }
  }
);

//  Update skill
export const updateSkill = createAsyncThunk(
  "skills/updateSkill",
  async ({ oldSkill, newSkill }: { oldSkill: string; newSkill: string }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        `${API_BASE}/auth/skills/${oldSkill}`,
        { newSkill },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data.skills;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to update skill");
    }
  }
);

//  Delete skill
export const deleteSkill = createAsyncThunk(
  "skills/deleteSkill",
  async (skill: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.delete(`${API_BASE}/auth/skills/${skill}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data.skills;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete skill");
    }
  }
);

type SkillsState = {
  list: string[];
  loading: boolean;
  error: string | null;
};

const initialState: SkillsState = {
  list: [],
  loading: false,
  error: null,
};

const skillsSlice = createSlice({
  name: "skills",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSkills.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSkills.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchSkills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addSkill.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(updateSkill.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(deleteSkill.fulfilled, (state, action) => {
        state.list = action.payload;
      });
  },
});

export default skillsSlice.reducer;