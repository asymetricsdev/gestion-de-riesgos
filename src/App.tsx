import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Menu from './components/Menu/Menu';
import Home from './pages/HomePage';
import MatrizPeligro from './pages/MatrizPeligroPage';
import PlanificadorActividad from './pages/PlanificadorActividadPage';
import MatrizLegal from './pages/MatrizLegalPage';
import Usuarios from './pages/UsuariosPage';
import Perfiles from  './pages/PerfilesPage';
import Compañia from './pages/CompanyPage';
import ActivitiesPage from './pages/ActivitiesPage';
import Criticidad from './pages/CriticityPage';
import Comprobaciones from './pages/CheckerPage';
// import TipoComprobaciones from './pages/CheckerTypePage';
import { Container, Row, Col } from 'react-bootstrap';
import Division from './components/Division/Division';
import Peligro from './components/Hazzard/Hazzard';
import Riesgo from './components/RiskMatrix/RiskMatrix';
import Ciudad from './components/City/City';
import Posicion from './components/Position/Position';
import './AppStyle.css';
import Procesos from './components/Process/Process';
import Actividad from './components/ActividadTabla/ActividadTabla';
import Tareas from './components/Tareas/Tareas';
import TipoTareas from './components/TipoTareas/TipoTareas';
import Empleados from './components/EmpleadoTabla/Empleado';


export function App() {
    const [isMenuOpen, setIsMenuOpen] = useState(true);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div>
            <Header toggleMenu={toggleMenu} />
            <BrowserRouter>
                <Container fluid>
                    <Row>
                        <Col xs={isMenuOpen ? 2 : 1} className="p-0">
                            <Menu isOpen={isMenuOpen} toggleSidebar={toggleMenu} />
                        </Col>
                        <Col xs={isMenuOpen ? 10 : 11} className="main-content">
                                <Routes>
                                <Route path="/home" element={<Home />} />
                                <Route path="/planificacion" element={< PlanificadorActividad/>} />
                                <Route path="/planificacion/planificador-de-actividad" element={< PlanificadorActividad/>} />
                                <Route path="/planificacion/checkpoint" element={< PlanificadorActividad/>} />
                                <Route path="/planificacion/perfiles" element={<Perfiles />} />
                                <Route path="/planificacion/tareas" element={<Tareas />} />
                                <Route path="/planificacion/tipos-de-tareas" element={<TipoTareas />} />

                                <Route path="/matriz-de-peligro" element={<MatrizPeligro />} />
                                <Route path="/matriz-de-peligro/actividad" element={<Actividad />} />
                                <Route path="/matriz-de-peligro/actividades" element={<ActivitiesPage />} />
                                <Route path="/matriz-de-peligro/criticidad-de-peligro" element={<Criticidad />} />
                                <Route path="/matriz-de-peligro/comprobaciones" element={<Comprobaciones />} />
                                {/* <Route path="/matriz-de-peligro/tipo-de-comprobaciones" element={<TipoComprobaciones />} /> */}
                                <Route path="/matriz-de-peligro/peligro" element={<Peligro />} />
                                <Route path="/matriz-de-peligro/matriz-peligro" element={<MatrizPeligro />} />
                                <Route path="/matriz-de-peligro/riesgos" element={<Riesgo />} />

                                <Route path="/organizacion/ciudad" element={<Ciudad />} />
                                <Route path="/organizacion/compañia" element={<Compañia />} />
                                <Route path="/organizacion/division" element={<Division isNewRecord={false} />} />
                                <Route path="/organizacion/empleados" element={<Empleados />} />
                                <Route path="/organizacion/posicion" element={<Posicion />} />
                                <Route path="/organizacion/procesos" element={<Procesos />} />
                                <Route path="/organizacion/usuarios" element={<Usuarios />} />
                            </Routes>
                        </Col>
                    </Row>
                </Container>
            </BrowserRouter>
        </div>
    );
}

export default App;
