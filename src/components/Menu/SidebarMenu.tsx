import React, { useEffect, useState } from 'react';
import { NavLink } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import menuData from '../../Json/menuData.json';
import './SidebarMenu.css';

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
  const [openMenus, setOpenMenus] = useState<{ [key: number]: boolean }>({});

  const toggleSubmenu = (menuId: number) => {
    setOpenMenus((prevOpenMenus) => ({
      ...prevOpenMenus,
      [menuId]: !prevOpenMenus[menuId],
    }));
  };

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
              <div className="d-flex align-items-center nav-link" onClick={() => toggleSubmenu(item.id_menu)}>
                <NavLink to={item.url} className="d-flex align-items-center">
                  <i className={item.icono}></i> {isOpen && <span>{item.menu}</span>}
                </NavLink>
                {item.submenu.length > 0 && (
                  <i className={`ms-auto ${openMenus[item.id_menu] ? "fa-chevron-up" : "fa-chevron-down"} ${item.icono_arrow}`} onClick={() => toggleSubmenu(item.id_menu)}></i>
                )}
              </div>

              {/* Submenu */}
              {item.submenu.length > 0 && openMenus[item.id_menu] && (
                <ul className={`submenu ${isOpen ? "submenu-open" : ""}`}>
                  {item.submenu.map((subItem) => (
                    <li key={subItem.id_menu} className="submenu-item">
                      <NavLink to={subItem.url} className="nav-link d-flex align-items-center">
                        <i className={subItem.icono}></i> {isOpen && <span>{subItem.menu}</span>}
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
