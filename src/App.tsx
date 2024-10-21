import { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { BrowserRouter } from 'react-router-dom';
import './AppStyle.css';
import Header from './components/Header/Header';
import Menu from './components/Menu/Menu';
import { UserProvider } from './Context/UserProvider';
import LoginPage from './Pages/LoginPage';
import { AppRoutes } from './Routes/Routes';

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      //setIsAuthenticated(false);MOC comenta esto para que no se cierre la sesion
    }
  }, []);

  const handleLogin = (token: string) => {
    localStorage.setItem('token', token); 
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (!isAuthenticated) {
    return (
      <BrowserRouter>
        <LoginPage onLogin={handleLogin} />
      </BrowserRouter>
    );
  }

  return (
<BrowserRouter>
<UserProvider>
  <Header toggleMenu={toggleMenu} handleLogout={handleLogout} />
  <Container fluid>
    <Row>
      <Col xs={isMenuOpen ? 2 : 1} className="p-0">
        <Menu isOpen={isMenuOpen} toggleSidebar={toggleMenu} isLoggedIn={isAuthenticated} />
      </Col>
      <Col xs={isMenuOpen ? 10 : 11} className="main-content">
        <AppRoutes isAuthenticated={isAuthenticated} onLogin={handleLogin} />
      </Col>
    </Row>
  </Container>
  </UserProvider>
</BrowserRouter>

);
}


  

export default App;
