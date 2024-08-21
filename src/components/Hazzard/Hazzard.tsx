import React, { useEffect, useState, useRef } from "react";
import axios, { AxiosResponse } from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { showAlert } from '../functions';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import EncabezadoTabla from "../EncabezadoTabla/EncabezadoTabla";
import * as bootstrap from 'bootstrap';


const MySwal = withReactContent(Swal);

interface CriticityType {
  id: number;
  name: string;
  description: string;
  createDate?: string;
  updateDate?: string;
}

interface Checker {
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
  criticityType: CriticityType; // Cambiado a objeto
  checker: Checker;
}

interface HazzardData {
  name: string;
  criticityTypeId: number;
  checkerId: number;
}

const Hazzard: React.FC = () => {
  const URL = "https://asymetricsbackend.uk.r.appspot.com/hazzard/";
  const [hazzard, setHazzard] = useState<Hazzard[]>([]);
  const [criticityType, setCriticityType] = useState<CriticityType[]>([]);
  const [checker, setChecker] = useState<Checker[]>([]);
  const [id, setId] = useState<number | null>(null);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedCriticityTypeId, setSelectedCriticityTypeId] = useState<number>(0);
  const [selectedCheckerId, setSelectedCheckerId] = useState<number>(0);
  const [title, setTitle] = useState<string>("");
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    getHazzard();
    getCriticityType();
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
    try {
      const response: AxiosResponse<Hazzard[]> = await axios.get(URL);
      setHazzard(response.data);
    } catch (error) {
      showAlert("Error al obtener los peligros", "error");
    }
  };
  
  const getCriticityType = async () => {
    try {
      const response = await axios.get<CriticityType[]>('https://asymetricsbackend.uk.r.appspot.com/criticity_type/');
      setCriticityType(response.data);
    } catch (error) {
      showAlert("Error al obtener los tipos de criticidad", "error");
    }
  };

  const getChecker = async () => {
    try {
      const response = await axios.get<Checker[]>('https://asymetricsbackend.uk.r.appspot.com/checker/');
      setChecker(response.data);
    } catch (error) {
      showAlert("Error al obtener los tipos de verificación", "error");
    }
  };

  const openModal = (op: string, hazzard?: Hazzard) => {
    if (op === "1") {
      setId(null);
      setName("");
      setDescription("");
      setSelectedCriticityTypeId(0);
      setSelectedCheckerId(0);
      setTitle("Registrar Peligro");
    } else if (op === "2" && hazzard) {
      setId(hazzard.id);
      setName(hazzard.name);
      setDescription(hazzard.description);
      setSelectedCriticityTypeId(hazzard.criticityType.id); 
      setSelectedCheckerId(hazzard.checker.id);
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
    if (selectedCriticityTypeId === 0) {
        showAlert("Selecciona un tipo de criticidad", "warning");
        return;
    }
    if (selectedCheckerId === 0) {
        showAlert("Selecciona un tipo de verificación", "warning");
        return;
    }

    // Tipado para los objetos seleccionados
    const selectedCriticityType: CriticityType | undefined = criticityType.find(ct => ct.id === selectedCriticityTypeId);
    const selectedChecker: Checker | undefined = checker.find(c => c.id === selectedCheckerId);

    if (!selectedCriticityType || !selectedChecker) {
        showAlert("No se encontró el tipo de criticidad o verificación seleccionado", "warning");
        return;
    }

    // Tipado explícito para los parámetros a enviar
    const parametros: HazzardData = {
        name: name.trim(),
        criticityTypeId: selectedCriticityTypeId,  
        checkerId: selectedCheckerId                       
    };


    const metodo: "PUT" | "POST" = id ? "PUT" : "POST";
    enviarSolicitud(metodo, parametros);
};

  const enviarSolicitud = async (method: "POST" | "PUT", data: HazzardData) => {
    try {
      const url = method === "PUT" && id ? `${URL}${id}/` : URL;
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
    }
  };

  //BORRAMOS EL DATO DE LA TABLA
  const deleteHazzard = async (id: number) => {
    try {
      await axios.delete(`${URL}${id}/`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      showAlert("Peligro eliminado correctamente", "success");
      getHazzard();
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

  const formatDate = (dateString: string) => {
    return dateString.split('T')[0];
  };

  return (
    <div className="App">
      <div className="container-fluid">
        <div className="row mt-3">
          <div className="col-12">
            <div className="tabla-contenedor">
              <EncabezadoTabla title='Peligros' onClick={() => openModal("1")} />
            </div>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead className="text-center"
                  style={{ background: 'linear-gradient(90deg, #009FE3 0%, #00CFFF 100%)', color: '#fff' }}>
                  <tr>
                    <th>N°</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Nivel de Criticidad</th>
                    <th>Verificación</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                  {hazzard.map((hazz, i) => (
                    <tr key={JSON.stringify(hazz)} className="text-center">
                      <td>{i + 1}</td>
                      <td>{hazz.name}</td>
                      <td>{hazz.description}</td>
                      <td>{hazz.criticityType.description}</td>
                      <td>{hazz.checker.name}</td>
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
                <div className="mb-3">
                  <label htmlFor="criticityType" className="form-label">Nivel de Criticidad</label>
                  <select
                    id="criticityType"
                    className="form-select"
                    value={selectedCriticityTypeId}
                    onChange={(e) => setSelectedCriticityTypeId(Number(e.target.value))}
                  >
                    <option value={0}>Selecciona el nivel de criticidad</option>
                    {criticityType.map(cri => (
                      <option key={JSON.stringify(cri)} value={cri.id}>{cri.description + ' - ' + cri.name}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="checker" className="form-label">Verificación</label>
                  <select
                    id="checker"
                    className="form-select"
                    value={selectedCheckerId}  
                    onChange={(e) => setSelectedCheckerId(Number(e.target.value))}
                  >
                    <option value={0}>Selecciona la verificación</option>
                    {checker.map(chec => (
                      <option key={JSON.stringify(chec)} value={chec.id}>{chec.name}</option>
                    ))}
                 </select>

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

export default Hazzard;
