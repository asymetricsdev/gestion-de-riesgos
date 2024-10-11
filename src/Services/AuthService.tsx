import axios from "axios";
import { handleError } from "../Helpers/ErrorHandler";
import { UserProfileToken } from "../Models/User";

const baseURL = import.meta.env.VITE_API_URL;

export const loginAPI = async (username: string, password: string) => {
  try {
    const data = await axios.post<UserProfileToken>(`${baseURL}/auth/login`, {   
      username: username,
      password: password,
    });
    return data;
  } catch (error) {
    handleError(error);
  }
};

export const registerAPI = async (
  email: string,
  username: string,
  password: string
) => {
  try {
    const data = await axios.post<UserProfileToken>(`${baseURL}/register/auth`, {
      email: email,
      username: username,
      password: password,
    });
    return data;
  } catch (error) {
    handleError(error);
  }
};