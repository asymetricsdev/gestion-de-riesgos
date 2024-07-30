// EncabezadoTabla.tsx
import React from "react";
import './EncabezadoTablaStyle.css';
import ActionButton from "../Boton/ActionButton";

interface EncabezadoTablaProps {
  title: string;
  onNewUserClick: () => void;
}

const EncabezadoTabla: React.FC<EncabezadoTablaProps> = ({ title, onNewUserClick }) => {
  return (
    <div className="encabezado-tabla">
      <h2 className="encabezado-titulo">{title}</h2>
      <ActionButton onClick={onNewUserClick} />
    </div>
  );
};

export default EncabezadoTabla;
