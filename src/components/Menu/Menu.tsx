
    import React, { useState, useEffect } from "react";
    import { Tooltip, OverlayTrigger  } from "react-bootstrap";
    import SidebarMenu from "./SidebarMenu";
    import { useAuth } from "../../Context/UserProvider";
    import "./MenuStyle.css";
    
    interface SidebarProps {
      isOpen: boolean;
      toggleSidebar: () => void;
      isLoggedIn: boolean; 
    }
    
    const Menu: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, isLoggedIn }) => { 
      const { role } = useAuth();

      const renderTooltip = (text: string) => <Tooltip id="button-tooltip">{text}</Tooltip>;
      
    
      return (
        <>
          {isLoggedIn && (
            <SidebarMenu 
              isOpen={isOpen} 
              toggleSidebar={toggleSidebar} 
              isLoggedIn={isLoggedIn} 
            />
          )}
        </>
      );
    };
    
    export default Menu;
    




    // import React, { useState, useEffect } from "react";
    // import { Tooltip, OverlayTrigger } from "react-bootstrap";
    // import SidebarMenu from "./SidebarMenu";
    // import { useAuth } from "../../Context/UserProvider"; // Asegúrate de que tienes el contexto para los roles
    // import "./MenuStyle.css";
    
    // interface SidebarProps {
    //   isOpen: boolean;
    //   toggleSidebar: () => void;
    //   isLoggedIn: boolean; 
    // }
    
    // const Menu: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, isLoggedIn }) => {
    //   const { role } = useAuth(); // Utilizamos el rol del usuario
    
    //   const renderTooltip = (text: string) => <Tooltip id="button-tooltip">{text}</Tooltip>;
    
    //   return (
    //     <>
    //       {isLoggedIn && (
    //         <SidebarMenu 
    //           isOpen={isOpen} 
    //           toggleSidebar={toggleSidebar} 
    //           isLoggedIn={isLoggedIn}
    //         >
    //           <ul className="menu-items">
    //             <li>
    //               <OverlayTrigger placement="right" overlay={renderTooltip("Inicio")}>
    //                 <a href="/home" className="menu-link">Inicio</a>
    //               </OverlayTrigger>
    //             </li>
    //             {role === 'admin' && (
    //               <li>
    //                 <OverlayTrigger placement="right" overlay={renderTooltip("Administración")}>
    //                   <a href="/admin" className="menu-link">Administración</a>
    //                 </OverlayTrigger>
    //               </li>
    //             )}
    //             {role === 'user' && (
    //               <li>
    //                 <OverlayTrigger placement="right" overlay={renderTooltip("Dashboard")}>
    //                   <a href="/dashboard" className="menu-link">Dashboard</a>
    //                 </OverlayTrigger>
    //               </li>
    //             )}
    //             {/* Agregar más opciones de menú basadas en el rol */}
    //           </ul>
    //         </SidebarMenu>
    //       )}
    //     </>
    //   );
    // };
    
    // export default Menu;
    
