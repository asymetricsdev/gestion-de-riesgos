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
