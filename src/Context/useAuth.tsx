
// import { createContext, useEffect, useState } from "react";
// import { UserProfile } from "../Models/User";
// import { useNavigate } from "react-router-dom";
// import { loginAPI, registerAPI } from "../Services/AuthService";
// import React from "react";
// import axios from "axios";
// import { showAlert } from "../components/functions";

// type UserContextType = {
//   user: UserProfile | null;
//   token: string | null;
//   registerUser: (email: string, username: string, password: string) => void;
//   loginUser: (username: string, password: string) => void;
//   logout: () => void;
//   isLoggedIn: () => boolean;
// };

// type Props = { children: React.ReactNode };

// const UserContext = createContext<UserContextType>({} as UserContextType);

// export const UserProvider = ({ children }: Props) => {
//   const navigate = useNavigate();
//   const [token, setToken] = useState<string | null>(null);
//   const [user, setUser] = useState<UserProfile | null>(null);
//   const [isReady, setIsReady] = useState(false);

//   useEffect(() => {
//     const user = localStorage.getItem("user");
//     const token = localStorage.getItem("token");
//     if (user && token) {
//       setUser(JSON.parse(user));
//       setToken(token);
//       axios.defaults.headers.common["Authorization"] = "Bearer " + token;
//     }
//     setIsReady(true);
//   }, []);

//   const registerUser = async (
//     email: string,
//     username: string,
//     password: string
//   ) => {
//     await registerAPI(email, username, password)
//       .then((res) => {
//         if (res) {
//           localStorage.setItem("token", res?.data.token);
//           const userObj = {
//             userName: res?.data.userName,
//             email: res?.data.email,
//           };
//           localStorage.setItem("user", JSON.stringify(userObj));
//           setToken(res?.data.token!);
//           setUser(userObj!);
//           showAlert("Login Success!", "success");
//           navigate("/search");
//         }
//       })
//       .catch((e) => showAlert("Server error occured", "error"));
//   };

//   const loginUser = async (username: string, password: string) => {
//     await loginAPI(username, password)
//       .then((res) => {
//         if (res) {
//           localStorage.setItem("token", res?.data.token);
//           const userObj = {
//             userName: res?.data.userName,
//             email: res?.data.email,
//           };
//           localStorage.setItem("user", JSON.stringify(userObj));
//           setToken(res?.data.token!);
//           setUser(userObj!);
//           showAlert("Login Success!", "success");
//           navigate("/search");
//         }
//       })
//       .catch((e) => showAlert("Server error occured", "error"));
//   };

//   const isLoggedIn = () => {
//     return !!user;
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setUser(null);
//     setToken("");
//     navigate("/");
//   };

//   return (
//     <UserContext.Provider
//       value={{ loginUser, user, token, logout, isLoggedIn, registerUser }}
//     >
//       {isReady ? children : null}
//     </UserContext.Provider>
//   );
// };

// export const useAuth = () => React.useContext(UserContext);




import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from '../Models/User';
import { loginAPI } from '../Services/AuthService';

type UserContextType = {
  user: UserProfile | null;
  loginUser: (username: string, password: string) => void;
  logout: () => void;
  token: string | null;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  const loginUser = async (username: string, password: string) => {
    const res = await loginAPI(username, password);
    if (res) {
      const token = res.data.token;
      const userObj = { userName: res.data.userName, email: res.data.email };
      setUser(userObj);
      setToken(token);
      localStorage.setItem('user', JSON.stringify(userObj));
      localStorage.setItem('token', token);
      navigate('/home');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <UserContext.Provider value={{ user, loginUser, logout, token }}>
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useAuth must be used within a UserProvider');
  }
  return context;
};
