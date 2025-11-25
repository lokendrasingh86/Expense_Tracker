import { create } from 'zustand';
import { persist } from 'zustand/middleware';
// 1. Import your custom axiosInstance instead of the default axios
import { axiosInstance } from '../lib/axios'; 
import axios from 'axios'; // We keep this for the isAxiosError check

// Define the shape of the user data to match your Prisma model
interface User {
  id: number;
  email: string;
  fullName: string; 
}

// Define the shape of the data objects for our functions
type LoginData = {
    email: string;
    password: string;
}

type SignUpData = {
    fullName: string;
    email: string;
    password: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  // Updated function signatures to accept a single data object
  login: (data: LoginData) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  // Updated to reflect the async nature of the function
  logout: () => Promise<void>;
}

// Create the store
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      isLoggedIn: false,
      user: null,
      
      login: async (data) => {
        try {
          console.log('Attempting login with:', { email: data.email });
          // 2. Use axiosInstance and a relative path
          const response = await axiosInstance.post(`/auth/login`, data);

          const user = response.data;
          console.log('Login successful, user data:', user);
          set({ isLoggedIn: true, user: user });

        } catch (error) {
          console.error('Login failed:', error);
          if (axios.isAxiosError(error) && error.response) {
            console.error('Login error response:', error.response.data);
            throw new Error(error.response.data.error || 'Login failed. Please check your credentials.');
          }
          throw new Error('An unexpected error occurred during login.');
        }
      },

      // --- SIGNUP ACTION (Updated) ---
      // Now accepts a single 'data' object
      signUp: async (data) => {
        try {
            // 3. Use axiosInstance and a relative path
            const response = await axiosInstance.post(`/auth/signup`, data);
            console.log("Signup successful:", response.data.message);

        } catch (error) {
             console.error('Signup failed:', error);
             if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data.error || 'Signup failed. Please try again.');
             }
             throw new Error('An unexpected error occurred during signup.');
        }
      },

      // --- LOGOUT ACTION (Updated) ---
      logout: async () => {
        try {
            // 4. Use axiosInstance and a relative path
            await axiosInstance.post(`/auth/logout`);
            set({ isLoggedIn: false, user: null });
        } catch (error) {
            console.error('Logout failed:', error);
            set({ isLoggedIn: false, user: null });
        }
      },
    }),
    {
      name: 'auth-storage', 
    }
  )
);

