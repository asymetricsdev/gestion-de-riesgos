    import React, { useState, useEffect } from "react";
    import { Tooltip } from "react-bootstrap";
    import SidebarMenu from "./SidebarMenu";
    import "./MenuStyle.css";
    
    interface SidebarProps {
      isOpen: boolean;
      toggleSidebar: () => void;
      isLoggedIn: boolean; 
    }
    
    const Menu: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, isLoggedIn }) => { 
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
    




