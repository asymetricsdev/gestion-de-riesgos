
import React, { useEffect, useState } from 'react';
import { NavLink } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import menuData from '../../Json/menuData.json';
import './SidebarMenu.css';

// Define los tipos
interface Submenu {
  menu: string;
  id_menu: number;
  url: string;
  icono: string;
  icono_arrow?: string;
  indicador: string;
  submenu: Submenu[];
}

interface MenuItem {
  menu: string;
  id_menu: number;
  url: string;
  icono: string;
  icono_arrow: string;
  icono_arrow_left?: string;
  indicador: string;
  submenu: Submenu[];
}

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  isLoggedIn: boolean;
}


const renderTooltip = (text: string) => <Tooltip id="button-tooltip">{text}</Tooltip>;

const SidebarMenu: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, isLoggedIn }) => {
  const [isOrgOpen, setIsOrgOpen] = useState(false);
  const [isPlanOpen, setIsPlanOpen] = useState(false);
  const [isMatrizOpen, setIsMatrizOpen] = useState(false);
  const [isVerificacionOpen, setIsVerificacionOpen] = useState(false);
  const [isActividadesOpen, setIsActividadesOpen] = useState(false);
  const [isConfiguracionMatrizOpen, setIsConfiguracionMatrizOpen] = useState(false);

  const toggleOrgSubmenu = () => setIsOrgOpen(!isOrgOpen);
  const togglePlanSubmenu = () => setIsPlanOpen(!isPlanOpen);
  const toggleMatrizSubmenu = () => setIsMatrizOpen(!isMatrizOpen);
  const toggleVerificacionSubmenu = () => setIsVerificacionOpen(!isVerificacionOpen);
  const toggleActividadesSubmenu = () => setIsActividadesOpen(!isActividadesOpen);
  const toggleConfiguracionMatrizSubmenu = () => setIsConfiguracionMatrizOpen(!isConfiguracionMatrizOpen);

  const [data, setData] = useState<MenuItem[]>([]);

  useEffect(() => {
    setData(menuData);

  }, []);

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <nav>
        <ul className="menu flex-column">
          {data.map((item) => (
            <li key={item.id_menu} className="menu-item">
              <NavLink to={item.url} className="nav-link d-flex align-items-center">
                <i className={item.icono}></i> {isOpen && <span>{item.menu}</span>}
                {item.icono_arrow && <i className={`ms-auto ${item.icono_arrow}`}></i>}
              </NavLink>
              {item.submenu.length > 0 && (
                <ul className={`submenu ${isOpen ? "submenu-open" : ""}`}>
                  {item.submenu.map((subItem) => (
                    <li key={subItem.id_menu} className="submenu-item">
                      <NavLink to={subItem.url} className="nav-link d-flex align-items-center">
                        <i className={subItem.icono}></i> {isOpen && <span>{subItem.menu}</span>}
                        {subItem.icono_arrow && <i className={`ms-auto ${subItem.icono_arrow}`}></i>}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <button onClick={toggleSidebar} className="btn-sidebar">
        <OverlayTrigger placement="right" overlay={isOpen ? renderTooltip("Cerrar") : renderTooltip("Abrir")}>
          <i className={`fa-solid ${isOpen ? "fa-chevron-left" : "fa-chevron-right"}`}></i>
        </OverlayTrigger>
      </button>
    </div>
  );
};

export default SidebarMenu;





