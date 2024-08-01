import React from 'react';
import './InfoCardStyle.css';

interface InfoCardProps {
  name: string;
  rut: string;
  program: string;
  numberOfPeople: number;
}

const InfoCard: React.FC<InfoCardProps> = ({ name, rut, program, numberOfPeople }) => {
  return (
    <div className="info-card-container">
      <div className="info-card">
        <p><strong>Programa:</strong> {name}</p>
        <p><strong>RUT:</strong> {rut}</p>
        <p><strong>Programa:</strong> {program}</p>
        <p><strong>N° de Personas a Cargo:</strong> {numberOfPeople}</p>
      </div>
    </div>
  );
}

export default InfoCard;
