import React, { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { showAlert } from "../functions";
import DangerHead from "../DangerHead/DangerHead";
import { OverlayTrigger, Tooltip } from "react-bootstrap"; // Importa los componentes de react-bootstrap
import "./DangerTableStyle.css";

interface Danger {
  id: string;
  processId: string;
  process: string;
  activityId: string;
  activity: string;
  activityTypeId: string;
  activityType: string;
  hazzardId: string;
  hazzard: string;
  risk: string;
  criticityName: string;
  criticityDescription: string;
  securityMeasures: string;
  checker: string;
  checkerType: string;
}

const Danger: React.FC = () => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const URL = "https://asymetricsbackend.uk.r.appspot.com/matrix/hazzard";
  const [danger, setDanger] = useState<Danger[]>([]);

  useEffect(() => {
    const getDangers = async () => {
      try {
        const response: AxiosResponse<Danger[]> = await axios.get(URL);
        setDanger(response.data);
      } catch (error) {
        showAlert("Error al obtener Peligro", "error");
      }
    };
    getDangers();
  }, []);

  const toggleRowExpansion = (id: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const formatSecurityMeasures = (measures: string) => {
    return measures
      .toLowerCase()
      .split(".")
      .map((measure, index) => (
        <React.Fragment key={index}>
          {measure.trim() && (
            <>
              {measure.trim()}.<br />
            </>
          )}
        </React.Fragment>
      ));
  };

  return (
    <div className="container-fluid">
      <div className="row mt-3">
        <div className="col-12">
          <div className="tabla-contenedor">
            <DangerHead title="Matriz de Peligro" />
          </div>
          <div className="table-responsive-xl">
            <table className="table table-bordered">
              <thead
                className="text-center"
                style={{
                  background: "linear-gradient(90deg, #009FE3 0%, #00CFFF 100%)",
                  color: "#fff",
                }}
              >
                <tr>
                  <th>Proceso</th>
                  <th>Actividad</th>
                  <th>Tipo de Actividad</th>
                  <th>Peligro</th>
                  <th>Riesgo</th>
                  <th>Criticidad</th>
                  <th>Nivel de Criticidad</th>
                  <th>Medidas Preventivas</th>
                  <th>Verificador de Control</th>
                  <th>Jerarquía de Control</th>
                </tr>
              </thead>
              <tbody className="table-group-divider">
                {danger.map((item, i) => (
                  <tr key={item.activityId} className="align-text-left">
                    <td>{item.process}</td>
                    <td>
                      {item.activity.charAt(0).toUpperCase() + item.activity.slice(1).toLowerCase()}
                    </td>
                    <td>
                      {item.activityType.charAt(0).toUpperCase() +
                        item.activityType.slice(1).toLowerCase()}
                    </td>
                    <td>
                      {item.hazzard.charAt(0).toUpperCase() + item.hazzard.slice(1).toLowerCase()}
                    </td>
                    <td>{item.risk}</td>
                    <td>{item.criticityName}</td>
                    <td>{item.criticityDescription}</td>
                    <td
                      onClick={() => toggleRowExpansion(item.activityId)}
                      style={{
                        textAlign: "left",
                        maxWidth: "150px",
                        whiteSpace: expandedRows.has(item.activityId) ? "normal" : "nowrap",
                        overflow: expandedRows.has(item.activityId) ? "visible" : "hidden",
                        textOverflow: expandedRows.has(item.activityId) ? "clip" : "ellipsis",
                        cursor: "pointer",
                      }}
                    >
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip id={`tooltip-${item.activityId}`} className="custom-tooltip">
                            {item.securityMeasures}
                          </Tooltip>
                        }
                      >
                        <span>
                          {expandedRows.has(item.activityId)
                            ? formatSecurityMeasures(item.securityMeasures)
                            : item.securityMeasures.substring(0, 20).toLowerCase() + "..."}
                        </span>
                      </OverlayTrigger>
                    </td>
                    <td>{item.checker}</td>
                    <td>{item.checkerType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Danger;
