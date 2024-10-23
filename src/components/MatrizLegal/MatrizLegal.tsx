import axios, { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import DangerHead from "../DangerHead/DangerHead";
import { capitalizeFirstLetter, showAlert } from "../functions";
import "./MatrizLegalStyle.css";

interface MatrizPeligro {
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
  criticityColor: string;
  securityMeasures: string;
  checker: string;
  checkerType: string;
  updateDate: string;
}

const MatrizPeligro: React.FC = () => {
  const baseURL = import.meta.env.VITE_API_URL;
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [danger, setDanger] = useState<MatrizPeligro[]>([]);

  useEffect(() => {
    const getDangers = async () => {
      try {
        const response: AxiosResponse<MatrizPeligro[]> = await axios.get(`${baseURL}/matrix/hazzard`);
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
            <DangerHead title="Matriz Legal" />
          </div>
          <div className="table-responsive-xl table-scroll">
            <table className="table table-bordered">
              <thead className="text-center">
                <tr>
                  <th>xxx</th>
                  <th>xxxx</th>
                  <th>xxxxxxxxx</th>
                  <th>xxxxxx</th>
                  <th>xxxx</th>
                  <th>xxxx</th>
                  <th>xxxxxx</th>
                  <th>xxxxx</th>
                  <th>xxxx</th>
                </tr>
              </thead>
              <tbody className="table-group-divider">
                
                  <tr className="align-text-left">
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatrizPeligro;
