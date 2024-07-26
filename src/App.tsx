import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Menu from './components/Menu';
import Home from './pages/HomePage';
import MatrizPeligro from './pages/MatrizPeligroPage';
import PlanificadorActividad from './pages/PlanificadorActividadPage';
import MatrizLegal from './pages/MatrizLegalPage';
import { Container, Row, Col } from 'react-bootstrap';

export function App() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div>
            <Header toggleMenu={toggleMenu} />
            <BrowserRouter>
                <Container fluid>
                    <Row>
                        <Col xs={2} className="p-0">
                            <Menu isOpen={isMenuOpen} />
                        </Col>
                        <Col xs={10}>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/matriz-peligro" element={<MatrizPeligro />} />
                                <Route path="/planificador-actividad" element={<PlanificadorActividad />} />
                                <Route path="/matriz-legal" element={<MatrizLegal />} />
                            </Routes>
                        </Col>
                    </Row>
                </Container>
            </BrowserRouter>
        </div>
    );
}

export default App;

