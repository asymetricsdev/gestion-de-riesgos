import React, { useEffect, useState } from 'react';
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import menuData from '../../Json/menuApp.json';
import './SidebarMenu.css';

interface Submenu {
  menu: string;
  id_menu: number;
  url: string;
  icono: string;
  icono_arrow?: string;
  icono_arrow_left?: string;
  indicador: string;
}

interface MenuItem {
  menu: string;
  id_menu: number;
  url: string;
  icono: string;
  icono_arrow?: string;
  icono_arrow_left?: string;
  indicador: string;
  submenu: Submenu[];
}

interface RoleMenu {
  rol: string;
  menu: MenuItem[];
}

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const renderTooltip = (text: string) => <Tooltip id="button-tooltip">{text}</Tooltip>;

const SidebarMenu: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const [openMenus, setOpenMenus] = useState<{ [key: number]: boolean }>({});
  const [data, setData] = useState<MenuItem[]>([]);

  const userRole = sessionStorage.getItem('userRole') || "ROLE_DEFAULT";

  useEffect(() => {
    const roleMenu = (menuData as RoleMenu[]).find(role => role.rol === userRole);
    
    if (roleMenu && Array.isArray(roleMenu.menu)) {
      setData(roleMenu.menu);
    } else {

      console.error(`Menu no encontrado por role: ${userRole}`);
      setData([]); 
    }
  }, [userRole]);

  useEffect(() => {
    const initialMenuState = data.reduce((acc: { [key: number]: boolean }, item: MenuItem) => {
      acc[item.id_menu] = false;
      return acc;
    }, {});
    setOpenMenus(initialMenuState);
  }, [data]);

  const toggleMenu = (menuId: number) => {
    setOpenMenus((prevOpenMenus) => ({
      ...prevOpenMenus,
      [menuId]: !prevOpenMenus[menuId],
    }));
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <nav>
        <ul className="menu flex-column">
          {data.length > 0 ? (
            data.map((item) => (
              <li key={item.id_menu} className="menu-item">
                <div className="d-flex align-items-center nav-link" onClick={() => toggleMenu(item.id_menu)}>
                  <NavLink to={item.url || "#"} className="d-flex align-items-center">
                    <i className={item.icono}></i> {isOpen && <span>{item.menu}</span>}
                  </NavLink>
                </div>

                {/* Si hay submenús, mostrarlos */}
                {item.submenu.length > 0 && openMenus[item.id_menu] && (
                  <ul className="submenu">
                    {item.submenu.map((subitem) => (
                      <li key={subitem.id_menu} className="submenu-item">
                        <NavLink to={subitem.url || "#"} className="nav-link">
                          <i className={subitem.icono}></i> {subitem.menu}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))
          ) : (
            <li className="menu-item text-danger">No se encontró menú para este rol</li>
          )}
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
