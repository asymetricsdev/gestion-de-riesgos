
import React, { useState } from 'react';
import { Navbar, Nav, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Swal from 'sweetalert2'; // Asegúrate de que estás usando SweetAlert2
import logo from '../../img/logo-asy.png'; 
import './HeaderStyle.css'; 

interface HeaderProps {
  toggleMenu: () => void;
  handleLogout: () => void; // Función para manejar el cierre de sesión
}

export default function Header({ toggleMenu, handleLogout }: HeaderProps) {
  const renderLogOutTooltip = (props: React.HTMLAttributes<HTMLDivElement>) => (
    <Tooltip id="button-tooltip-edit" {...props}>
      Cerrar sesión
    </Tooltip>
  );

  const [isLoggedIn, setIsLoggedIn] = useState(true); // Inicializado en true porque el usuario está logueado

  // Función para confirmar cierre de sesión
  const handleLogoutClick = () => {
    // Uso de SweetAlert2
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡Vas a cerrar la sesión!',
      icon: 'warning', // El icono de alerta
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        setIsLoggedIn(false); // Cambiar el estado a falso para "cerrar sesión"
        handleLogout(); // Ejecutar la función de cierre de sesión que viene como prop
        Swal.fire('Cerrado', 'Has cerrado la sesión correctamente.', 'success'); // Mostrar alerta de confirmación
      }
    });
  };

  return (
    <>
      <Navbar bg="light" className="px-3 border border-primary border-2">
        <Navbar.Brand href="#">
          <img
            src={logo}
            alt="ASYMETRICS"
            style={{ width: '18%', height: 'auto' }} 
          />
        </Navbar.Brand>
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="align-items-center">
            <div className="header-container">
              <Nav.Link href="#" className="d-flex align-items-center custom-icon">
                <i className="fa-solid fa-circle-info"></i>
              </Nav.Link>
              <Nav.Link href="#" className="d-flex align-items-center custom-icon">
                <i className="fa-solid fa-circle-question"></i>
              </Nav.Link>
              <Nav.Link href="#" className="d-flex align-items-center custom-icon">
                <i className="fa-solid fa-bell"></i>
              </Nav.Link>
              <Nav.Link href="#" className="d-flex align-items-center custom-icon">
                <i className="fa-solid fa-circle-user"></i>
              </Nav.Link>
              <Nav.Link href="#" className="d-flex align-items-center">
                Bienvenido Felipe Martínez
              </Nav.Link>
              <OverlayTrigger placement="bottom" overlay={renderLogOutTooltip({})}>
                <Nav.Link href="#" className="d-flex align-items-center custom-icon" onClick={handleLogoutClick}>
                  <i className="fa-solid fa-arrow-right-from-bracket"></i>
                </Nav.Link>
              </OverlayTrigger>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <button 
        className="navbar-toggler always-visible custom-button" 
        type="button" 
        onClick={toggleMenu}>
        <i className="fa-solid fa-bars"></i>
      </button>
    </>
  );
};
