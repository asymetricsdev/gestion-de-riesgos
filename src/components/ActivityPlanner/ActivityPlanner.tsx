import React from 'react';
import './ActivityPlannerStyle.css'; 

export default function ActivityPlanner() {
  return (
    <div className="container-fluid">
      <nav className="navbar navbar-expand-lg navbar-light custom-margin full-width" style={{backgroundColor: '#e3f2fd'}}>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <a className="nav-link" href="#">Actividades Actuales <span className="sr-only">(current)</span></a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Tablero</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Verificaciones</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">CH-PTS</a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  )
}
