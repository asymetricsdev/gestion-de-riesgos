import React, { useState } from 'react';
import { Nav, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import './MenuStyle.css';

interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}

const Menu: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
    const [isOrgOpen, setIsOrgOpen] = useState(false);
    const [isPlanOpen, setIsPlanOpen] = useState(false);
    const [isMatrizOpen, setIsMatrizOpen] = useState(false);
    
    const toggleOrgSubmenu = () => {
        setIsOrgOpen(!isOrgOpen);
    };

    const togglePlanSubmenu = () => {
        setIsPlanOpen(!isPlanOpen);
    };

    const toggleMatrizSubmenu = () => {
        setIsMatrizOpen(!isMatrizOpen);
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
                    <div className="nav-link text-white d-flex align-items-center" onClick={togglePlanSubmenu}>
                        <i className="fa-solid fa-business-time"></i>
                        <span>Planificación</span>
                        <i className={`ms-auto ${isPlanOpen ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'}`}></i>

                    </div>
                ) : (
                    <OverlayTrigger placement="right" overlay={renderTooltip('Planificación')}>
                        <div className="nav-link text-white d-flex align-items-center" onClick={togglePlanSubmenu}>
                        <i className="fa-solid fa-business-time"></i>
                        <i className={`ms-auto ${isPlanOpen ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'}`}></i>
                        </div>
                    </OverlayTrigger>
                )}
                    {isPlanOpen && (
                    <div className="submenu">
                        {isOpen ? (
                            <NavLink to="/planificacion/planificador-de-actividad" className="nav-link text-white d-flex align-items-center">
                                 <i className="fa-solid fa-calendar-alt"></i>
                                <span>Planificador de Actividad</span>
                            </NavLink>
                        ) : (
                            <OverlayTrigger placement="right" overlay={renderTooltip('PlanificadorActividad')}>
                                <NavLink to="/planificacion/planificador-de-actividad" className="nav-link text-white d-flex align-items-center">
                                <i className="fa-solid fa-calendar-alt"></i>
                                </NavLink>
                            </OverlayTrigger>
                        )}
                        {isOpen ? (
                            <NavLink to="/planificacion/checkpoint" className="nav-link text-white d-flex align-items-center">
                                <i className="fa-solid fa-list-check"></i>
                                <span>Items</span>
                            </NavLink>
                        ) : (
                            <OverlayTrigger placement="right" overlay={renderTooltip('Checkpoint')}>
                                <NavLink to="/planificacion/checkpoint" className="nav-link text-white d-flex align-items-center">
                                <i className="fa-solid fa-list-check"></i>
                                </NavLink>
                            </OverlayTrigger>
                        )}
                        {isOpen ? (
                            <NavLink to="/planificacion/perfiles" className="nav-link text-white d-flex align-items-center">
                                <i className="fa-solid fa-id-badge"></i>
                                <span>Perfiles</span>
                            </NavLink>
                        ) : (
                            <OverlayTrigger placement="right" overlay={renderTooltip('Perfiles')}>
                                <NavLink to="/planificacion/perfiles" className="nav-link text-white d-flex align-items-center">
                                <i className="fa-solid fa-id-badge"></i>
                                </NavLink>
                            </OverlayTrigger>
                        )}
                        {isOpen ? (
                            <NavLink to="/planificacion/tareas" className="nav-link text-white d-flex align-items-center">
                                <i className="fa-solid fa-bars-progress"></i>
                                <span>Tareas</span>
                            </NavLink>
                        ) : (
                            <OverlayTrigger placement="right" overlay={renderTooltip('Tareas')}>
                                <NavLink to="/planificacion/tareas" className="nav-link text-white d-flex align-items-center">
                                <i className="fa-solid fa-bars-progress"></i>
                                </NavLink>
                            </OverlayTrigger>
                        )}
                        {isOpen ? (
                            <NavLink to="/planificacion/tipos-de-tareas" className="nav-link text-white d-flex align-items-center">
                                <i className="fa-solid fa-list-check"></i>
                                <span>Tipos de Tareas</span>
                            </NavLink>
                        ) : (
                            <OverlayTrigger placement="right" overlay={renderTooltip('TiposDeTareas')}>
                                <NavLink to="/planificacion/tipos-de-tareas" className="nav-link text-white d-flex align-items-center">
                                <i className="fa-solid fa-list-check"></i>
                                </NavLink>
                            </OverlayTrigger>
                        )}

                    </div>
                    )}
        

                    {isOpen ? (
                    <div className="nav-link text-white d-flex align-items-center" onClick={toggleMatrizSubmenu}>
                        <i className="fa-solid fa-exclamation-triangle"></i>
                        <span>Matriz de Peligro</span>
                        <i className={`ms-auto ${isMatrizOpen ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'}`}></i>

                    </div>
                ) : (
                    <OverlayTrigger placement="right" overlay={renderTooltip('Matriz de Peligro')}>
                        <div className="nav-link text-white d-flex align-items-center" onClick={toggleMatrizSubmenu}>
                        <i className="fa-solid fa-exclamation-triangle"></i>
                        <i className={`ms-auto ${isMatrizOpen ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'}`}></i>
                        </div>
                    </OverlayTrigger>
                )}
                    {isMatrizOpen && (
                    <div className="submenu">
                        {isOpen ? (
                            <NavLink to="/matriz-de-peligro/actividad" className="nav-link text-white d-flex align-items-center">
                                <i className="fa-solid fa-chart-line"></i>
                                <span>Actividad</span>
                            </NavLink>
                        ) : (
                            <OverlayTrigger placement="right" overlay={renderTooltip('Actividad')}>
                                <NavLink to="/matriz-de-peligro/actividad" className="nav-link text-white d-flex align-items-center">
                                <i className="fa-solid fa-chart-line"></i>
                                </NavLink>
                            </OverlayTrigger>
                        )}
                        {isOpen ? (
                            <NavLink to="/matriz-de-peligro/actividades" className="nav-link text-white d-flex align-items-center">
                                <i className="fa-solid fa-people-robbery"></i>
                                <span>Actividades</span>
                            </NavLink>
                        ) : (
                            <OverlayTrigger placement="right" overlay={renderTooltip('Actividades')}>
                                <NavLink to="/matriz-de-peligro/actividades" className="nav-link text-white d-flex align-items-center">
                                <i className="fa-solid fa-people-robbery"></i>
                                </NavLink>
                            </OverlayTrigger>
                        )}
                        {isOpen ? (
                            <NavLink to="/matriz-de-peligro/criticidad-de-peligro" className="nav-link text-white d-flex align-items-center">
                                <i className="fa-solid fa-bolt"></i>
                                <span>Criticidad</span>
                            </NavLink>
                        ) : (
                            <OverlayTrigger placement="right" overlay={renderTooltip('Criticidad')}>
                                <NavLink to="/matriz-de-peligro/criticidad-de-peligro" className="nav-link text-white d-flex align-items-center">
                                <i className="fa-solid fa-bolt"></i>
                                </NavLink>
                            </OverlayTrigger>
                        )}
                        {isOpen ? (
                            <NavLink to="/matriz-de-peligro/jerarquia-de-control" className="nav-link text-white d-flex align-items-center">
                                <i className="fa-solid fa-check-circle"></i>
                                <span>Jerarquía de Control</span>
                            </NavLink>
                        ) : (
                            <OverlayTrigger placement="right" overlay={renderTooltip('Comprobaciones')}>
                                <NavLink to="/matriz-de-peligro/jerarquia-de-control" className="nav-link text-white d-flex align-items-center">
                                <i className="fa-solid fa-check-circle"></i>
                                </NavLink>
                            </OverlayTrigger>
                        )}
                         {isOpen ? (
                            <NavLink to="/matriz-de-peligro/verificadores" className="nav-link text-white d-flex align-items-center">
                                <i className="fa-solid fa-rectangle-list"></i>
                                <span>Verificadores</span>
                            </NavLink>
                        ) : (
                            <OverlayTrigger placement="right" overlay={renderTooltip('Verificadores')}>
                                <NavLink to="/matriz-de-peligro/verificadores" className="nav-link text-white d-flex align-items-center">
                                <i className="fa-solid fa-rectangle-list"></i>
                                </NavLink>
                            </OverlayTrigger>
                        )} 
                        {isOpen ? (
                    <NavLink to="/matriz-de-peligro/peligro" className="nav-link text-white d-flex align-items-center">
                        <i className="fa-solid fa-circle-radiation"></i>
                        <span>Peligros</span>
                    </NavLink>
                ) : (
                    <OverlayTrigger placement="right" overlay={renderTooltip('Peligro')}>
                        <NavLink to="/matriz-de-peligro/peligro" className="nav-link text-white d-flex align-items-center">
                        <i className="fa-solid fa-circle-radiation"></i>
                        </NavLink>
                    </OverlayTrigger>
                )}
                    {isOpen ? (
                    <NavLink to="/matriz-de-peligro/matriz-peligro" className="nav-link text-white d-flex align-items-center">
                         <i className="fa-solid fa-exclamation-triangle"></i>
                        <span>Matriz de Peligro</span>
                    </NavLink>
                ) : (
                    <OverlayTrigger placement="right" overlay={renderTooltip('Matriz')}>
                        <NavLink to="/matriz-de-peligro/matriz-peligro" className="nav-link text-white d-flex align-items-center">
                        <i className="fa-solid fa-exclamation-triangle"></i>
                        </NavLink>
                    </OverlayTrigger>
                )}
                    {isOpen ? (
                    <NavLink to="/matriz-de-peligro/riesgos" className="nav-link text-white d-flex align-items-center">
                        <i className="fa-solid fa-circle-exclamation"></i>
                        <span>Riesgos</span>
                    </NavLink>
                ) : (
                    <OverlayTrigger placement="right" overlay={renderTooltip('Riesgos')}>
                        <NavLink to="/matriz-de-peligro/riesgos" className="nav-link text-white d-flex align-items-center">
                        <i className="fa-solid fa-circle-exclamation"></i>
                    </NavLink>
                    </OverlayTrigger>
                        )}
                </div>
                )}
                {isOpen ? (
                    <div className="nav-link text-white d-flex align-items-center" onClick={toggleOrgSubmenu}>
                        <i className="fa-solid fa-layer-group"></i>
                        <span>Organización</span>
                        <i className={`ms-auto ${isOrgOpen ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'}`}></i>

                    </div>
                ) : (
                    <OverlayTrigger placement="right" overlay={renderTooltip('Administración')}>
                        <div className="nav-link text-white d-flex align-items-center" onClick={toggleOrgSubmenu}>
                        <i className="fa-solid fa-layer-group"></i>
                        <i className={`ms-auto ${isOrgOpen ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'}`}></i>
                        </div>
                    </OverlayTrigger>
                )}

                {isOrgOpen && (
                    <div className="submenu">
                        {isOpen ? (
                            <NavLink to="/organizacion/ciudad" className="nav-link text-white d-flex align-items-center">
                                <i className="fa-solid fa-tree-city"></i>
                                <span>Ciudad</span>
                            </NavLink>
                        ) : (
                            <OverlayTrigger placement="right" overlay={renderTooltip('Ciudad')}>
                                <NavLink to="/organizacion/ciudad" className="nav-link text-white d-flex align-items-center">
                                <i className="fa-solid fa-tree-city"></i>
                                </NavLink>
                            </OverlayTrigger>
                        )}
                        {isOpen ? (
                            <NavLink to="/organizacion/compañia" className="nav-link text-white d-flex align-items-center">
                                <i className="fa-solid fa-building"></i>
                                <span>Compañias</span>
                            </NavLink>
                        ) : (
                            <OverlayTrigger placement="right" overlay={renderTooltip('Compañia')}>
                                <NavLink to="/organizacion/compañia" className="nav-link text-white d-flex align-items-center">
                                <i className="fa-solid fa-building"></i>
                                </NavLink>
                            </OverlayTrigger>
                        )}
                        {isOpen ? (
                            <NavLink to="/organizacion/division" className="nav-link text-white d-flex align-items-center">
                                <i className="fa-solid fa-sitemap"></i>
                                <span>Áreas</span>
                            </NavLink>
                        ) : (
                            <OverlayTrigger placement="right" overlay={renderTooltip('Division')}>
                                <NavLink to="/organizacion/division" className="nav-link text-white d-flex align-items-center">
                                <i className="fa-solid fa-sitemap"></i>
                                </NavLink>
                            </OverlayTrigger>
                        )}
                        {isOpen ? (

                            <NavLink to="/organizacion/empleados" className="nav-link text-white d-flex align-items-center">
                               <i className="fa-solid fa-id-card-clip"></i>
                                <span>Colaboradores</span>
                            </NavLink>
                        ) : (
                            <OverlayTrigger placement="right" overlay={renderTooltip('Empleados')}>
                                <NavLink to="/organizacion/empleados" className="nav-link text-white d-flex align-items-center">
                                <i className="fa-solid fa-id-card-clip"></i>
                                </NavLink>
                            </OverlayTrigger>
                        )} 
                        {isOpen ? (
                            <NavLink to="/organizacion/posicion" className="nav-link text-white d-flex align-items-center">
                                <i className="fa-solid fa-address-card"></i>
                                <span>Cargos</span>
                            </NavLink>
                        ) : (
                            <OverlayTrigger placement="right" overlay={renderTooltip('Posición')}>
                                <NavLink to="/organizacion/posicion" className="nav-link text-white d-flex align-items-center">
                                <i className="fa-solid fa-address-card"></i>
                                </NavLink>
                            </OverlayTrigger>
                        )}
                        {isOpen ? (
                            <NavLink to="/organizacion/procesos" className="nav-link text-white d-flex align-items-center">
                                <i className="fa-solid fa-list-check"></i>
                                <span>Procesos</span>
                            </NavLink>
                        ) : (
                            <OverlayTrigger placement="right" overlay={renderTooltip('Procesos')}>
                                <NavLink to="/organizacion/procesos" className="nav-link text-white d-flex align-items-center">
                                <i className="fa-solid fa-list-check"></i>
                                </NavLink>
                            </OverlayTrigger>
                        )}
                       {/*  {isOpen ? (
                            <NavLink to="/organizacion/usuarios" className="nav-link text-white d-flex align-items-center">
                                <i className="fa-solid fa-users"></i>
                                <span>Usuarios</span>
                            </NavLink>
                        ) : (
                            <OverlayTrigger placement="right" overlay={renderTooltip('Usuarios')}>
                                <NavLink to="/organizacion/usuarios" className="nav-link text-white d-flex align-items-center">
                                <i className="fa-solid fa-users"></i>
                                </NavLink>
                            </OverlayTrigger>
                        )} */}
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
};

export default Menu;
