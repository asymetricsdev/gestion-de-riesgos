import axios, { AxiosResponse } from "axios";
import * as bootstrap from 'bootstrap';
import React, { useEffect, useRef, useState } from "react";
import { OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import Select from 'react-select';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import EncabezadoTabla from "../EncabezadoTabla/EncabezadoTabla";
import { capitalizeFirstLetter, showAlert } from '../functions';


const MySwal = withReactContent(Swal);

interface Peligro {
  id: number;
  name: string;
  description: string;
  createDate: string;
  updateDate: string;
  checker: Checker;
  risks: Risk[]; 
}
interface Checker {
  id: number;
  name: string;
  description: string;
  createDate?: string;
  updateDate?: string;
}

interface Risk {
  id: number;
  name: string;
  description: string;
  createDate?: string;
  updateDate?: string;
  hazzard: Peligro;
}

interface PeligroData {
  name: string;
  description: string;
  checkerId: number;
  riskIds: number[];
}

const Peligro: React.FC = () => {
  const baseURL = import.meta.env.VITE_API_URL;
  const [hazzard, setHazzard] = useState<Peligro[]>([]);
  const [risk, setRisk] = useState<Risk[]>([]);
  const [checker, setChecker] = useState<Checker[]>([]);
  const [id, setId] = useState<number | null>(null);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedRiskIds, setSelectedRiskIds] = useState<number[]>([]);
  const [selectedCheckerId, setSelectedCheckerId] = useState<number>(0);
  const [title, setTitle] = useState<string>("");
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [pendingRequests, setPendingRequests] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getHazzard();
    getRisk();
    getChecker();
    if (modalRef.current) {
      modalRef.current.addEventListener('hidden.bs.modal', handleModalHidden);
    }
    return () => {
      if (modalRef.current) {
        modalRef.current.removeEventListener('hidden.bs.modal', handleModalHidden);
      }
    };
  }, []);

  const getHazzard = async () => {
    setPendingRequests(prev => prev + 1);
    try {
      const response: AxiosResponse<Peligro[]> = await axios.get(`${baseURL}/hazzard/`);
      setHazzard(response.data);
    } catch (error) {
      showAlert("Error al obtener los peligros", "error");
    } finally {
      setPendingRequests(prev => prev - 1);
    }
  };
  

  const getRisk = async () => {
    setPendingRequests(prev => prev + 1);
    try {
      const response: AxiosResponse<Risk[]> = await axios.get(`${baseURL}/risk/`);
      setRisk(response.data);
    } catch (error) {
      showAlert("Error al obtener los riesgos", "error");
    } finally {
      setPendingRequests(prev => prev - 1);
    }
  };

  const getChecker = async () => {
    setPendingRequests(prev => prev + 1);
    try {
      const response: AxiosResponse<Checker[]> = await axios.get(`${baseURL}/checker/`);
      setChecker(response.data);
    } catch (error) {
      showAlert("Error al obtener los tipos de verificación", "error");
    } finally {
      setPendingRequests(prev => prev - 1);
    }
  };

  const openModal = (op: string, hazzard?: Peligro) => {
    if (op === "1") {
      setId(null);
      setName("");
      setDescription("");
      setSelectedRiskIds([]);
      setSelectedCheckerId(0);
      setTitle("Registrar Peligro");
    } else if (op === "2" && hazzard) {
      setId(hazzard.id);
      setName(hazzard.name);
      setDescription(hazzard.description);
      setSelectedCheckerId(hazzard.checker.id);
      setSelectedRiskIds(hazzard.risks.map(h => h.id));
      setTitle("Editar Peligro");
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
        showAlert("Escribe el nombre del peligro", "warning");
        return;
    }
    if (selectedCheckerId === 0) {
        showAlert("Selecciona un tipo de verificación", "warning");
        return;
    }
    if (selectedRiskIds.length === 0) {
      showAlert("Selecciona un tipo de riego", "warning");
      return;
  }

  setLoading(true);
    
    const parametros: PeligroData = {
        name: name.trim(),
        description: description.trim(),
        checkerId: selectedCheckerId,
        riskIds: selectedRiskIds,                      
    };



    const metodo: "PUT" | "POST" = id ? "PUT" : "POST";
    enviarSolicitud(metodo, parametros);
};

  const enviarSolicitud = async (method: "POST" | "PUT", data: PeligroData) => {
    setLoading(true);
    try {
      const url = method === "PUT" && id ? `${baseURL}/hazzard/${id}` : `${baseURL}/hazzard/`;
      const response = await axios({
        method,
        url,
        data,
        headers: { "Content-Type": "application/json" },
      });
  
      showAlert("Operación realizada con éxito", "success");
      getHazzard();
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

  const deleteHazzard = async (id: number) => {
    setLoading(true);
    try {
      await axios.delete(`${baseURL}/hazzard/${id}`, {
        headers: { "Content-Type": "application/json" },
      });
      Swal.fire("Peligro eliminado correctamente", "", "success");
      setHazzard((prev) => prev.filter((check) => check.id !== id));
      getHazzard();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Error al eliminar el peligro.",
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

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) {
      return "Sin fecha";
    }
    return dateString.split('T')[0];
  };


  const opcionesPeligros = risk.map(risk => ({
    value: risk.id,
    label: risk.name,
  }));

  return (
    <div className="App">
      <div className="container-fluid">
        <div className="row mt-3">
          <div className="col-12">
            <div className="tabla-contenedor">
              <EncabezadoTabla title='Peligros' onClick={() => openModal("1")} />
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
                  style={{ background: 'linear-gradient(90deg, #009FE3 0%, #00CFFF 100%)', color: '#fff' }}>
                  <tr>
                    <th>N°</th>
                    <th>Nombre</th>
                    <th>Riesgos</th> 
                    <th>Verificador</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                    <th className="w-6"></th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                  {hazzard.map((hazz, i) => (
                    <tr key={JSON.stringify(hazz)} className="text-center">
                      <td>{i + 1}</td>
                      <td>{capitalizeFirstLetter(hazz.name)}</td>
                      <td>{hazz.risks.map(h => capitalizeFirstLetter(h.name)).join(', ')}</td>
                      <td>{hazz.checker.name.toUpperCase()}</td>
                      <td>{formatDate(hazz.createDate)}</td>
                      <td className="text-center">
                        <OverlayTrigger placement="top" overlay={renderEditTooltip({})}>
                          <button
                            onClick={() => openModal("2", hazz)}
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
                                deleteHazzard(hazz.id);
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
                    <i className="fa-solid fa-circle-radiation"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nombre del Peligro"
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
                    placeholder="Descripción"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="checker" className="form-label">Verificación:</label>
                  <select
                    id="checker"
                    className="form-select"
                    value={selectedCheckerId}  
                    onChange={(e) => setSelectedCheckerId(Number(e.target.value))}
                  >
                    <option value={0}>Selecciona...</option>
                    {checker.map(chec => (
                      <option key={JSON.stringify(chec)} value={chec.id}>{chec.name}</option>
                    ))}
                 </select>
                </div>
                <div className="form-group mt-3">
                    <label htmlFor="risk">Riesgos:</label>
                    <Select
                      isMulti
                      value={opcionesPeligros.filter(option => selectedRiskIds.includes(option.value))}
                      onChange={(selectedOptions) => {
                        const selectedIds = selectedOptions.map((option) => option.value);
                        setSelectedRiskIds(selectedIds);
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

export default Peligro;
