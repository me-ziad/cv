import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = "https://node-hr.vercel.app";

// Fetch projects
export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${API_BASE}/auth/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data.projects; // array of projects
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to load projects");
    }
  }
);

// Add project (with images)
export const addProject = createAsyncThunk(
  "projects/addProject",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(`${API_BASE}/auth/projects`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
       return data.projects;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to add project");
    }
  }
);

// Update project
export const updateProject = createAsyncThunk(
  "projects/updateProject",
  async ({ projectId, updates }: { projectId: string; updates: any }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(`${API_BASE}/auth/projects/${projectId}`, updates, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data.project; 
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to update project");
    }
  }
);

// Delete project
export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async (projectId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.delete(`${API_BASE}/auth/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data.projects;  
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete project");
    }
  }
);

// Upload images to project (Cloudinary URLs)
export const uploadProjectImages = createAsyncThunk(
  "projects/uploadImages",
  async ({ projectId, formData }: { projectId: string; formData: FormData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        `${API_BASE}/auth/projects/${projectId}/upload-images`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
 
      return data.project;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to upload images");
    }
  }
);

// Delete image from project
export const deleteProjectImage = createAsyncThunk(
  "projects/deleteImage",
  async ({ projectId, imagePath }: { projectId: string; imagePath: string }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.delete(
        `${API_BASE}/auth/projects/${projectId}/delete-image`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { imagePath },
        }
      );
      return data.project;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete image");
    }
  }
);

type ProjectsState = {
  list: any[];
  loading: boolean;
  error: string | null;
};

const initialState: ProjectsState = {
  list: [],
  loading: false,
  error: null,
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Add
      .addCase(addProject.fulfilled, (state, action) => {
        state.list = action.payload;
      })

      // Update
      .addCase(updateProject.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.list.findIndex((p) => p._id === updated._id);
        if (idx !== -1) {
          state.list[idx] = updated;
        }
      })

      // Delete
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.list = action.payload;
      })

      // Upload Images
      .addCase(uploadProjectImages.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.list.findIndex((p) => p._id === updated._id);
        if (idx !== -1) {
          state.list[idx] = updated;
        }
      })

     .addCase(deleteProjectImage.fulfilled, (state, action) => {
        const updated = action.payload; 
        const idx = state.list.findIndex(p => p._id === updated._id);
        if (idx !== -1) state.list[idx] = updated;
});
  },
});

export default projectsSlice.reducer;