import React from 'react';
import './ActivitiesTableStyle.css'; 
import TableHeaderComponent from '../TableHeader/TableHeader';
import CardActivities from '../CardActivities/CardActivities';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';


interface TableHeaderProps {
  title: string;
}

const renderVeriTooltip = (props: React.HTMLAttributes<HTMLDivElement>) => (
  <Tooltip id="button-tooltip-verifications" {...props}>
    Verificaciones
  </Tooltip>
  );

const renderProcTooltip = (props: React.HTMLAttributes<HTMLDivElement>) => (
    <Tooltip id="button-tooltip-verifications" {...props}>
      Procedimientos
    </Tooltip>
  );

  const renderCapTooltip = (props: React.HTMLAttributes<HTMLDivElement>) => (
      <Tooltip id="button-tooltip-verifications" {...props}>
        Capacitación Factor Humano
      </Tooltip>
  );

export const ActivitiesTable: React.FC<TableHeaderProps> = ({ title }: TableHeaderProps ) => {
  return (
    <div className="table-container">
      <div className="tabla-contenedor-header">
      <TableHeaderComponent title='Planificación de Actividades' />
      </div>
      <div className="table-responsives">
        <table id="tableta" className="table table-bordered">
          <thead className="text-center">
            <tr>
              <th>Actividades</th>
              <th>Enero</th>
              <th>Febrero</th>
              <th>Marzo</th>
              <th>Abril</th>
              <th>Mayo</th>
              <th>Junio</th>
              <th>Julio</th>
              <th>Agosto</th>
              <th>Septiembre</th>
              <th>Octubre</th>
              <th>Noviembre</th>
              <th>Diciembre</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            <tr className="text-center">
              <OverlayTrigger placement="top" overlay={renderVeriTooltip}>
              <td style={{ backgroundColor: '#f25252', color: '#fff' }}>VE44</td>
              </OverlayTrigger>
              <td>0%</td>
              <td>0%</td>
              <td>0%</td>
              <td>0%</td>
              <td>0%</td>
              <td>0%</td>
              <td>0%</td>
              <td>Programado</td>
              <td>Programado</td>
              <td>0%</td>
              <td>0%</td>
              <td>0%</td>
            </tr>
            <tr className="text-center">
              <OverlayTrigger placement="top" overlay={renderProcTooltip}>
              <td style={{ backgroundColor: '#4AB37B', color: '#fff' }}>PTS 76/Test</td>
              </OverlayTrigger>
              <td>50%</td>
              <td>50%</td>
              <td>50%</td>
              <td>50%</td>
              <td>50%</td>
              <td>50%</td>
              <td>50%</td>
              <td>Programado</td>
              <td></td>
              <td>50%</td>
              <td>50%</td>
              <td>50%</td>
            </tr>
            <tr className="text-center">
              <OverlayTrigger placement="top" overlay={renderCapTooltip}>
              <td style={{ backgroundColor: '#FFC558', color: '#000' }}>FHO4</td>
              </OverlayTrigger>
              <td>80%</td>
              <td>80%</td>
              <td>80%</td>
              <td>80%</td>
              <td>80%</td>
              <td>80%</td>
              <td>80%</td>
              <td>Programado</td>
              <td></td>
              <td>80%</td>
              <td>80%</td>
              <td>80%</td>
            </tr>
            <tr className="text-center">
              <OverlayTrigger placement="top" overlay={renderVeriTooltip}>
              <td style={{ backgroundColor: 'yellow', color: '#000' }}>VE56</td>
              </OverlayTrigger>
              <td>30%</td>
              <td>30%</td>
              <td>30%</td>
              <td>30%</td>
              <td>30%</td>
              <td>30%</td>
              <td>30%</td>
              <td></td>
              <td>Programado</td>
              <td>30%</td>
              <td>30%</td>
              <td>30%</td>
            </tr>
          </tbody>
        </table>
      </div>
      <CardActivities />
    </div>
  );
} 