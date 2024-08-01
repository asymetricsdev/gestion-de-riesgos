import React from 'react';
import './TableHeaderStyle.css';

interface TableHeaderProps {
  title: string;
}

const TableHeaderComponent: React.FC<TableHeaderProps> = ({ title }) => {
  return (
    <div className="header-table">
      <h2 className="Header-titulo">{title}</h2>
    </div>
  );
};

export default TableHeaderComponent;
