import axios from "axios";


export const getUser = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axios.get("http://localhost:3000/auth/me", {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    return response;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    throw error;
  }
};
