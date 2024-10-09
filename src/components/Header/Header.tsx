import { faBars, faBell, faInfoCircle, faQuestionCircle, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Nav, Navbar } from 'react-bootstrap';
import logo from '../../img/logo-asy.png';
import './HeaderStyle.css';


interface HeaderProps {
    toggleMenu: () => void;
  }

  export default function Header({ toggleMenu }: HeaderProps){
  
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
                <FontAwesomeIcon icon={faInfoCircle} />
              </Nav.Link>
              <Nav.Link href="#" className="d-flex align-items-center custom-icon">
                <FontAwesomeIcon icon={faQuestionCircle} />
              </Nav.Link>
              <Nav.Link href="#" className="d-flex align-items-center custom-icon">
                <FontAwesomeIcon icon={faBell} />
              </Nav.Link>
              <Nav.Link href="#" className="d-flex align-items-center custom-icon">
                <FontAwesomeIcon icon={faUserCircle} />
              </Nav.Link>
              <Nav.Link href="#" className="d-flex align-items-center">
                Version: 08.OCT.2024T23:15
              </Nav.Link>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <button 
        className="navbar-toggler always-visible custom-button" 
        type="button" 
        onClick={toggleMenu}
      >
        <FontAwesomeIcon icon={faBars} />
      </button>
      
    </>
  );
}


       



  

