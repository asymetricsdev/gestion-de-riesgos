import React, { useState } from 'react';
import { Nav, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import './MenuStyle.css';

interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}

const Menu: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
    const [isAdminOpen, setIsAdminOpen] = useState(false);
    
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
                         <i className="fa-solid fa-home"></i>
                        <span>Home</span>
                    </NavLink>
                ) : (
                    <OverlayTrigger placement="right" overlay={renderTooltip('Home')}>
                        <NavLink to="/home" className="nav-link text-white d-flex align-items-center">
                        <i className="fa-solid fa-home"></i>
                        </NavLink>
                    </OverlayTrigger>
                )}
                {isOpen ? (
                    <NavLink to="/planificador-de-actividad" className="nav-link text-white d-flex align-items-center">
                        <i className="fa-solid fa-calendar-alt"></i>
                        <span>Planificador de Actividad</span>
                    </NavLink>
                ) : (
                    <OverlayTrigger placement="right" overlay={renderTooltip('Planificador de Actividad')}>
                        <NavLink to="/planificador-de-actividad" className="nav-link text-white d-flex align-items-center">
                        <i className="fa-solid fa-calendar-alt"></i>
                        </NavLink>
                    </OverlayTrigger>
                )}
                {isOpen ? (
                    <NavLink to="/matriz-de-peligro" className="nav-link text-white d-flex align-items-center">
                        <i className="fa-solid fa-exclamation-triangle"></i>
                        <span>Matriz de Peligro</span>
                    </NavLink>
                ) : (
                    <OverlayTrigger placement="right" overlay={renderTooltip('Matriz de Peligro')}>
                        <NavLink to="/matriz-de-peligro" className="nav-link text-white d-flex align-items-center">
                        <i className="fa-solid fa-exclamation-triangle"></i>
                        </NavLink>
                    </OverlayTrigger>
                )}
                {isOpen ? (
                    <NavLink to="/matriz-legal" className="nav-link text-white d-flex align-items-center">
                        <i className="fa-solid fa-file-alt"></i>
                        <span>Matriz Legal</span>
                    </NavLink>
                ) : (
                    <OverlayTrigger placement="right" overlay={renderTooltip('Matriz Legal')}>
                        <NavLink to="/matriz-legal" className="nav-link text-white d-flex align-items-center">
                        <i className="fa-solid fa-file-alt"></i>
                        </NavLink>
                    </OverlayTrigger>
                )}
                {isOpen ? (
                    <div className="nav-link text-white d-flex align-items-center" onClick={toggleAdminSubmenu}>
                        <i className="fa-solid fa-user-tie"></i>
                        <span>Administración</span>
                        <i className={`ms-auto ${isAdminOpen ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'}`}></i>

                    </div>
                ) : (
                    <OverlayTrigger placement="right" overlay={renderTooltip('Administración')}>
                        <div className="nav-link text-white d-flex align-items-center" onClick={toggleAdminSubmenu}>
                        <i className="fa-solid fa-user-tie"></i>
                        <i className={`ms-auto ${isAdminOpen ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'}`}></i>
                        </div>
                    </OverlayTrigger>
                )}
                {isAdminOpen && (
                    <div className="submenu">
                        {isOpen ? (
                            <NavLink to="/admin/usuarios" className="nav-link text-white d-flex align-items-center">
                                <i className="fa-solid fa-users"></i>
                                <span>Usuarios</span>
                            </NavLink>
                        ) : (
                            <OverlayTrigger placement="right" overlay={renderTooltip('Usuarios')}>
                                <NavLink to="/admin/usuarios" className="nav-link text-white d-flex align-items-center">
                                <i className="fa-solid fa-users"></i>
                                </NavLink>
                            </OverlayTrigger>
                        )}
                        {isOpen ? (
                            <NavLink to="/admin/perfiles" className="nav-link text-white d-flex align-items-center">
                                <i className="fa-solid fa-address-card"></i>
                                <span>Perfiles</span>
                            </NavLink>
                        ) : (
                            <OverlayTrigger placement="right" overlay={renderTooltip('Perfiles')}>
                                <NavLink to="/admin/perfiles" className="nav-link text-white d-flex align-items-center">
                                <i className="fa-solid fa-address-card"></i>
                                </NavLink>
                            </OverlayTrigger>
                        )}
                        {isOpen ? (
                            <NavLink to="/admin/procesos" className="nav-link text-white d-flex align-items-center">
                                <i className="fa-solid fa-list-check"></i>
                                <span>Procesos</span>
                            </NavLink>
                        ) : (
                            <OverlayTrigger placement="right" overlay={renderTooltip('Tareas')}>
                                <NavLink to="/admin/procesos" className="nav-link text-white d-flex align-items-center">
                                <i className="fa-solid fa-list-check"></i>
                                </NavLink>
                            </OverlayTrigger>
                        )}
                        {isOpen ? (
                            <NavLink to="/admin/company" className="nav-link text-white d-flex align-items-center">
                                <i className="fa-solid fa-building"></i>
                                <span>Company</span>
                            </NavLink>
                        ) : (
                            <OverlayTrigger placement="right" overlay={renderTooltip('Company')}>
                                <NavLink to="/admin/company" className="nav-link text-white d-flex align-items-center">
                                <i className="fa-solid fa-building"></i>
                                </NavLink>
                            </OverlayTrigger>
                        )}
                        {isOpen ? (
                            <NavLink to="/admin/actividades" className="nav-link text-white d-flex align-items-center">
                                <i className="fa-solid fa-people-robbery"></i>
                                <span>Actividades</span>
                            </NavLink>
                        ) : (
                            <OverlayTrigger placement="right" overlay={renderTooltip('Actividades')}>
                                <NavLink to="/admin/actividades" className="nav-link text-white d-flex align-items-center">
                                <i className="fa-solid fa-people-robbery"></i>
                                </NavLink>
                            </OverlayTrigger>
                        )}
                        {isOpen ? (
                            <NavLink to="/admin/division" className="nav-link text-white d-flex align-items-center">
                                <i className="fa-solid fa-sitemap"></i>
                                <span>Division</span>
                            </NavLink>
                        ) : (
                            <OverlayTrigger placement="right" overlay={renderTooltip('Division')}>
                                <NavLink to="/admin/division" className="nav-link text-white d-flex align-items-center">
                                <i className="fa-solid fa-sitemap"></i>
                                </NavLink>
                            </OverlayTrigger>
                        )}
                        {isOpen ? (
                            <NavLink to="/admin/peligro" className="nav-link text-white d-flex align-items-center">
                                 <i className="fa-solid fa-circle-radiation"></i>
                                <span>Peligro</span>
                            </NavLink>
                        ) : (
                            <OverlayTrigger placement="right" overlay={renderTooltip('Peligro')}>
                                <NavLink to="/admin/peligro" className="nav-link text-white d-flex align-items-center">
                                <i className="fa-solid fa-circle-radiation"></i>
                                </NavLink>
                            </OverlayTrigger>
                        )}
                        {isOpen ? (
                            <NavLink to="/admin/matriz-de-peligro/riesgos" className="nav-link text-white d-flex align-items-center">
                                <i className="fa-solid fa-circle-exclamation"></i>
                                <span>Riesgos</span>
                            </NavLink>
                        ) : (
                            <OverlayTrigger placement="right" overlay={renderTooltip('Riesgos')}>
                                <NavLink to="/admin/matriz-de-peligro/riesgos" className="nav-link text-white d-flex align-items-center">
                                <i className="fa-solid fa-circle-exclamation"></i>
                                </NavLink>
                            </OverlayTrigger>
                        )}
                        {isOpen ? (
                            <NavLink to="/admin/matriz-de-peligro/criticidad-de-peligro" className="nav-link text-white d-flex align-items-center">
                                 <i className="fa-solid fa-bolt"></i>
                                <span>Criticidad</span>
                            </NavLink>
                        ) : (
                            <OverlayTrigger placement="right" overlay={renderTooltip('Criticidad')}>
                                <NavLink to="/admin/matriz-de-peligro/criticidad-de-peligro" className="nav-link text-white d-flex align-items-center">
                                <i className="fa-solid fa-bolt"></i>
                                </NavLink>
                            </OverlayTrigger>
                        )}
                        {isOpen ? (
                            <NavLink to="/admin/matriz-de-peligro/comprobaciones" className="nav-link text-white d-flex align-items-center">
                                <i className="fa-solid fa-check-circle"></i>
                                <span>Checker</span>
                            </NavLink>
                        ) : (
                            <OverlayTrigger placement="right" overlay={renderTooltip('Checker')}>
                                <NavLink to="/admin/matriz-de-peligro/comprobaciones" className="nav-link text-white d-flex align-items-center">
                                <i className="fa-solid fa-check-circle"></i>
                                </NavLink>
                            </OverlayTrigger>
                        )}
                        {isOpen ? (
                            <NavLink to="/admin/actividad" className="nav-link text-white d-flex align-items-center">
                                <i className="fa-solid fa-chart-line"></i>
                                <span>Actividad</span>
                            </NavLink>
                        ) : (
                            <OverlayTrigger placement="right" overlay={renderTooltip('Actividad')}>
                                <NavLink to="/admin/actividad" className="nav-link text-white d-flex align-items-center">
                                <i className="fa-solid fa-chart-line"></i>
                                </NavLink>
                            </OverlayTrigger>
                        )}
                        {isOpen ? (
                            <NavLink to="/admin/tareas" className="nav-link text-white d-flex align-items-center">
                                <i className="fa-solid fa-bars-progress"></i>
                                <span>Tareas</span>
                            </NavLink>
                        ) : (
                            <OverlayTrigger placement="right" overlay={renderTooltip('Actividad')}>
                                <NavLink to="/admin/tareas" className="nav-link text-white d-flex align-items-center">
                                <i className="fa-solid fa-bars-progress"></i>
                                </NavLink>
                            </OverlayTrigger>
                        )}
                        {isOpen ? (
                            <NavLink to="/admin/empleado" className="nav-link text-white d-flex align-items-center">
                               <i className="fa-solid fa-id-card-clip"></i>
                                <span>Empleados</span>
                            </NavLink>
                        ) : (
                            <OverlayTrigger placement="right" overlay={renderTooltip('Actividad')}>
                                <NavLink to="/admin/empleado" className="nav-link text-white d-flex align-items-center">
                                <i className="fa-solid fa-id-card-clip"></i>
                                </NavLink>
                            </OverlayTrigger>
                        )}
                    </div>
                )}
            </Nav>
            <button onClick={toggleSidebar} className="btn-sidebar">
                <OverlayTrigger placement="right" overlay={ isOpen ? renderTooltip('cerrar') : renderTooltip('abrir')}>
                <i className={`fa-solid ${isOpen ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
                </OverlayTrigger>
            </button>
        </div>
    );
}

export default Menu;
