import axios, { AxiosResponse } from "axios";
import * as bootstrap from 'bootstrap';
import React, { useEffect, useRef, useState } from "react";
import { OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import EncabezadoTabla from "../EncabezadoTabla/EncabezadoTabla";
import { showAlert } from '../functions';

const MySwal = withReactContent(Swal);

interface Estado {
  id: number;
  name: string;
  description: string;
  taskType: TaskType;
  objective: boolean;
}

interface TaskType{
  id: number;
  name: string;
  description: string;
  createDate: string;
  updateDate: string;
}

interface EstadoData {
  id?: number;
  name: string;
  description: string;
  taskTypeId: number;
  objective: boolean;
}


const Estados: React.FC = () => {

  const baseURL = import.meta.env.VITE_API_URL;
  const [estados, setEstados] = useState<Estado[]>([]);
  const [id, setId] = useState<number | null>(null);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [tipoTareas, setTipoTareas] = useState<TaskType[]>([]);
  const [selectedTipoTareaId, setSelectedTipoTareaId] = useState<number>(0);
  const [checkValue, setCheckValue] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false); 
  const [pendingRequests, setPendingRequests] = useState<number>(0);

  useEffect(() => {
    getEstados();
    getTipoTareas();
    if (modalRef.current) {
      modalRef.current.addEventListener('hidden.bs.modal', handleModalHidden);
    }
    return () => {
      if (modalRef.current) {
        modalRef.current.removeEventListener('hidden.bs.modal', handleModalHidden);
      }
    };
  }, []);

  const getEstados = async () => {
    setPendingRequests(prev => prev + 1);
    try {
      const response: AxiosResponse<Estado[]> = await axios.get(`${baseURL}/status/`);
      setEstados(response.data);
    } catch (error) {
      showAlert("Error al obtener Compañia", "error");
    } finally {
      setPendingRequests(prev => prev - 1);
    }
  };

  const getTipoTareas = async () => {
    setPendingRequests(prev => prev + 1);
    try {
      const response: AxiosResponse<TaskType[]> = await axios.get(`${baseURL}/task_type/`);
      console.log('Tipo de tareas:', response.data); 
      setTipoTareas(response.data);
    } catch (error) {
      showAlert("Error al obtener tipo de tarea", "error");
    } finally {
      setPendingRequests(prev => prev - 1);  
    }
  };

 
  const openModal = (op: string, estado?: Estado) => {
    if (op === "1") {
      setId(null);
      setName("");
      setDescription("");
      setSelectedTipoTareaId(0);
      setCheckValue(false);
      setTitle("Registrar Estado");
    } else if (op === "2" && estado) {
      setId(estado.id);
      setName(estado.name);
      setDescription(estado.description);
      setSelectedTipoTareaId(estado.taskType?.id || 0);
      setCheckValue(estado.objective); //MOC:  10/OCT/2024 -> Modifique linea desde false al valor que viene en estado
      setTitle("Editar Estado");
    }

    if (modalRef.current) {
      const modal = new bootstrap.Modal(modalRef.current);
      modal.show();
      setIsModalOpen(true);
    }

  }

  const handleModalHidden = () => {
    setIsModalOpen(false);
    const modals = document.querySelectorAll('.modal-backdrop');
    modals.forEach(modal => modal.parentNode?.removeChild(modal));
  };

  const validar = () => {
    if (name.trim() === "") {
        showAlert("Escribe el nombre", "warning", "nombre del Compañia");
        return;
    }
    if (description.trim() === "") {
        showAlert("Escribe la descripción", "warning", "descripción");
        return;
    }
    if (selectedTipoTareaId === 0) {
        showAlert("Selecciona un tipo de tarea", "warning");
        return;
    } 
    setLoading(true);
    
    // Incluimos checkValue en los parámetros
    const parametros: EstadoData = { 
        name: name.trim(), 
        description: description.trim(),
        taskTypeId: selectedTipoTareaId,
        objective: checkValue // Añadir esta línea
    };

    const metodo = id ? "PUT" : "POST";
    enviarSolicitud(metodo, parametros);
};

  const enviarSolicitud = async (method: "POST" | "PUT", data: EstadoData ) => {
    setLoading(true);
    try {
      const url = method === "PUT" && id ? `${baseURL}/status/${id}` : `${baseURL}/status/`;
      const response = await axios({
      method,
      url,
      data,
      headers: { "Content-Type": "application/json" },
      });
    
      showAlert("Operación realizada con éxito", "success");
      getEstados();
      if (modalRef.current) {
      const modal = bootstrap.Modal.getInstance(modalRef.current);
      modal?.hide();
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
      showAlert(`Error: ${error.response.data.message || "No se pudo completar la solicitud."}`, "error");
      } else {
      showAlert("Error al realizar la solicitud", "error");
      }
    } finally {
      setLoading(false);
    }
  }; 

  const deleteEstado = async (id: number) => {
    setLoading(true);
    try {
      await axios.delete(`${baseURL}/status/${id}`, {
        headers: { "Content-Type": "application/json" },
      });
      Swal.fire("Estado eliminado correctamente", "", "success");
       getEstados();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Error al eliminar el estado.",
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

    
  return (
    <div className="App">
      <div className="container-fluid">
        <div className="row mt-3">
          <div className="col-12">
            <div className="tabla-contenedor">
              <EncabezadoTabla title='Estados' onClick={() => openModal("1")} />
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
                <thead className="text-center" 
                style={{ background: 'linear-gradient(90deg, #009FE3 0%, #00CFFF 100%)', 
                color: '#fff' }}>
                  <tr>
                    <th>N°</th>
                    <th>Nombre</th>
                    <th>Tipo de Tarea</th>
                    <th>Es Objetivo</th>
                    <th>Acciones</th>
                    <th className="w-6"></th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                {estados?.length > 0 && estados.map((est, i) => (
                    <tr key={est?.id || i} className="text-center">
                      <td>{i + 1}</td>
                      <td>{est?.name || "Sin nombre"}</td>
                      {/*<td>{est?.description || "Sin descripción"}</td>*/}
                      <td>{est.taskType?.name || "No hay Tipo de Tarea"}</td>
                      <td>{est.objective ? "Sí" : "No"}</td>
                      <td className="text-center">
                        <OverlayTrigger placement="top" overlay={renderEditTooltip({})}>
                        <button
                        onClick={() => openModal("2", est)}
                        className="btn btn-custom-editar m-2"
                        data-bs-toggle="modal"
                        data-bs-target="#modalUsers">
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
                              deleteEstado(est.id);
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
        <div className="modal fade" id="modalUsers" tabIndex={-1} aria-hidden="true" ref={modalRef}>
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
                <input type="hidden" id="id" />
                <div className="input-group mb-3">
                  <span className="input-group-text">
                  <i className="fa-solid fa-user-check"></i>
                  </span>
                  <input
                    type="text"
                    id="nombre"
                    className="form-control"
                    placeholder="Nombre del Estado"
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
                    id="descripcion"
                    className="form-control"
                    placeholder="Descripción"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="mb-3">
									<label htmlFor="typeTask">Tipo de Tarea:</label>
									<select
										id="typeTask"
										className="form-select"
										value={selectedTipoTareaId}
										onChange={(e) => setSelectedTipoTareaId(Number(e.target.value))}
									>
										<option value={0}>Selecciona...</option>
										{tipoTareas.map((tt) => (
											<option key={tt.id} value={tt.id}>
												{tt.name}
											</option>
										))}
									</select>
								</div>
                  {/* Checkbox agregado */}
            {/*   <div className="form-check mb-3">
                <input
                  type="checkbox"
                  id="myCheckbox"
                  className="form-check-input"
                  checked={checkValue}
                  onChange={(e) => setCheckValue(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="myCheckbox">
                ¿Es un estado objetivo para completar la tarea?
                </label>
              </div> */}
              {/*otro check */}
            
                  <div className="form-check mb-3">
                    <input className="form-check-input" type="checkbox" id="customCheck" checked={checkValue} onChange={e => setCheckValue(e.target.checked)} />
                    <label className="form-check-label" htmlFor="customCheck">
                    ¿Es un estado objetivo para completar la tarea?
                    </label>
                  </div>
                
                <div className="input-group mb-3">
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

export default Estados;

