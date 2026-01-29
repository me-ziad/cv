import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = "https://node-hr.vercel.app"; 

//  Fetch profile
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (id?: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const url = id
        ? `${API_BASE}/auth/profile/${id}` 
        : `${API_BASE}/auth/profile`; 

      const { data } = await axios.get(url, {
        headers: id ? {} : { Authorization: `Bearer ${token}` },
      });

      return {
        id: data.id,
        name: data.name,
        email: data.email,
        avatar: data.avatar,
        bio: data.bio,
        phone: data.phone,
        address: data.address,
        position: data.position,
        cvUrl: data.cvUrl,
        skills: data.skills || [],
        education: data.education || [],
        experience: data.experience || [],
        projects: data.projects || [],
        github: data.github,
        linkedin: data.linkedin,
        portfolio: data.portfolio,
        behance: data.behance,
        dribbble: data.dribbble,
        twitter: data.twitter,
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to load profile");
    }
  }
);

//  Upload CV
export const uploadCv = createAsyncThunk(
  "profile/uploadCv",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(`${API_BASE}/auth/upload-cv`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return data.user;  
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to upload CV");
    }
  }
);

//  Update profile (name, bio, phone, address, position, avatar, links)
export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(`${API_BASE}/auth/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return {
        name: data.user.name,
        email: data.user.email,
        avatar: data.user.avatar,
        bio: data.user.bio,
        phone: data.user.phone,
        address: data.user.address,
        position: data.user.position,
        cvUrl: data.user.cvUrl,
        skills: data.user.skills || [],
        education: data.user.education || [],
        experience: data.user.experience || [],
        projects: data.user.projects || [],
        //  روابط شخصية
        github: data.user.github,
        linkedin: data.user.linkedin,
        portfolio: data.user.portfolio,
        behance: data.user.behance,
        dribbble: data.user.dribbble,
        twitter: data.user.twitter,
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to update profile");
    }
  }
);

type ProfileState = {
  data: {
    id?: string;
    name?: string;
    email?: string;
    avatar?: string;
    bio?: string;
    phone?: string;
    address?: string;
    position?: string;
    cvUrl?: string;
    skills?: string[];
    education?: any[];
    experience?: any[];
    projects?: any[];
    github?: string;
    linkedin?: string;
    portfolio?: string;
    behance?: string;
    dribbble?: string;
    twitter?: string;
  } | null;
  loading: boolean;
  error: string | null;
};

const initialState: ProfileState = {
  data: null,
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch profile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Error";
      })

      // Upload CV
      .addCase(uploadCv.fulfilled, (state, action) => {
        state.data = action.payload;  
      })

      .addCase(uploadCv.rejected, (state, action) => {
      state.error = (action.payload as string) || "Error uploading CV";
    })

      // Update profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.error = (action.payload as string) || "Error updating profile";
      });
  },
});

export default profileSlice.reducer;