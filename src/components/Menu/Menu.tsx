import React, { useState } from 'react';
import { Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faExclamationTriangle, faCalendarAlt, faFileAlt, faChevronDown, faChevronUp, faUsers, faAddressCard, faListCheck, faUserTie, faBuilding } from '@fortawesome/free-solid-svg-icons';
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

  return (
    <div className={`sidebar bg-dark text-white vh-100 ${isOpen ? 'open' : ''}`}>
      <Nav defaultActiveKey="/home" className="flex-column">
        <NavLink to="/home" className="nav-link text-white d-flex align-items-center">
          <FontAwesomeIcon icon={faHome} className="me-2" />
          <span>Home</span>
        </NavLink>
        <NavLink to="/matriz-de-peligro" className="nav-link text-white d-flex align-items-center">
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
          <span>Matriz de Peligro</span>
        </NavLink>
        <NavLink to="/planificador-de-actividad" className="nav-link text-white d-flex align-items-center">
          <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
          <span>Planificador de Actividad</span>
        </NavLink>
        <NavLink to="/matriz-legal" className="nav-link text-white d-flex align-items-center">
          <FontAwesomeIcon icon={faFileAlt} className="me-2" />
          <span>Matriz Legal</span>
        </NavLink>
        <div className="nav-link text-white d-flex align-items-center" onClick={toggleAdminSubmenu}>
          <FontAwesomeIcon icon={ faUserTie } className="me-2" />
          <span>Administración</span>
          <FontAwesomeIcon icon={isAdminOpen ? faChevronUp : faChevronDown} className="ms-auto" />
        </div>
        {isAdminOpen && (
          <div className="submenu">
            <NavLink to="/admin/usuarios" className="nav-link text-white d-flex align-items-center">
              <FontAwesomeIcon icon={faUsers} className="me-2" />
              {isOpen && <span>Usuarios</span>}
            </NavLink>
            <NavLink to="/admin/perfiles" className="nav-link text-white d-flex align-items-center">
              <FontAwesomeIcon icon={faAddressCard} className="me-2" />
              {isOpen && <span>Perfiles</span>}
            </NavLink>
            <NavLink to="/admin/tareas" className="nav-link text-white d-flex align-items-center">
              <FontAwesomeIcon icon={faListCheck} className="me-2" />
              {isOpen && <span>Tareas</span>}
            </NavLink>
            <NavLink to="/admin/company" className="nav-link text-white d-flex align-items-center">
              <FontAwesomeIcon icon={faBuilding} className="me-2" />
              {isOpen && <span>Company</span>}
            </NavLink>
          </div>
        )}
      </Nav>
      <button onClick={toggleSidebar} className="btn btn-toggle-sidebar">
        {isOpen ? 'Cerrar' : 'Abrir'}
      </button>
    </div>
  );
};

export default Menu;
