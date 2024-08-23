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
import Company from './pages/CompanyPage';
import ActivitiesPage from './pages/ActivitiesPage';
import Criticidad from './pages/CriticityPage';
import Comprobaciones from './pages/CheckerPage';
import { Container, Row, Col } from 'react-bootstrap';
import Division from './components/Division/Division';
import Peligro from './components/Hazzard/Hazzard';
import Ciudad from './components/City/City';
import Posicion from './components/Position/Position';
import './AppStyle.css';
import Procesos from './components/Process/Process';
import Actividad from './components/ActividadTabla/ActividadTabla';
import Tareas from './components/Tareas/Tareas';
import Empleado from './components/EmpleadoTabla/Empleado';


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
                                <Route path="/matriz-de-peligro" element={<MatrizPeligro />} />
                                <Route path="/planificador-de-actividad" element={< PlanificadorActividad/>} />
                                <Route path="/matriz-legal" element={<MatrizLegal />} />
                                <Route path="/admin/usuarios" element={<Usuarios />} />
                                <Route path="/admin/perfiles" element={<Perfiles />} />
                                <Route path="/admin/procesos" element={<Procesos />} />
                                <Route path="/admin/company" element={<Company />} />
                                <Route path="/admin/actividades" element={<ActivitiesPage />} />
                                <Route path="/admin/division" element={<Division />} />
                                <Route path="/admin/peligro" element={<Peligro />} />
                                <Route path="/admin/matriz-de-peligro/riesgos" element={<MatrizPeligro />} />
                                <Route path="/admin/matriz-de-peligro/criticidad-de-peligro" element={<Criticidad />} />
                                <Route path="/admin/matriz-de-peligro/comprobaciones" element={<Comprobaciones />} />
                                <Route path="/admin/ciudad" element={<Ciudad />} />
                                <Route path="/admin/posicion" element={<Posicion />} />
                                <Route path="admin/actividad" element={<Actividad />} />
                                <Route path="admin/tareas" element={<Tareas />} />

                                <Route path="admin/empleado" element={<Empleado />} />

                                <Route path="admin/tareas" element={<Ciudad />} />


                            </Routes>
                        </Col>
                    </Row>
                </Container>
            </BrowserRouter>
        </div>
    );
}

export default App;
