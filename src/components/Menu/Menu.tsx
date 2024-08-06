import React, { useState } from 'react';
import { Nav, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faExclamationTriangle, faCalendarAlt, faFileAlt, faChevronDown, faChevronUp, faUsers, faAddressCard, faListCheck, faUserTie, faBuilding, faCheckCircle, faBolt, faPeopleRobbery, faCircleExclamation, faSitemap, faCircleRadiation, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import './MenuStyle.css';

interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}

const Menu: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
    const [isAdminOpen, setIsAdminOpen] = useState(false);
    const [isMatrizOpen, setIsMatrizOpen] = useState(false);

    const toggleAdminSubmenu = () => {
        setIsAdminOpen(!isAdminOpen);
    };

    const renderTooltip = (text: string) => (
        <Tooltip id="button-tooltip">
            {text}
        </Tooltip>
    );

    return (
        <div className={`sidebar bg-dark text-white vh-100 ${isOpen ? 'open' : ''}`}>
            <Nav defaultActiveKey="/home" className="flex-column">
                {isOpen ? (
                    <NavLink to="/home" className="nav-link text-white d-flex align-items-center">
                        <FontAwesomeIcon icon={faHome} className="me-2" />
                        <span>Home</span>
                    </NavLink>
                ) : (
                    <OverlayTrigger placement="right" overlay={renderTooltip('Home')}>
                        <NavLink to="/home" className="nav-link text-white d-flex align-items-center">
                            <FontAwesomeIcon icon={faHome} className="me-2" />
                        </NavLink>
                    </OverlayTrigger>
                )}
                {isOpen ? (
                    <NavLink to="/planificador-de-actividad" className="nav-link text-white d-flex align-items-center">
                        <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                        <span>Planificador de Actividad</span>
                    </NavLink>
                ) : (
                    <OverlayTrigger placement="right" overlay={renderTooltip('Planificador de Actividad')}>
                        <NavLink to="/planificador-de-actividad" className="nav-link text-white d-flex align-items-center">
                            <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                        </NavLink>
                    </OverlayTrigger>
                )}
                {isOpen ? (
                    <NavLink to="/matriz-de-peligro" className="nav-link text-white d-flex align-items-center">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                        <span>Matriz de Peligro</span>
                    </NavLink>
                ) : (
                    <OverlayTrigger placement="right" overlay={renderTooltip('Matriz de Peligro')}>
                        <NavLink to="/matriz-de-peligro" className="nav-link text-white d-flex align-items-center">
                            <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                        </NavLink>
                    </OverlayTrigger>
                )}
                {isOpen ? (
                    <NavLink to="/matriz-legal" className="nav-link text-white d-flex align-items-center">
                        <FontAwesomeIcon icon={faFileAlt} className="me-2" />
                        <span>Matriz Legal</span>
                    </NavLink>
                ) : (
                    <OverlayTrigger placement="right" overlay={renderTooltip('Matriz Legal')}>
                        <NavLink to="/matriz-legal" className="nav-link text-white d-flex align-items-center">
                            <FontAwesomeIcon icon={faFileAlt} className="me-2" />
                        </NavLink>
                    </OverlayTrigger>
                )}
                {isOpen ? (
                    <div className="nav-link text-white d-flex align-items-center" onClick={toggleAdminSubmenu}>
                        <FontAwesomeIcon icon={faUserTie} className="me-2" />
                        <span>Administración</span>
                        <FontAwesomeIcon icon={isAdminOpen ? faChevronUp : faChevronDown} className="ms-auto" />
                    </div>
                ) : (
                    <OverlayTrigger placement="right" overlay={renderTooltip('Administración')}>
                        <div className="nav-link text-white d-flex align-items-center" onClick={toggleAdminSubmenu}>
                            <FontAwesomeIcon icon={faUserTie} className="me-2" />
                            <FontAwesomeIcon icon={isAdminOpen ? faChevronUp : faChevronDown} className="ms-auto" />
                        </div>
                    </OverlayTrigger>
                )}
                {isAdminOpen && (
                    <div className="submenu">
                        {isOpen ? (
                            <NavLink to="/admin/usuarios" className="nav-link text-white d-flex align-items-center">
                                <FontAwesomeIcon icon={faUsers} className="me-2" />
                                <span>Usuarios</span>
                            </NavLink>
                        ) : (
                            <OverlayTrigger placement="right" overlay={renderTooltip('Usuarios')}>
                                <NavLink to="/admin/usuarios" className="nav-link text-white d-flex align-items-center">
                                    <FontAwesomeIcon icon={faUsers} className="me-2" />
                                </NavLink>
                            </OverlayTrigger>
                        )}
                        {isOpen ? (
                            <NavLink to="/admin/perfiles" className="nav-link text-white d-flex align-items-center">
                                <FontAwesomeIcon icon={faAddressCard} className="me-2" />
                                <span>Perfiles</span>
                            </NavLink>
                        ) : (
                            <OverlayTrigger placement="right" overlay={renderTooltip('Perfiles')}>
                                <NavLink to="/admin/perfiles" className="nav-link text-white d-flex align-items-center">
                                    <FontAwesomeIcon icon={faAddressCard} className="me-2" />
                                </NavLink>
                            </OverlayTrigger>
                        )}
                        {isOpen ? (
                            <NavLink to="/admin/tareas" className="nav-link text-white d-flex align-items-center">
                                <FontAwesomeIcon icon={faListCheck} className="me-2" />
                                <span>Tareas</span>
                            </NavLink>
                        ) : (
                            <OverlayTrigger placement="right" overlay={renderTooltip('Tareas')}>
                                <NavLink to="/admin/tareas" className="nav-link text-white d-flex align-items-center">
                                    <FontAwesomeIcon icon={faListCheck} className="me-2" />
                                </NavLink>
                            </OverlayTrigger>
                        )}
                        {isOpen ? (
                            <NavLink to="/admin/company" className="nav-link text-white d-flex align-items-center">
                                <FontAwesomeIcon icon={faBuilding} className="me-2" />
                                <span>Company</span>
                            </NavLink>
                        ) : (
                            <OverlayTrigger placement="right" overlay={renderTooltip('Company')}>
                                <NavLink to="/admin/company" className="nav-link text-white d-flex align-items-center">
                                    <FontAwesomeIcon icon={faBuilding} className="me-2" />
                                </NavLink>
                            </OverlayTrigger>
                        )}
                        {isOpen ? (
                            <NavLink to="/admin/actividades" className="nav-link text-white d-flex align-items-center">
                                <FontAwesomeIcon icon={faPeopleRobbery} className="me-2" />
                                <span>Actividades</span>
                            </NavLink>
                        ) : (
                            <OverlayTrigger placement="right" overlay={renderTooltip('Actividades')}>
                                <NavLink to="/admin/actividades" className="nav-link text-white d-flex align-items-center">
                                    <FontAwesomeIcon icon={faPeopleRobbery} className="me-2" />
                                </NavLink>
                            </OverlayTrigger>
                        )}
                        {isOpen ? (
                            <NavLink to="/admin/division" className="nav-link text-white d-flex align-items-center">
                                <FontAwesomeIcon icon={faSitemap} className="me-2" />
                                <span>Division</span>
                            </NavLink>
                        ) : (
                            <OverlayTrigger placement="right" overlay={renderTooltip('Division')}>
                                <NavLink to="/admin/division" className="nav-link text-white d-flex align-items-center">
                                    <FontAwesomeIcon icon={faSitemap} className="me-2" />
                                </NavLink>
                            </OverlayTrigger>
                        )}
                        {isOpen ? (
                            <NavLink to="/admin/peligro" className="nav-link text-white d-flex align-items-center">
                                <FontAwesomeIcon icon={faCircleRadiation} className="me-2" />
                                <span>Peligro</span>
                            </NavLink>
                        ) : (
                            <OverlayTrigger placement="right" overlay={renderTooltip('Peligro')}>
                                <NavLink to="/admin/peligro" className="nav-link text-white d-flex align-items-center">
                                    <FontAwesomeIcon icon={faCircleRadiation} className="me-2" />
                                </NavLink>
                            </OverlayTrigger>
                        )}
                        {isOpen ? (
                            <NavLink to="/admin/matriz-de-peligro/riesgos" className="nav-link text-white d-flex align-items-center">
                                <FontAwesomeIcon icon={faCircleExclamation} className="me-2" />
                                <span>Riesgos</span>
                            </NavLink>
                        ) : (
                            <OverlayTrigger placement="right" overlay={renderTooltip('Riesgos')}>
                                <NavLink to="/admin/matriz-de-peligro/riesgos" className="nav-link text-white d-flex align-items-center">
                                    <FontAwesomeIcon icon={faCircleExclamation} className="me-2" />
                                </NavLink>
                            </OverlayTrigger>
                        )}
                        {isOpen ? (
                            <NavLink to="/admin/matriz-de-peligro/criticidad-de-peligro" className="nav-link text-white d-flex align-items-center">
                                <FontAwesomeIcon icon={faBolt} className="me-2" />
                                <span>Criticidad</span>
                            </NavLink>
                        ) : (
                            <OverlayTrigger placement="right" overlay={renderTooltip('Criticidad')}>
                                <NavLink to="/admin/matriz-de-peligro/criticidad-de-peligro" className="nav-link text-white d-flex align-items-center">
                                    <FontAwesomeIcon icon={faBolt} className="me-2" />
                                </NavLink>
                            </OverlayTrigger>
                        )}
                        {isOpen ? (
                            <NavLink to="/admin/matriz-de-peligro/comprobaciones" className="nav-link text-white d-flex align-items-center">
                                <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                                <span>Checker</span>
                            </NavLink>
                        ) : (
                            <OverlayTrigger placement="right" overlay={renderTooltip('Checker')}>
                                <NavLink to="/admin/matriz-de-peligro/comprobaciones" className="nav-link text-white d-flex align-items-center">
                                    <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                                </NavLink>
                            </OverlayTrigger>
                        )}
                    </div>
                )}
            </Nav>
            <button onClick={toggleSidebar} className="btn-sidebar">
                <FontAwesomeIcon icon={isOpen ? faChevronLeft : faChevronRight} />
            </button>
        </div>
    );
};

export default Menu;
