// src/redux/educationSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = "https://node-hr.vercel.app";

// Fetch education
export const fetchEducation = createAsyncThunk("education/fetchEducation", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    const { data } = await axios.get(`${API_BASE}/auth/education`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data.education;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Failed to load education");
  }
});

// Add education
export const addEducation = createAsyncThunk("education/addEducation", async (edu: any, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    const { data } = await axios.post(`${API_BASE}/auth/education`, edu, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data.education;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Failed to add education");
  }
});

// Update education
export const updateEducation = createAsyncThunk("education/updateEducation", async ({ eduId, updates }: { eduId: string; updates: any }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    const { data } = await axios.put(`${API_BASE}/auth/education/${eduId}`, updates, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data.education;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Failed to update education");
  }
});

// Delete education
export const deleteEducation = createAsyncThunk("education/deleteEducation", async (eduId: string, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    const { data } = await axios.delete(`${API_BASE}/auth/education/${eduId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data.education;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Failed to delete education");
  }
});

type EducationState = { list: any[]; loading: boolean; error: string | null };

const initialState: EducationState = { list: [], loading: false, error: null };

const educationSlice = createSlice({
  name: "education",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEducation.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchEducation.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchEducation.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(addEducation.fulfilled, (state, action) => { state.list = action.payload; })
      .addCase(updateEducation.fulfilled, (state, action) => { state.list = action.payload; })
      .addCase(deleteEducation.fulfilled, (state, action) => { state.list = action.payload; });
  },
});

export default educationSlice.reducer;