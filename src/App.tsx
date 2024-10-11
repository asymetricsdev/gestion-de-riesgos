import { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Header from './components/Header/Header';
import Menu from './components/Menu/Menu';
import { AppRoutes } from './Routes/Routes';
import LoginPage from './Pages/LoginPage';
import { Container, Row, Col } from 'react-bootstrap';
import './AppStyle.css';
import Home from './pages/HomePage';
import MatrizPeligro from './pages/MatrizPeligroPage';
import PlanificadorActividad from './pages/PlanificadorActividadPage';
import Planificacion from './pages/PlanificacionPage';
import Perfiles from  './pages/PerfilesPage';
import Compañia from './pages/CompañiaPage';
import TipoActividad from './pages/TipoActividadesPage';
import Criticidad from './pages/CriticidadPage';
import Area from './pages/AreaPage';
import Peligro from './pages/PeligroPage';
import Riesgo from './pages/RiesgoPage';
import Ciudad from './pages/CiudadPage';
import Cargo from './pages/CargoPage';
import Proceso from './pages/ProcesoPage';
import Actividad from './pages/ActividadPage';
import Tareas from './pages/TareasPage';
import TipoTareas from './pages/TipoTareasPage';
import Colaboradores from './pages/ColaboradoresPage';
import Items from './pages/ItemsPage';
import VerificadorControl from './pages/VerificadorControlPage';
import JerarquiaControl from './pages/JerarquiaControlPage';
import TareaColaborador from './components/TareaColaborador/TareaColaborador';
import ColaboradorEjecutarTarea from './pages/ColaboradorEjecutarTareaPage';
import Login from './pages/LoginPage';
import Estados from './pages/EstadosPage';
import Registro from './pages/RegistroPage';    

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
