import React from "react";
import './EncabezadoTabla.css';

interface EncabezadoTablaProps {
  title: string;
}

const EncabezadoTabla: React.FC<EncabezadoTablaProps> = (props) => {
  return (
    <div className="encabezado-tabla">
      <h2>{props.title}</h2>
    </div>
  );
};

export default EncabezadoTabla;


 
