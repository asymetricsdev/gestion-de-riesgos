import { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './AppStyle.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Menu from './components/Menu/Menu';
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
import Registro from './pages/RegistroPage';    


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
                                {/*LOGIN*/}
                                <Route path="/login" element={<Login />} />
                                
                                {/*PLANIFICACIÓN*/}
                                <Route path="/planificacion" element={< PlanificadorActividad/>} />
                                <Route path="/planificacion/planificacion" element={< Planificacion/>} />
                                <Route path="/planificacion/planificador-de-actividad" element={< PlanificadorActividad/>} />
                                <Route path="/planificacion/actividades" element={<Actividad />} />
                                <Route path="/planificacion/perfiles" element={<Perfiles />} />
                                {/*VERIFICACION*/}
                                <Route path="/verificacion/verificadores-de-control" element={<VerificadorControl />} />
                                <Route path="/verificacion/items" element={<Items />} />
                                {/*MATRIZ DE PELIGRO*/}
                                <Route path="/matriz-de-peligro" element={<MatrizPeligro />} />
                                <Route path="/matriz-de-peligro/matriz-peligro" element={<MatrizPeligro />} />
                                <Route path="/matriz-de-peligro/configuracion/tareas" element={<Tareas />} />
                                <Route path="/matriz-de-peligro/configuracion/tipo-de-tareas" element={<TipoTareas />} />
                                <Route path="/matriz-de-peligro/configuracion/criticidad-de-peligro" element={<Criticidad />} />
                                <Route path="/matriz-de-peligro/configuracion/jerarquia-de-control" element={<JerarquiaControl />} />
                                <Route path="/matriz-de-peligro/configuracion/peligro" element={<Peligro />} />
                                <Route path="/matriz-de-peligro/configuracion/riesgos" element={<Riesgo />} />
                                {/*TIPOS DE ACTIVIDAD */}
                                <Route path="/tipo-de-actividad/tipo-de-actividad" element={<TipoActividad />} />
                                {/*ORGANIZACION */}
                                <Route path="/organizacion/ciudad" element={<Ciudad />} />
                                <Route path="/organizacion/compañias" element={<Compañia />} />
                                <Route path="/organizacion/areas" element={<Area />} />
                                <Route path="/organizacion/colaboradores" element={<Colaboradores />} /> 
                                <Route path="/organizacion/cargos" element={<Cargo />} />
                                <Route path="/organizacion/procesos" element={<Proceso />} />
                                {/*TAREA-COLABORADOR*/}
                                <Route path="/tarea-colaborador/:id" element={<TareaColaborador />} />
                                <Route path="/colaborador-ejecutar-tarea/:empId/tarea/:taskId" element={<ColaboradorEjecutarTarea />} />
                            </Routes>
                        </Col>
                    </Row>
                </Container>
            </BrowserRouter>
        </div>
    );
}

export default App;
