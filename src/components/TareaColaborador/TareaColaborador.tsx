import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios, { AxiosResponse } from "axios";
import { showAlert } from '../functions';
import { OverlayTrigger, Tooltip, Breadcrumb, Spinner } from "react-bootstrap";
import DangerHead from "../DangerHead/DangerHead";
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import "./TareaColaborador.css";

interface Planning {
  startDate: string;
  endDate: string;
}

interface Checkpoint {
  checkpointId: number;
  checkpointName: string;
}

interface Task {
  taskId: number;
  taskName: string;
  taskDescription: string;
  checkerDescription: string;
  plannings: Planning[];
  checkpoints: Checkpoint[];
}

interface Colaboradores {
  id: number;
  name: string;
  rut: string;
  position: {
    name: string;
  };
}


const TareaColaborador: React.FC = () => {
  const baseURL = import.meta.env.VITE_API_URL;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [colaboradores, setColaboradores] = useState<Colaboradores | null>(null);
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(false); 
  const [pendingRequests, setPendingRequests] = useState<number>(0);
  
console.log("Colaborador ID:", id); 

useEffect(() => {
  getColaboradorTasks();
  getColaboradorData();
}, [id]);

  const getColaboradorTasks = async () => {
    setPendingRequests(prev => prev + 1);
    try {
      const response: AxiosResponse<Task[]> = await axios.get(`${baseURL}/employee/${id}/task_list`);
      console.log(response.data); 
      setTasks(response.data);
    } catch (error) {
      showAlert("Error al obtener las tareas del colaborador", "error");
    } finally {
      setPendingRequests(prev => prev - 1);  // Disminuir contador
    }
  };
  

  const getColaboradorData = async () => {
    setPendingRequests(prev => prev + 1);
    try {
      const response: AxiosResponse<Colaboradores> = await axios.get(`${baseURL}/employee/${id}`);
      setColaboradores(response.data);
    } catch (error) {
      showAlert("Error al obtener los datos del colaborador", "error");
    } finally {
      setPendingRequests(prev => prev - 1);  
    }
  };

  const renderEjecutarTooltip = (props: React.HTMLAttributes<HTMLDivElement>) => (
    <Tooltip id="button-tooltip-edit" {...props}>
      Ejecutar
    </Tooltip>
  );


  return (
    
    <div className="App">
      <div className="container-fluid">
        <div className="row mt-3">
          <div className="col-12">
            <div className="card-contenedor">
              <Card className="card">
                <Card.Body>
                <div className="d-flex align-items-center custom-icon-task">
                <i className="fa-solid fa-circle-user"></i>
                </div>
                <h5>{colaboradores?.name}</h5>
                <h6>{colaboradores?.rut}</h6>
                <h6>{colaboradores?.position.name}</h6>
                </Card.Body>
              </Card>
            </div>
            <div className="migas-contenedor">
            <Breadcrumb>
              <Breadcrumb.Item className="breadcrumb-link" linkAs={Link} linkProps={{ to: "/organizacion/colaboradores" }}>
                  Colaboradores
              </Breadcrumb.Item>
              <Breadcrumb.Item active>Tarea Colaborador</Breadcrumb.Item>
            </Breadcrumb>
            </div>
            <div className="tabla-contenedor-matriz">
              <DangerHead title="Tarea Colaborador" />
            </div>
            {pendingRequests > 0 ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh', marginTop: '-200px' }}>
              <Spinner animation="border" role="status" style={{ color: '#A17BB6' }}>
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
            ) : (
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead
                  className="text-center"
                  style={{
                    background: "linear-gradient(90deg, #009FE3 0%, #00CFFF 100%)",
                    color: "#fff",
                  }}
                >
                  <tr>
                    <th>N°</th>
                    <th>ID</th>
                    <th>Nombre Tarea</th>
                    <th>Descripción</th>
                    <th>Items</th>
                    <th>Planificaciones</th>
                    <th>Ejecutar</th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                {tasks.length > 0 ? (
                    tasks.map((task, index) => (
                      <tr key={task.taskId} className="text-center">
                        <td>{index + 1}</td>
                        <td>{task.taskId}</td>
                        <td>{task.taskName}</td>
                        <td>{task.taskDescription}</td>
                        <td>
                          {task.checkpoints.length > 0 ? (
                            task.checkpoints.map((checkpoint) => (
                              <div key={checkpoint.checkpointId}>
                                • {checkpoint.checkpointName}
                              </div>
                            ))
                          ) : (
                            "Sin Items"
                          )}
                        </td>
                        <td>
                          {task.plannings.length > 0 ? (
                            task.plannings.map((planning, i) => (
                              <div key={i}>
                                • {planning.startDate} - {planning.endDate}
                              </div>
                            ))
                          ) : (
                            "Sin Planificación"
                          )}
                        </td>
                        <td>
                          <OverlayTrigger placement="top" overlay={renderEjecutarTooltip({})}>
                            <button className="btn btn-custom-tareas m-2">
                              <i className="fa-solid fa-share-from-square"></i>
                            </button>
                          </OverlayTrigger>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6}>No hay tareas asignadas</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TareaColaborador;
