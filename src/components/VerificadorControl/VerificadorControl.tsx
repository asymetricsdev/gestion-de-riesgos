import React, { useEffect, useState, useRef } from "react";
import axios, { AxiosResponse } from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { showAlert } from '../functions';
import { OverlayTrigger, Tooltip, Spinner } from 'react-bootstrap';
import EncabezadoTabla from "../EncabezadoTabla/EncabezadoTabla";
import { Accordion, AccordionItem, AccordionHeader, AccordionBody } from 'react-bootstrap';
import Select from 'react-select';
import { capitalizeFirstLetter } from '../functions';
import * as bootstrap from 'bootstrap';


const MySwal = withReactContent(Swal);


 interface VerificadorControl {
  id: number;
  name: string;
  description: string;
  createDate: string;
  updateDate: string;
  checkerType: CheckerType;
  task: Task;
  checkpoints: Checkpoint[]; 
} 

interface CheckerType {
  id: number;
  name: string;
  description: string;
  createDate?: string;
  updateDate?: string;
}

interface Checkpoint {
  id: number;
  name: string;
  description: string;
  createDate?: string;
  updateDate?: string;
}

interface Task {
  id: number;
  name: string;
  description: string;
  createDate?: string;
  updateDate?: string;
}

interface VerificadorControlData{
  name: string;
  description: string;
  checkerTypeId: number;
  taskId: number | null;
  checkpointIds: number[] | null;
}

const VerificadorControl: React.FC = () => {
  const baseURL = import.meta.env.VITE_API_URL;
  const [checker, setChecker] = useState<VerificadorControl[]>([]);
  const [id, setId] = useState<number | null>(null);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [checkerType, setCheckerType] = useState<CheckerType[]>([]);
  const [task, setTask] = useState<Task[]>([]);
  const [checkpoint, setCheckpoint] = useState<Checkpoint[]>([]);
  const [selectedCheckerTypeId, setSelectedCheckerTypeId] = useState<number>(0);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [selectedCheckpointIds, setSelectedCheckpointIds] = useState<number[] | null>(null);
  const [title, setTitle] = useState<string>("");
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [pendingRequests, setPendingRequests] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getChecker();
    getCheckerType();
    getTask();
    getCheckpoint();
    if (modalRef.current) {
      modalRef.current.addEventListener('hidden.bs.modal', handleModalHidden);
    }
    return () => {
      if (modalRef.current) {
        modalRef.current.removeEventListener('hidden.bs.modal', handleModalHidden);
      }
    };
  }, []);

  const  getChecker = async () => {
    setPendingRequests(prev => prev + 1);
    try {
      const response: AxiosResponse<VerificadorControl[]> = await axios.get(`${baseURL}/checker/`);
      setChecker(response.data);
    } catch (error) {
      showAlert("Error al obtener los verificadores de control", "error");
    } finally {
      setPendingRequests(prev => prev - 1);  
    }
  };
  
   const getCheckerType = async () => {
    setPendingRequests(prev => prev + 1);
    try {
      const response: AxiosResponse<CheckerType[]> = await axios.get(`${baseURL}/checker_type/`);
      setCheckerType(response.data);
    } catch (error) {
      showAlert("Error al obtener al jerarquía de control", "error");
    }finally {
      setPendingRequests(prev => prev - 1);  
    }
  };

  const getTask = async () => {
    setPendingRequests(prev => prev + 1);
    try {
      const response: AxiosResponse<Checkpoint[]> = await axios.get(`${baseURL}/task/`);
      setTask(response.data);
    } catch (error) {
      showAlert("Error al obtener las tareas", "error");
    } finally {
      setPendingRequests(prev => prev - 1);  
    }
  }; 
  
  const getCheckpoint = async () => {
    setPendingRequests(prev => prev + 1);
    try {
      const response: AxiosResponse<Checkpoint[]> = await axios.get(`${baseURL}/checkpoint/`);
      setCheckpoint(response.data);
    } catch (error) {
      showAlert("Error al obtener los items", "error");
    } finally {
      setPendingRequests(prev => prev - 1);  
    }
  }; 

  
  const openModal = (op: string, checker?: VerificadorControl) => {
    if (op === "1") {
      setId(null);
      setName("");
      setDescription("");
      setSelectedCheckerTypeId(0);
      setSelectedTaskId(0);
      setSelectedCheckpointIds([]);
      setTitle("Registrar Verificación de Control");
    } else if (op === "2" && checker) {
      setId(checker?.id || null);
      setName(checker.name);
      setDescription(checker.description);
      setSelectedCheckerTypeId(checker.checkerType.id); 
      setSelectedTaskId(checker.task.id); 
      setSelectedCheckpointIds(checker.checkpoints.map(h => h.id));
      setTitle("Editar Verificación de Control");
    }

    if (modalRef.current) {
      const modal = new bootstrap.Modal(modalRef.current);
      modal.show();
      setIsModalOpen(true);
    }
  };

  const handleModalHidden = () => {
    setIsModalOpen(false);
    const modals = document.querySelectorAll('.modal-backdrop');
    modals.forEach(modal => modal.parentNode?.removeChild(modal));
  };

  const validar = (): void => {
    if (name.trim() === "") {
        showAlert("Escribe el nombre del verificador", "warning");
        return;
    }
     if (description.trim() === "") {
        showAlert("Escribe la descripción del verificador", "warning");
     }
     if (selectedCheckerTypeId === 0) {
        showAlert("Selecciona un tipo de jerarquía", "warning");
        return;
    }
    /* if (!selectedTaskId) {
        showAlert("Selecciona una tarea", "warning");
        return;
    } */
     if (!selectedCheckpointIds) {
        showAlert("Debes seleccionar al menos un checkpoint o dejarlo vacío", "warning");
        return;
    } 

    setLoading(true);
  

    const parametros : VerificadorControlData = {
        name: name.trim(),
        description: description.trim(),
        checkerTypeId: selectedCheckerTypeId,  
        taskId: selectedTaskId ? selectedTaskId : null, 
        checkpointIds: selectedCheckpointIds,
    };
    
    const metodo: "PUT" | "POST" = id ? "PUT" : "POST";
    enviarSolicitud(metodo, parametros);
  };

const enviarSolicitud = async (method: "POST" | "PUT", data: VerificadorControlData) => {
  setLoading(true);
  try {
    const url = method === "PUT" && id ? `${baseURL}/checker/${id}` : `${baseURL}/checker/`;
    const response = await axios({
      method,
      url,
      data,
      headers: { "Content-Type": "application/json" },
    });

    const newChecker = response.data; 

    showAlert("Operación realizada con éxito", "success");

    if (method === "POST") {
      setChecker((prev) => [...prev, newChecker]);
    } else if (method === "PUT") {
      setChecker((prev) =>
        prev.map((check) => (check.id === newChecker.id ? newChecker : check))
      );
    }

    if (modalRef.current) {
      const modal = bootstrap.Modal.getInstance(modalRef.current);
      modal?.hide();
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      showAlert(`Error: ${error.response.data.message || "La tarea seleccionada ya esta asignada"}`, "error");
    } else {
      showAlert("Error al realizar la solicitud", "error");
    }
  } finally {
    setLoading(false);
  }
};

  const deleteChecker = async (id: number) => {
    setLoading(true);
    try {
      await axios.delete(`${baseURL}/checker/${id}`, {
        headers: { "Content-Type": "application/json" },
      });
      Swal.fire("Verificador de control eliminado correctamente", "", "success");
      setChecker((prev) => prev.filter((check) => check.id !== id));
      getChecker();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Error al eliminar el verificador de control.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };
  

  const renderEditTooltip = (props: React.HTMLAttributes<HTMLDivElement>) => (
    <Tooltip id="button-tooltip-edit" {...props}>
      Editar
    </Tooltip>
  );

  const renderDeleteTooltip = (props: React.HTMLAttributes<HTMLDivElement>) => (
    <Tooltip id="button-tooltip-delete" {...props}>
      Eliminar
    </Tooltip>
  );

  const handleHazzardSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => Number(option.value));
    setSelectedCheckpointIds(selectedOptions);
  };
  

  const formatDate = (dateString: string) => {
    return dateString.split('T')[0];
  };

  const opcionesItems = checkpoint.map(checkpoint => ({
    value: checkpoint.id,
    label: checkpoint.name,
  }));

  return (
    <div className="App">
      <div className="container-fluid">
        <div className="row mt-3">
          <div className="col-12">
            <div className="tabla-contenedor">
              <EncabezadoTabla title='Verificadores de Control' onClick={() => openModal("1")} />
            </div>
            {pendingRequests > 0 ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh', marginTop: '-200px' }}>
              <Spinner animation="border" role="status" style={{ color: '#A17BB6' }}>
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
            ) : (
            <div className="table-responsive tabla-scroll">
              <table className="table table-bordered">
                <thead className="text-center"
                  style={{ background: 'linear-gradient(90deg, #009FE3 0%, #00CFFF 100%)', color: '#fff' }}>
                  <tr>
                    <th>N°</th>
                    <th>Nombre</th>
                    <th>Medidas Preventivas</th>
                    <th>Tipo de jerarquia</th>
                    <th>Tareas</th>
                    <th>Items</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                {checker && checker.length > 0 && checker.map((check, i) => (
                   
                    <tr key={JSON.stringify(check)} className="text-center">
                      <td>{i + 1}</td>
                      <td>{check.name}</td>
                      <td>
                        <Accordion>
                          <Accordion.Item eventKey="0">
                            <Accordion.Header>Descripción</Accordion.Header>
                            <Accordion.Body>
                              <ul>
                                {check.description
                                  .split('-') 
                                  .filter(Boolean) 
                                  .map((item, index) => (
                                    <li key={index}>
                                      {capitalizeFirstLetter(item.trim())}</li>
                                  ))}
                              </ul>
                            </Accordion.Body>
                          </Accordion.Item>
                        </Accordion>
                      </td>
                      <td>{check.checkerType.name}</td>
                      <td>{check.task ? check.task.name : "Sin Tarea"}</td>
					  <td>{Array.isArray(check.checkpoints) && check.checkpoints.length > 0 ? check.checkpoints.map((h) => h.name).join(", ") : "Sin Items"}</td>
                      <td className="text-center">
                        <OverlayTrigger placement="top" overlay={renderEditTooltip({})}>
                          <button
                            onClick={() => openModal("2", check)}
                            className="btn btn-custom-editar m-2"
                          >
                            <i className="fa-solid fa-edit"></i>
                          </button>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={renderDeleteTooltip({})}>
                          <button className="btn btn-custom-danger" onClick={() => {
                            MySwal.fire({
                              title: "¿Estás seguro?",
                              text: "No podrás revertir esto",
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonText: "Sí, bórralo",
                              cancelButtonText: "Cancelar",
                            }).then((result) => {
                              if (result.isConfirmed) {
                                deleteChecker(check.id);
                              }
                            });
                          }}>
                            <i className="fa-solid fa-circle-xmark"></i>
                          </button>
                        </OverlayTrigger>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )}
          </div>
        </div>
        <div className="modal fade" id="modalHazzard" tabIndex={-1} ref={modalRef}>
          <div className="modal-dialog modal-dialog-top modal-md">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title w-100">{title}</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="input-group mb-3">
                  <span className="input-group-text">
                  <i className="fa-solid fa-list-check"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nombre de la verificación"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="input-group mb-3">
                  <span className="input-group-text">
                  <i className="fa-regular fa-solid fa-file-alt"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Descripción de la verificación"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="checkerType" className="form-label">Tipo de Jerarquia:</label>
                  <select
                    id="checkerType"
                    className="form-select"
                    value={selectedCheckerTypeId}
                    onChange={(e) => setSelectedCheckerTypeId(Number(e.target.value))}
                  >
                    <option value={0}>Selecciona...</option>
                    {checkerType.map(actv => (
                      <option key={JSON.stringify(actv)} value={actv.id}>{actv.description}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="task" className="form-label">Tarea:</label>
                  <select
                    id="task"
                    className="form-select"
                    value={selectedTaskId === null ? 0 : selectedTaskId}
                    onChange={(e) => setSelectedTaskId(Number(e.target.value))}
                  >
                    <option value={0}>Tarea no asignada</option>
                    {task.map(ts => (
                      <option key={JSON.stringify(ts)} value={ts.id}>{ts.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group mt-3">
                    <label htmlFor="checkpoints">Items:</label>
                    <Select
                      isMulti
                      value={opcionesItems.filter(option => selectedCheckpointIds?.includes(option.value))}
                      onChange={(selectedOptions) => {
                        const selectedIds = selectedOptions.length > 0 
                          ? selectedOptions.map(option => option.value) 
                          : null; // Cambia a null si no hay selección
                        setSelectedCheckpointIds(selectedIds); 
                      }}
                  options={opcionesItems}
                  placeholder="Items no asignados..."
                />
              </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  id="btnCerrar"
                >
                  Cerrar
                </button>
                <button
									type="button"
									className="btn btn-primary"
									onClick={validar}
									disabled={loading}>
									{loading ? (
										<span
											className="spinner-border spinner-border-sm"
											role="status"
											aria-hidden="true"
										></span>
									) : (
										"Guardar"
									)}
								</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificadorControl;
