import React, { useEffect, useState, useRef } from "react";
import axios, { AxiosResponse } from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { showAlert } from '../functions';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import EncabezadoTabla from "../EncabezadoTabla/EncabezadoTabla";
import Select from 'react-select';
import { Accordion, AccordionItem, AccordionHeader, AccordionBody } from 'react-bootstrap';
import * as bootstrap from 'bootstrap';


const MySwal = withReactContent(Swal);


interface Profiles {
  id: number;
  name: string;
  description: string;
  createDate: string;
  updateDate: string;
  process: Process;
  tasks: Tasks[];
}

interface Tasks {
  id: number;
  name: string;
  description: string;
  createDate: string;
  updateDate: string;
}

interface Process {
  id: number;
  name: string;
  description: string;
  createDate?: string;
  updateDate?: string;
}


interface ProfilesData{
  name: string;
  description: string;
  processId: number;
  taskIds: number[];
}

const Profiles: React.FC = () => {

  const baseURL = import.meta.env.VITE_API_URL;
  const [profiles, setProfiles] = useState<Profiles[]>([]);
  const [description, setDescription] = useState<string>("");
  const [process, setProcess] = useState<Process[]>([]);
  const [tasks, setTasks] = useState<Tasks[]>([]);
  const [id, setId] = useState<number | null>(null);
  const [name, setName] = useState<string>("");
  const [selectedActivityTypeId, setSelectedActivityTypeId] = useState<number>(0);
  const [selectedProcessId, setSelectedProcessId] = useState<number>(0);
  const [selectedTaskIds, setSelectedTaskIds] = useState<number[]>([]);
  const [title, setTitle] = useState<string>("");
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    getProfiles();
    getProcess(); 
    getTasks();
    if (modalRef.current) {
      modalRef.current.addEventListener('hidden.bs.modal', handleModalHidden);
    }
    return () => {
      if (modalRef.current) {
        modalRef.current.removeEventListener('hidden.bs.modal', handleModalHidden);
      }
    };
  }, []);

  const getProfiles = async () => {
    try {
      const response: AxiosResponse<Profiles[]> = await axios.get(`${baseURL}/profile/`);
      setProfiles(response.data);
    } catch (error) {
      showAlert("Error al obtener los perfiles", "error");
    }
  };
  
  
  const getProcess = async () => {
    try {
      const response: AxiosResponse<Process[]> = await axios.get(`${baseURL}/process/`);
      setProcess(response.data);
    } catch (error) {
      showAlert("Error al obtener los procesos", "error");
    }
  }; 

  const getTasks = async () => {
    try {
      const response: AxiosResponse<Tasks[]> = await axios.get(`${baseURL}/task/`);
      setTasks(response.data);
    } catch (error) {
      showAlert("Error al obtener las tareas", "error");
    }
  }; 

  const openModal = (op: string, profiles?: Profiles) => {
    if (op === "1") {
      setId(null);
      setName("");
      setDescription("");
      setSelectedTaskIds([]);
      setSelectedProcessId(0);
      setTitle("Registrar Perfil");
    } else if (op === "2" && profiles) {
      setId(profiles?.id || null);
      setName(profiles.name);
      setDescription(profiles.description);
      setSelectedTaskIds(profiles.tasks.map(h => h.id));
      setSelectedProcessId(profiles.process.id);
      setTitle("Editar Perfil");
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
        showAlert("Escribe el nombre del perfil", "warning");
        return;
    }
     if (description.trim() === "") {
        showAlert("Escribe la descripción del perfil", "warning");
     }
    
    if (selectedProcessId === 0) {
        showAlert("Selecciona un tipo de proceso", "warning");
        return;
    }
    if (selectedTaskIds.length === 0) {
        showAlert("Selecciona al menos una tarea", "warning");
        return;
    }

    const parametros : ProfilesData = {
      name: name.trim(),
      description: description.trim(),
      processId: selectedProcessId,
      taskIds: selectedTaskIds,  
    };
    
    const metodo: "PUT" | "POST" = id ? "PUT" : "POST";
    enviarSolicitud(metodo, parametros);

    console.log("Payload enviado:", parametros);
};

const enviarSolicitud = async (method: "POST" | "PUT", data: ProfilesData) => {
  try {
    const url = method === "PUT" && id ? `${baseURL}/process/${id}` : `${baseURL}/process/`;
    const response = await axios({
      method,
      url,
      data,
      headers: { "Content-Type": "application/json" },
    });

    const newActividad = response.data; 

    showAlert("Operación realizada con éxito", "success");

    if (method === "POST") {
      setProfiles((prev) => [...prev, newActividad]);
    } else if (method === "PUT") {
      setProfiles((prev) =>
        prev.map((prof) => (prof.id === newActividad.id ? newActividad : prof))
      );
    }

    // Cerrar el modal después de la operación
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
  }
};

  //BORRAMOS EL DATO DE LA TABLA
  const deleteProfiles = async (id: number) => {
    try {
      await axios.delete(`${URL}${id}/`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      showAlert("Perfil eliminado correctamente", "success");
      // Actualizar el estado eliminando la actividad
      setProfiles((prev) => prev.filter((prof) => prof.id !== id));
    } catch (error) {
      showAlert("Error al eliminar el perfil", "error");
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
    console.log(selectedOptions); // Verifica si las opciones seleccionadas están presentes
    setSelectedTaskIds(selectedOptions);
  };
  

  const formatDate = (dateString: string) => {
    return dateString.split('T')[0];
  };

  const opcionesTareas = tasks.map(task => ({
    value: task.id,
    label: task.description,
  }));

  return (
    <div className="App">
      <div className="container-fluid">
        <div className="row mt-3">
          <div className="col-12">
            <div className="tabla-contenedor">
              <EncabezadoTabla title='Perfiles' onClick={() => openModal("1")} />
            </div>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead className="text-center"
                  style={{ background: 'linear-gradient(90deg, #009FE3 0%, #00CFFF 100%)', color: '#fff' }}>
                  <tr>
                    <th>N°</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Proceso</th>
                    <th>Tareas</th> 
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                  {profiles.map((prof, i) => (
                    <tr key={JSON.stringify(prof)} className="text-center">
                      <td>{i + 1}</td>
                      <td>{prof.name}</td>
                      <td>{prof.description}</td>
                      <td>{prof.process.name}</td> 
                      <td>
                        <Accordion>
                          <Accordion.Item eventKey="0">
                            <Accordion.Header>Ver Tareas</Accordion.Header>
                            <Accordion.Body>
                              <ul>
                                {prof.tasks.map((task) => (
                                  <li key={task.id}>{task.description}</li>
                                ))}
                              </ul>
                            </Accordion.Body>
                          </Accordion.Item>
                        </Accordion>
                      </td>
                      <td>{formatDate(prof.createDate)}</td>
                      <td className="text-center">
                        <OverlayTrigger placement="top" overlay={renderEditTooltip({})}>
                          <button
                            onClick={() => openModal("2", prof)}
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
                                deleteProfiles(prof.id);
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
                  <i className="fa-solid fa-address-card"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nombre del Perfil"
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
                    placeholder="Descripción del Perfil"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="process" className="form-label">Proceso:</label>
                  <select
                    id="process"
                    className="form-select"
                    value={selectedProcessId}  
                    onChange={(e) => setSelectedProcessId(Number(e.target.value))}
                  >
                    <option value={0}>Selecciona el Proceso</option>
                    {process.map(proc => (
                      <option key={JSON.stringify(proc)} value={proc.id}>{proc.name}</option>
                    ))}
                 </select>
                </div>
                <div className="form-group mt-3">
                    <label htmlFor="hazzard">Tareas:</label>
                    <Select
                      isMulti
                      value={opcionesTareas.filter(option => selectedTaskIds.includes(option.value))}
                      onChange={(selectedOptions) => {
                        const selectedIds = selectedOptions.map((option) => option.value);
                        setSelectedTaskIds(selectedIds); 
                      }}
                      options={opcionesTareas}
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
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profiles;
