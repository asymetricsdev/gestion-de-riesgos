import { Navbar, Nav } from 'react-bootstrap';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import logo from '../../img/logo-asy.png'; 
import './HeaderStyle.css'; 


interface HeaderProps {
    toggleMenu: () => void;
  }

  export default function Header({ toggleMenu }: HeaderProps){

    const renderLogOutTooltip = (props: React.HTMLAttributes<HTMLDivElement>) => (
      <Tooltip id="button-tooltip-edit" {...props}>
        Cerrar sesión
      </Tooltip>
    );
  
  
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
              <Nav.Link href="#" className="d-flex align-items-center custom-icon">
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
        onClick={toggleMenu}
      >
        <i className="fa-solid fa-bars"></i>
      </button>
      
    </>
  );
}


       



  

