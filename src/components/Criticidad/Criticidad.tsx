import React, { useEffect, useState, useRef } from "react";
import axios, { AxiosResponse } from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { showAlert } from '../functions';
import { OverlayTrigger, Tooltip, Spinner } from 'react-bootstrap';
import EncabezadoTabla from "../EncabezadoTabla/EncabezadoTabla";
import { capitalizeFirstLetter } from '../functions';
import * as bootstrap from 'bootstrap';

const MySwal = withReactContent(Swal);

interface Criticidad {
  id: number;
  name: string;
  description: string;
  createDate: string;
}

interface CriticidadData {
  name: string;
  description: string;
}

const Criticidad: React.FC = () => {
  const baseURL = import.meta.env.VITE_API_URL;
  const [criticity, setCriticityType] = useState<Criticidad[]>([]);
  const [id, setId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false); 
  const [pendingRequests, setPendingRequests] = useState<number>(0);


  useEffect(() => {
    getCriticity();
    if (modalRef.current) {
      modalRef.current.addEventListener('hidden.bs.modal', handleModalHidden);
    }
    return () => {
      if (modalRef.current) {
        modalRef.current.removeEventListener('hidden.bs.modal', handleModalHidden);
      }
    };
  }, []);

  const getCriticity = async () => {
    setPendingRequests(prev => prev + 1);
    try {
      const response: AxiosResponse<Criticidad[]> = await axios.get(`${baseURL}/criticity/`);
      setCriticityType(response.data);
    } catch (error) {
      showAlert("Error al obtener criticidad", "error");
    } finally {
      setPendingRequests(prev => prev - 1);  // Disminuir contador
    }
  };

  const openModal = (op: string, criticity?: Criticidad) => {
    if (op === "1") {
      setId("");
      setName("");
      setDescription("");
      setTitle("Registrar Criticidad");
    } else if (op === "2" && criticity) {
      setId(criticity.id.toString());
      setName(criticity.name);
      setDescription(criticity.description);
      setTitle("Editar Criticidad");
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

  const validar = () => {
    if (!/^\d+$/.test(name.trim())) {
      showAlert("Solo se permiten números en el campo de nivel de criticidad", "warning", "nombre");
      return;
    }
    if (description.trim() === "") {
      showAlert("Escribe la descripción", "warning", "descripción");
      return;
    }
    setLoading(true);
    
    const parametros : CriticidadData = {  
      name: name.trim(), 
      description: description.trim() };

    const metodo = id ? "PUT" : "POST";
    enviarSolicitud(metodo, parametros);
  };

  const enviarSolicitud = async (method: "POST" | "PUT", data: CriticidadData) => {
    setLoading(true);
    try {
      const url = method === "PUT" && id ? `${baseURL}/criticity/${id}` : `${baseURL}/criticity/`;
      const response = await axios({
        method,
        url,
        data,
        headers: { "Content-Type": "application/json" },
      });

      showAlert("Operación realizada con éxito", "success");

      if (method === "POST") {
        setCriticityType((prev) => [...prev, response.data]);
      } else if (method === "PUT") {
        setCriticityType((prev) =>
          prev.map((item) => (item.id === response.data.id ? response.data : item))
        );
      }

      if (modalRef.current) {
        const modal = bootstrap.Modal.getInstance(modalRef.current);
        modal?.hide();
      }

      getCriticity();
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

  const deleteCriticity = async (id: number) => {
    setLoading(true);
    try {
      await axios.delete(`${baseURL}/criticity/${id}`, {
        headers: { "Content-Type": "application/json" },
      });
      Swal.fire("Criticidad eliminada correctamente", "", "success");
      getCriticity();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Error al eliminar Criticidad.",
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

  return (
    <div className="App">
      <div className="container-fluid">
        <div className="row mt-3">
          <div className="col-12">
            <div className="tabla-contenedor">
              <EncabezadoTabla title='Criticidad' onClick={() => openModal("1")} />
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
                    <th>Nivel</th>
                    <th>Descripción</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                  {criticity.map((crit, i) => (
                    <tr key={crit.id} className="text-center">
                      <td>{i + 1}</td>
                      <td>{crit.name}</td>
                      <td>{capitalizeFirstLetter(crit.description)}</td>
                      <td>{formatDate(crit.createDate)}</td>
                      <td className="text-center">
                        <OverlayTrigger placement="top" overlay={renderEditTooltip({})}>
                          <button
                            onClick={() => openModal("2", crit)}
                            className="btn btn-custom-editar m-2"
                            data-bs-toggle="modal"
                            data-bs-target="#modalUsers"
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
                                deleteCriticity(crit.id);
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
                    <i className="fa-solid fa-bolt"></i>
                  </span>
                  <input
                    type="text"
                    id="nombre"
                    className="form-control"
                    placeholder="Nivel de Criticidad"
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

export default Criticidad;

