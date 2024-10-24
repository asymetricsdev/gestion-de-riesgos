import axios, { AxiosResponse } from "axios";
import * as bootstrap from 'bootstrap';
import React, { useEffect, useRef, useState } from "react";
import { OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import EncabezadoTabla from "../EncabezadoTabla/EncabezadoTabla";
import { showAlert } from '../functions';

const MySwal = withReactContent(Swal);

interface JerarquiaControl {
  id: number;
  name: string;
  description: string;
  createDate: string;
  updateDate: string;
  checkerType: JerarquiaControl;
}

interface JerarquiaControlData {
  name: string;
  description: string;
}

const JerarquiaControl: React.FC = () => {
  const baseURL = import.meta.env.VITE_API_URL;
  const [checker, setChecker] = useState<JerarquiaControl[]>([]);
  const [id, setId] = useState<number | null>(null);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false); 
  const [pendingRequests, setPendingRequests] = useState<number>(0);


  useEffect(() => {
    getCheckerType();
    if (modalRef.current) {
      modalRef.current.addEventListener('hidden.bs.modal', handleModalHidden);
    }
    return () => {
      if (modalRef.current) {
        modalRef.current.removeEventListener('hidden.bs.modal', handleModalHidden);
      }
    };
  }, []);

  const getCheckerType = async () => {
    setPendingRequests(prev => prev + 1);
    try {
      const response: AxiosResponse<JerarquiaControl[]> = await axios.get(`${baseURL}/checker_type/`);
      setChecker(response.data);
    } catch (error) {
      showAlert("Error al obtener Jerarquía de control", "error");
    }  finally {
      setPendingRequests(prev => prev - 1);  // Disminuir contador
    }
  };

  
  const openModal = (op: string, checkerType?: JerarquiaControl) => {
    if (op === "1") {
      setId(null);
      setName("");
      setDescription("");
      setTitle("Registrar Jerarquía de Control");
    } else if (op === "2" && checkerType) {
      setId(checkerType.id);
      setName(checkerType.name);
      setDescription(checkerType.description);
      setTitle("Editar Jerarquía de Control");
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
    if (name.trim() === "") {
      showAlert("Escribe el nombre de la Jerarquía de control", "warning", "nombre de la Jerarquía de control");
      return;
    }
    if (description.trim() === "") {
      showAlert("Escribe la descripción", "warning", "descripción");
      return;
    }

    setLoading(true);
    
    const parametros: JerarquiaControlData = { 
      name: name.trim(), 
      description: description.trim() };
    
    const metodo = id ? "PUT" : "POST";
    enviarSolicitud(metodo, parametros);
  };


const enviarSolicitud = async (method: "POST" | "PUT", data: JerarquiaControlData) => {
  setLoading(true);
	try {
	  const url = method === "PUT" && id ? `${baseURL}/checker_type/${id}` : `${baseURL}/checker_type/`;
	  const response = await axios({
		method,
		url,
		data,
		headers: { "Content-Type": "application/json" },
	  });
  
	  showAlert("Operación realizada con éxito", "success");
	  getCheckerType();
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


  const deleteCheckerType = async (id: number) => {
    setLoading(true);
    try {
      await axios.delete(`${baseURL}/checker_type/${id}`, {
        headers: { "Content-Type": "application/json" },
      });
      Swal.fire("Tipo de Jerarquía eliminada correctamente", "", "success");
      getCheckerType();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Error al eliminar el Tipo de Jerarquía.",
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
              <EncabezadoTabla title='Jerarquía de Control' onClick={() => openModal("1")} />
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
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                  {checker.map((check, i) => (
                    <tr key={check.id} className="text-center">
                      <td>{i + 1}</td>
                      <td>{check.name}</td>
                      <td>{formatDate(check.createDate)}</td>
                      <td className="text-center">
                        <OverlayTrigger placement="top" overlay={renderEditTooltip({})}>
                        <button
                        onClick={() => openModal("2", check)}
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
                              deleteCheckerType(check.id);
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
                  <i className="fa-solid fa-network-wired"></i>
                  </span>
                  <input
                    type="text"
                    id="nombre"
                    className="form-control"
                    placeholder="Nombre de la Jerarquía de Control"
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

export default JerarquiaControl;
