// types.ts
export interface Submenu {
    menu: string;
    id_menu: number;
    url: string;
    icono: string;
    icono_arrow?: string;
    indicador: string;
    submenu: Submenu[];
  }
  
  export interface MenuItem {
    menu: string;
    id_menu: number;
    url: string;
    icono: string;
    icono_arrow: string;
    icono_arrow_left?: string;
    indicador: string;
    submenu: Submenu[];
  }
  
  export interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
    isLoggedIn: boolean;
  }
  