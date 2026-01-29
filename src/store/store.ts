import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import profileReducer from "../component/redux/profileSlice";
import skillsReducer from "../component/redux/skillsSlice";
import educationReducer from "../component/redux/educationSlice";
import experienceReducer from "../component/redux/experienceSlice";
import projectsReducer from "../component/redux/projectsSlice";
import { m } from 'framer-motion';
 
export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    skills: skillsReducer,
    education: educationReducer,
    experience: experienceReducer,
    projects: projectsReducer,


  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;