import { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Header from './components/Header/Header';
import Menu from './components/Menu/Menu';
import { AppRoutes } from './Routes/Routes';
import LoginPage from './Pages/LoginPage';
import { Container, Row, Col } from 'react-bootstrap';
import './AppStyle.css';


export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
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
    return <LoginPage onLogin={handleLogin} />;
  }

  
  return (
    <BrowserRouter>
      <Header toggleMenu={toggleMenu} handleLogout={handleLogout} />
      <Container fluid>
        <Row>
          <Col xs={isMenuOpen ? 2 : 1} className="p-0">
            <Menu isOpen={isMenuOpen} toggleSidebar={toggleMenu} isAuthenticated={isAuthenticated} />
          </Col>
          <Col xs={isMenuOpen ? 10 : 11} className="main-content">
            <AppRoutes isAuthenticated={isAuthenticated} onLogin={handleLogin} />
          </Col>
        </Row>
      </Container>
    </BrowserRouter>
  );

}

export default App;
