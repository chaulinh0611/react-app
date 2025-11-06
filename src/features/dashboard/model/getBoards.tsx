import axios from "axios";


export const getAllBoards = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axios.get("http://localhost:3000/boards", {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    return response;
  } catch (error) {
    console.error("Failed to fetch boards:", error);
    throw error;
  }
};
