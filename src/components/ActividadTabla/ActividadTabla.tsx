import React, { useEffect, useState, useRef } from "react";
import axios, { AxiosResponse } from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { showAlert } from '../functions';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import EncabezadoTabla from "../EncabezadoTabla/EncabezadoTabla";
import Select from 'react-select';
import * as bootstrap from 'bootstrap';


const MySwal = withReactContent(Swal);


 interface Actividad {
  id: number;
  name: string;
  description: string;
  createDate: string;
  updateDate: string;
  activityType: ActivityType;
  process: Process;
  hazzards: Hazzard[]; 
} 

interface ActivityType {
  id: number;
  name: string;
  description: string;
  createDate?: string;
  updateDate?: string;
}

interface Process {
  id: number;
  name: string;
  description: string;
  createDate?: string;
  updateDate?: string;
}

 interface Hazzard {
  id: number;
  name: string;
  description: string;
  createDate: string;
  updateDate: string;
} 

interface ActividadData{
  name: string;
  description: string;
  activityTypeId: number;
  processId: number;
  hazzardIds: number[];
}

const Actividad: React.FC = () => {
  const baseURL = import.meta.env.VITE_API_URL;
  const [actividad, setActividad] = useState<Actividad[]>([]);
  const [description, setDescription] = useState<string>("");
  const [activityType, setActivityType] = useState<ActivityType[]>([]);
  const [process, setProcess] = useState<Process[]>([]);
  const [hazzard, setHazzard] = useState<Hazzard[]>([]);
  const [id, setId] = useState<number | null>(null);
  const [name, setName] = useState<string>("");
  const [selectedActivityTypeId, setSelectedActivityTypeId] = useState<number>(0);
  const [selectedProcessId, setSelectedProcessId] = useState<number>(0);
  //const [selectedHazzardIds, setSelectedHazzardIds] = useState<number>(0);
  const [selectedHazzardIds, setSelectedHazzardIds] = useState<number[]>([]);
  const [title, setTitle] = useState<string>("");
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    getActivity();
    getActivityType();
    getProcess(); 
    getHazzard();
    if (modalRef.current) {
      modalRef.current.addEventListener('hidden.bs.modal', handleModalHidden);
    }
    return () => {
      if (modalRef.current) {
        modalRef.current.removeEventListener('hidden.bs.modal', handleModalHidden);
      }
    };
  }, []);

  const getActivity = async () => {
    try {
      const response: AxiosResponse<Actividad[]> = await axios.get(`${baseURL}/activity/`);
      setActividad(response.data);
    } catch (error) {
      showAlert("Error al obtener las actividades", "error");
    }
  };
  
   const getActivityType = async () => {
    try {
      const response: AxiosResponse<ActivityType[]> = await axios.get(`${baseURL}/activity_type/`);
      setActivityType(response.data);
    } catch (error) {
      showAlert("Error al obtener los tipos de actividad", "error");
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

  const getHazzard = async () => {
    try {
      const response: AxiosResponse<Hazzard[]> = await axios.get(`${baseURL}/hazzard/`);
      setHazzard(response.data);
    } catch (error) {
      showAlert("Error al obtener los peligros", "error");
    }
  }; 

  const openModal = (op: string, actividad?: Actividad) => {
    if (op === "1") {
      setId(null);
      setName("");
      setDescription("");
      setSelectedActivityTypeId(0);
      setSelectedHazzardIds([]);
      setSelectedProcessId(0);
      setTitle("Registrar Actividad");
    } else if (op === "2" && actividad) {
      setId(actividad?.id || null);
      setName(actividad.name);
      setDescription(actividad.description);
      setSelectedActivityTypeId(actividad.activityType.id); 
      setSelectedHazzardIds(actividad.hazzards.map(h => h.id));
      setSelectedProcessId(actividad.process.id);
      setTitle("Editar Actividad");
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
        showAlert("Escribe el nombre de la actividad", "warning");
        return;
    }
     if (description.trim() === "") {
        showAlert("Escribe la descripción de la actividad", "warning");
     }
     if (selectedActivityTypeId === 0) {
        showAlert("Selecciona un tipo de actividad", "warning");
        return;
    }
    
    if (selectedProcessId === 0) {
        showAlert("Selecciona un tipo de proceso", "warning");
        return;
    }
    if (selectedHazzardIds.length === 0) {
        showAlert("Selecciona al menos un peligro", "warning");
        return;
    }

 
    const parametros : ActividadData = {
      name: name.trim(),
      description: description.trim(),
      activityTypeId: selectedActivityTypeId,  
      processId: selectedProcessId,
      hazzardIds: selectedHazzardIds,  
    };
    
    const metodo: "PUT" | "POST" = id ? "PUT" : "POST";
    enviarSolicitud(metodo, parametros);

    console.log("Payload enviado:", parametros);
};

const enviarSolicitud = async (method: "POST" | "PUT", data: ActividadData) => {
  try {
    const url = method === "PUT" && id ? `${baseURL}/activity/${id}` : `${baseURL}/activity/`;
    const response = await axios({
      method,
      url,
      data,
      headers: { "Content-Type": "application/json" },
    });

    const newActividad = response.data; // Asumiendo que la respuesta contiene la actividad registrada o actualizada

    showAlert("Operación realizada con éxito", "success");

    if (method === "POST") {
      // Si es una nueva actividad, la añadimos al estado
      setActividad((prev) => [...prev, newActividad]);
    } else if (method === "PUT") {
      // Si es una actualización, modificamos la actividad en el estado
      setActividad((prev) =>
        prev.map((act) => (act.id === newActividad.id ? newActividad : act))
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

  const deleteActividad = async (id: number) => {
    try {
      await axios.delete(`${URL}${id}/`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      showAlert("Peligro eliminado correctamente", "success");
      // Actualizar el estado eliminando la actividad
      setActividad((prev) => prev.filter((act) => act.id !== id));
    } catch (error) {
      showAlert("Error al eliminar el peligro", "error");
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
    console.log(selectedOptions); 
    setSelectedHazzardIds(selectedOptions);
  };
  

  const formatDate = (dateString: string) => {
    return dateString.split('T')[0];
  };

  const opcionesPeligros = hazzard.map(hazzard => ({
    value: hazzard.id,
    label: hazzard.name,
  }));

  return (
    <div className="App">
      <div className="container-fluid">
        <div className="row mt-3">
          <div className="col-12">
            <div className="tabla-contenedor">
              <EncabezadoTabla title='Actividad' onClick={() => openModal("1")} />
            </div>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead className="text-center"
                  style={{ background: 'linear-gradient(90deg, #009FE3 0%, #00CFFF 100%)', color: '#fff' }}>
                  <tr>
                    <th>N°</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Tipo de Actividad</th>
                    <th>Proceso</th>
                    <th>Peligro</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                  {actividad.map((act, i) => (
                    <tr key={JSON.stringify(act)} className="text-center">
                      <td>{i + 1}</td>
                      <td>{act.name}</td>
                      <td>{act.description}</td>
                      <td>{act.activityType.description}</td>
                      <td>{act.process.name}</td> 
                      <td>{act.hazzards.map(h => h.name).join(', ')}</td>
                      <td className="text-center">
                        <OverlayTrigger placement="top" overlay={renderEditTooltip({})}>
                          <button
                            onClick={() => openModal("2", act)}
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
                                deleteActividad(act.id);
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
                  <i className="fa-solid fa-chart-line"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nombre de la actividad"
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
                    placeholder="Descripción de la actividad"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="activityType" className="form-label">Tipo de Actividad</label>
                  <select
                    id="activityType"
                    className="form-select"
                    value={selectedActivityTypeId}
                    onChange={(e) => setSelectedActivityTypeId(Number(e.target.value))}
                  >
                    <option value={0}>Selecciona el tipo de actividad</option>
                    {activityType.map(actv => (
                      <option key={JSON.stringify(actv)} value={actv.id}>{actv.description}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="process" className="form-label">Proceso</label>
                  <select
                    id="process"
                    className="form-select"
                    value={selectedProcessId}  
                    onChange={(e) => setSelectedProcessId(Number(e.target.value))}
                  >
                    <option value={0}>Selecciona el proceso</option>
                    {process.map(proc => (
                      <option key={JSON.stringify(proc)} value={proc.id}>{proc.name}</option>
                    ))}
                 </select>
                </div>
                <div className="form-group mt-3">
                    <label htmlFor="hazzard">Peligros:</label>
                    <Select
                      isMulti
                      value={opcionesPeligros.filter(option => selectedHazzardIds.includes(option.value))}
                      onChange={(selectedOptions) => {
                        const selectedIds = selectedOptions.map((option) => option.value);
                        setSelectedHazzardIds(selectedIds); // Aquí actualizamos el estado con los IDs seleccionados
                      }}
                      options={opcionesPeligros}
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

export default Actividad;
