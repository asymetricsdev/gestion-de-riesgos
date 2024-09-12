import React, { useEffect, useState, useRef } from "react";
import axios, { AxiosResponse } from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { showAlert } from '../functions';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import EncabezadoTabla from "../EncabezadoTabla/EncabezadoTabla";
import { Accordion, AccordionItem, AccordionHeader, AccordionBody } from 'react-bootstrap';
import Select from 'react-select';
import * as bootstrap from 'bootstrap';


const MySwal = withReactContent(Swal);


 interface Checker {
  id: number;
  name: string;
  description: string;
  createDate: string;
  updateDate: string;
  checkerType: CheckerType;
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


interface CheckerData{
  name: string;
  description: string;
  checkerTypeId: number;
  checkpointIds: number[];
}

const Checker: React.FC = () => {
  const baseURL = import.meta.env.VITE_API_URL;
  const [checker, setChecker] = useState<Checker[]>([]);
  const [id, setId] = useState<number | null>(null);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [checkerType, setCheckerType] = useState<CheckerType[]>([]);
  const [checkpoint, setCheckpoint] = useState<Checkpoint[]>([]);
  const [selectedCheckerTypeId, setSelectedCheckerTypeId] = useState<number>(0);
  const [selectedCheckpointIds, setSelectedCheckpointIds] = useState<number[]>([]);
  const [title, setTitle] = useState<string>("");
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    getChecker();
    getCheckerType();
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
    try {
      const response: AxiosResponse<Checker[]> = await axios.get(`${baseURL}/checker/`);
      setChecker(response.data);
    } catch (error) {
      showAlert("Error al obtener los verificadores", "error");
    }
  };
  
   const getCheckerType = async () => {
    try {
      const response: AxiosResponse<CheckerType[]> = await axios.get(`${baseURL}/checker_type/`);
      setCheckerType(response.data);
    } catch (error) {
      showAlert("Error al obtener los tipos de jerarquía", "error");
    }
  };

  const getCheckpoint = async () => {
    try {
      const response: AxiosResponse<Checkpoint[]> = await axios.get(`${baseURL}/checkpoint/`);
      setCheckpoint(response.data);
    } catch (error) {
      showAlert("Error al obtener los items", "error");
    }
  }; 

  
  const openModal = (op: string, checker?: Checker) => {
    if (op === "1") {
      setId(null);
      setName("");
      setDescription("");
      setSelectedCheckerTypeId(0);
      setSelectedCheckpointIds([]);
      setTitle("Registrar Verificación");
    } else if (op === "2" && checker) {
      setId(checker?.id || null);
      setName(checker.name);
      setDescription(checker.description);
      setSelectedCheckerTypeId(checker.checkerType.id); 
      setSelectedCheckpointIds(checker.checkpoints.map(h => h.id));
      setTitle("Editar Verificación");
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
    if (selectedCheckpointIds.length === 0) {
        showAlert("Selecciona al menos un items", "warning");
        return;
    }

 
    const parametros : CheckerData = {
      name: name.trim(),
      description: description.trim(),
      checkerTypeId: selectedCheckerTypeId,  
      checkpointIds: selectedCheckpointIds,  
    };
    
    const metodo: "PUT" | "POST" = id ? "PUT" : "POST";
    enviarSolicitud(metodo, parametros);

};

const enviarSolicitud = async (method: "POST" | "PUT", data: CheckerData) => {
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
      showAlert(`Error: ${error.response.data.message || "No se pudo completar la solicitud."}`, "error");
    } else {
      showAlert("Error al realizar la solicitud", "error");
    }
  }
};

  const deleteChecker = async (id: number) => {
    try {
      await axios.delete(`${baseURL}/checker/${id}`, {
        headers: { "Content-Type": "application/json" },
      });
      Swal.fire("Verificador eliminado correctamente", "", "success");
      setChecker((prev) => prev.filter((check) => check.id !== id));
      getChecker();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Error al eliminar el verificador.",
        icon: "error",
        confirmButtonText: "OK",
      });
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

  const opcionesPeligros = checkpoint.map(checkpoint => ({
    value: checkpoint.id,
    label: checkpoint.name,
  }));

  return (
    <div className="App">
      <div className="container-fluid">
        <div className="row mt-3">
          <div className="col-12">
            <div className="tabla-contenedor">
              <EncabezadoTabla title='Verificadores' onClick={() => openModal("1")} />
            </div>
            <div className="table-responsive tabla-scroll">
              <table className="table table-bordered">
                <thead className="text-center"
                  style={{ background: 'linear-gradient(90deg, #009FE3 0%, #00CFFF 100%)', color: '#fff' }}>
                  <tr>
                    <th>N°</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Tipo de jerarquia</th>
                    <th>Items</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                  {checker.map((check, i) => (
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
                                    <li key={index}>{item.trim()}</li>
                                  ))}
                              </ul>
                            </Accordion.Body>
                          </Accordion.Item>
                        </Accordion>
                      </td>
                      <td>{check.checkerType.name}</td>
                      <td>{check.checkpoints.map(h => h.name).join(', ')}</td>
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
                  <i className="fa-solid fa-rectangle-list"></i>
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
                  <label htmlFor="activityType" className="form-label">Tipo de Jerarquia</label>
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
                <div className="form-group mt-3">
                    <label htmlFor="checkpoints">Items:</label>
                    <Select
                      isMulti
                      value={opcionesPeligros.filter(option => selectedCheckpointIds.includes(option.value))}
                      onChange={(selectedOptions) => {
                        const selectedIds = selectedOptions.map((option) => option.value);
                        setSelectedCheckpointIds(selectedIds); // Aquí actualizamos el estado con los IDs seleccionados
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

export default Checker;
