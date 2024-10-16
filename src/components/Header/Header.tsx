import React, { useState } from 'react';
import { Nav, Navbar, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Swal from 'sweetalert2';
import logo from '../../img/logo-asy.png';
import './HeaderStyle.css';

interface HeaderProps {
  toggleMenu: () => void;
  handleLogout: () => void; 
}

export default function Header({ toggleMenu, handleLogout }: HeaderProps) {
  const renderLogOutTooltip = (props: React.HTMLAttributes<HTMLDivElement>) => (
    <Tooltip id="button-tooltip-edit" {...props}>
      Cerrar sesión
    </Tooltip>
  );

  const [isLoggedIn, setIsLoggedIn] = useState(true); 


  const handleLogoutClick = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡Vas a cerrar la sesión!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        setIsLoggedIn(false); 
        handleLogout(); 
        Swal.fire('Cerrado', 'Has cerrado la sesión correctamente.', 'success');
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
                Version: 16.OCT.2024T19:20
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

