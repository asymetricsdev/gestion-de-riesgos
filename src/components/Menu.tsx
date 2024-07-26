import { Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faExclamationTriangle, faCalendarAlt, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import './Menu.css';

interface SidebarProps {
  isOpen: boolean;
}

const Menu: React.FC<SidebarProps> = ({ isOpen }) => {
  return (
    <div className={`sidebar bg-dark text-white vh-100 ${isOpen ? 'open' : ''}`}>

      <Nav defaultActiveKey="/home" className="flex-column">
        <Nav.Link  className="text-white d-flex align-items-center">
          <FontAwesomeIcon icon={faHome} className="me-2" />
          <span className={`${isOpen ? 'd-inline' : 'd-none'}`}>Home</span>
        </Nav.Link>
        <Nav.Link  className="text-white d-flex align-items-center">
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
          <span className={`${isOpen ? 'd-inline' : 'd-none'}`}>Matriz de Peligro</span>
        </Nav.Link>
        <Nav.Link  className="text-white d-flex align-items-center">
          <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
          <span className={`${isOpen ? 'd-inline' : 'd-none'}`}>Planificador de Actividad</span>
        </Nav.Link>
        <Nav.Link href="#" className="text-white d-flex align-items-center">
          <FontAwesomeIcon icon={faFileAlt} className="me-2" />
          <span className={`${isOpen ? 'd-inline' : 'd-none'}`}>Matriz Legal</span>
        </Nav.Link>
      </Nav>
      
    </div>
  );
};

export default Menu;
