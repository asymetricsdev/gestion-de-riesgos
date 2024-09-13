import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Menu from './components/Menu/Menu';
import Home from './pages/HomePage';
import MatrizPeligro from './pages/MatrizPeligroPage';
import PlanificadorActividad from './pages/PlanificadorActividadPage';
import Perfiles from  './pages/PerfilesPage';
import Compañia from './pages/CompanyPage';
import Actividades from './pages/ActividadesPage';
import Criticidad from './pages/CriticityPage';
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
import Checkpoint from './components/Checkpoint/Checkpoint';
import Checker from './components/Checker/Checker';
import CheckerType from './components/CheckerType/CheckerType';


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
                                {/*PLANIFICACIÓN*/}
                                <Route path="/planificacion" element={< PlanificadorActividad/>} />
                                <Route path="/planificacion/planificador-de-actividad" element={< PlanificadorActividad/>} />
                                <Route path="/planificacion/actividades" element={<Actividad />} />
                                <Route path="/planificacion/perfiles" element={<Perfiles />} />
                                {/*VERIFICACION*/}
                                <Route path="/verificacion/verificadores-de-control" element={<Checker />} />
                                <Route path="/verificacion/items" element={<Checkpoint />} />
                                {/*MATRIZ DE PELIGRO*/}
                                <Route path="/matriz-de-peligro" element={<MatrizPeligro />} />
                                <Route path="/matriz-de-peligro/matriz-peligro" element={<MatrizPeligro />} />
                                <Route path="/matriz-de-peligro/configuracion/tareas" element={<Tareas />} />
                                <Route path="/matriz-de-peligro/configuracion/tipo-de-tareas" element={<TipoTareas />} />
                                <Route path="/matriz-de-peligro/configuracion/criticidad-de-peligro" element={<Criticidad />} />
                                <Route path="/matriz-de-peligro/configuracion/jerarquia-de-control" element={<CheckerType />} />
                                <Route path="/matriz-de-peligro/configuracion/peligro" element={<Peligro />} />
                                <Route path="/matriz-de-peligro/configuracion/riesgos" element={<Riesgo />} />
                                {/*TIPOS DE ACTIVIDAD */}
                                <Route path="/tipo-de-actividad/tipo-de-actividad" element={<Actividades />} />
                                {/*ORGANIZACION */}
                                <Route path="/organizacion/ciudad" element={<Ciudad />} />
                                <Route path="/organizacion/compañias" element={<Compañia />} />
                                <Route path="/organizacion/areas" element={<Division isNewRecord={false} />} />
                                <Route path="/organizacion/colaboradores" element={<Empleados />} />
                                <Route path="/organizacion/cargos" element={<Posicion />} />
                                <Route path="/organizacion/procesos" element={<Procesos />} />
                            </Routes>
                        </Col>
                    </Row>
                </Container>
            </BrowserRouter>
        </div>
    );
}

export default App;
