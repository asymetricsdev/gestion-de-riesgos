
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from '../Models/User';
import { loginAPI } from '../Services/AuthService';
import { Modal, Button } from 'react-bootstrap';

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
  const [showSessionModal, setShowSessionModal] = useState(false);
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

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
  
    const resetTimer = () => {
      clearTimeout(timeoutId); 
      timeoutId = setTimeout(() => {
        setShowSessionModal(true);
      }, 1000 * 60 * 30);
    };
  
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
  
    resetTimer(); 
  
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
    };
  }, []);
  

  const extendSession = () => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setShowSessionModal(false);
    } else {
      logout();
    }
  };

  return (
    <UserContext.Provider value={{ user, loginUser, logout, token }}>
      {children}
      <Modal show={showSessionModal} onHide={logout}>
        <Modal.Header closeButton>
          <Modal.Title>Tu sesión está por expirar</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Quieres continuar con la sesión?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={logout}>
            Cerrar sesión
          </Button>
          <Button variant="primary" onClick={extendSession}>
            Continuar sesión
          </Button>
        </Modal.Footer>
      </Modal>
    </UserContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un UserProvider');
  }
  return context;
};
