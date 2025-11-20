import { axiosInstance } from "./axios";

export const signup = async (signupData) => {
  const response = await axiosInstance.post("/auth/signup", signupData);
  return response.data;
};

export const login = async (loginData) => {
  const response = await axiosInstance.post("/auth/login", loginData);
  return response.data;
};
export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error) {
    console.log("Error in getAuthUser:", error);
    return null;
  }
};

export const completeOnboarding = async (userData) => {
  const response = await axiosInstance.post("/auth/onboarding", userData);
  return response.data;
};

export async function getUserFriends() {
  const response = await axiosInstance.get("/user/friends");
  return response.data;
}

export async function getRecommendedUsers() {
  try {
    const response = await axiosInstance.get("/user");
    // Ensure we always return an array, even if the response structure is unexpected
    return Array.isArray(response.data?.users) 
      ? response.data.users 
      : Array.isArray(response.data) 
        ? response.data 
        : [];
  } catch (error) {
    console.error("Error fetching recommended users:", error);
    return []; // Return empty array on error
  }
}

export async function getOutgoingFriendReqs() {
  const response = await axiosInstance.get("/user/outgoing-friend-requests");
  return response.data;
}

export async function sendFriendRequest(userId) {
  const response = await axiosInstance.post(`/user/friend-request/${userId}`);
  return response.data;
}

export async function getFriendRequests() {
  const response = await axiosInstance.get("/user/friend-requests");
  return response.data;
}

export async function acceptFriendRequest(requestId) {
  const response = await axiosInstance.put('/user/friend-requests/accept', { requestId });
  return response.data;
}

export async function getStreamToken() {
  const response = await axiosInstance.get("/chat/token");
  return response.data;
}

// In frontend/src/lib/api.js
// Correct version
export async function getUserById(userId) {
  try {
    const response = await axiosInstance.get(`/user/${userId}`);
    return response.data.user;  // Keep returning user
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}


export async function getFriends() {
  const res = await axiosInstance.get("/user/friends");
  return res.data;
}
