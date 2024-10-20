import React from "react";
import ActionButton from "../Boton/ActionButton";
import './EncabezadoTablaStyle.css';

interface EncabezadoTablaProps {
  title: string;
  onClick: () => void;
}

const EncabezadoTabla: React.FC<EncabezadoTablaProps> = ({ title, onClick }) => {
  return (
    <div className="encabezado-tabla">
      <h2 className="encabezado-titulo">{title}</h2>
      <ActionButton onClick={onClick} />
    </div>
  );
};

export default EncabezadoTabla;
