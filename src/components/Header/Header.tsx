import React, { useState } from 'react';
import { Navbar, Nav, OverlayTrigger, Tooltip, Dropdown } from 'react-bootstrap';
import Swal from 'sweetalert2';
import logo from '../../img/logo-asy.png'; 
import './HeaderStyle.css'; 
import menuDataRoles from '../../Json/menuRoles.json';

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
  const mainMenu = menuDataRoles.find((item: any) => item.menu === "");
  const usuariosRolesMenu = menuDataRoles.find((item: any) => item.menu === "Usuarios");
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

  const renderSubmenu = (submenu: any) => {
    return submenu.map((subItem: any) => (
      <Dropdown.Item key={subItem.id_menu} href={subItem.url} className="newmenu-submenu-item newmenu-link">
        <i className={subItem.icono}></i> {subItem.menu}
      </Dropdown.Item>
    ));
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
            
              {mainMenu && usuariosRolesMenu && (
                <Dropdown className="newmenu-item">
                  <Dropdown.Toggle as={Nav.Link} className="d-flex align-items-center custom-icon newmenu-link1 main-icon">
                   <i className={mainMenu.icono}></i>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="newmenu-submenu">
                    <Dropdown.Item href={usuariosRolesMenu.url} className="newmenu-submenu-item newmenu-link">
                      <i className={usuariosRolesMenu.icono}></i> {usuariosRolesMenu.menu}
                    </Dropdown.Item>
                    {renderSubmenu(usuariosRolesMenu.submenu)}
                  </Dropdown.Menu>
                </Dropdown>
              )}

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