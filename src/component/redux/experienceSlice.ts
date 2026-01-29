// src/redux/experienceSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = "https://node-hr.vercel.app";

/* ================= FETCH ================= */
export const fetchExperience = createAsyncThunk(
  "experience/fetchExperience",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${API_BASE}/auth/experience`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data.experience; // array
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load experience"
      );
    }
  }
);

/* ================= ADD ================= */
export const addExperience = createAsyncThunk(
  "experience/addExperience",
  async (exp: any, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `${API_BASE}/auth/experience`,
        exp,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data.experience; // array updated
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to add experience"
      );
    }
  }
);

/* ================= UPDATE  ================= */
export const updateExperience = createAsyncThunk(
  "experience/updateExperience",
  async (
    { expId, updates }: { expId: string; updates: any },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        `${API_BASE}/auth/experience/${expId}`,
        updates,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return {
        expId,
        updatedList: data.experience, // array كاملة
      };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update experience"
      );
    }
  }
);

/* ================= DELETE ================= */
export const deleteExperience = createAsyncThunk(
  "experience/deleteExperience",
  async (expId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.delete(
        `${API_BASE}/auth/experience/${expId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data.experience; // array updated
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete experience"
      );
    }
  }
);

/* ================= SLICE ================= */

type ExperienceState = {
  list: any[];
  loading: boolean;
  error: string | null;
};

const initialState: ExperienceState = {
  list: [],
  loading: false,
  error: null,
};

const experienceSlice = createSlice({
  name: "experience",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* -------- FETCH -------- */
      .addCase(fetchExperience.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExperience.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchExperience.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* -------- ADD -------- */
      .addCase(addExperience.fulfilled, (state, action) => {
        state.list = action.payload;
      })

      /* -------- UPDATE  -------- */
      .addCase(updateExperience.fulfilled, (state, action) => {
        state.list = action.payload.updatedList;
      })

      /* -------- DELETE -------- */
      .addCase(deleteExperience.fulfilled, (state, action) => {
        state.list = action.payload;
      });
  },
});

export default experienceSlice.reducer;
