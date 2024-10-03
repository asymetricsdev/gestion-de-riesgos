import React, { useEffect, useState, useRef } from "react";
import axios, { AxiosResponse } from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { showAlert } from '../functions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { OverlayTrigger, Tooltip, Spinner } from 'react-bootstrap';
import EncabezadoTabla from "../EncabezadoTabla/EncabezadoTabla";
import { capitalizeFirstLetter } from '../functions';
import * as bootstrap from 'bootstrap';

const MySwal = withReactContent(Swal);

interface Riesgo {
  id: number;
  name: string;
  description: string;
  createDate: string;  
  updateDate: string; 
}

interface RiesgoData {
  name: string;
  description: string;

}

const Riesgo: React.FC = () => {
  const baseURL = import.meta.env.VITE_API_URL;
  const [risk, setRisk] = useState<Riesgo[]>([]);
  const [id, setId] = useState<number | null>(null);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [createDate, setCreateDate] = useState<string>("");
  const [updateDate, setUpdateDate] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [pendingRequests, setPendingRequests] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getRisk();
    if (modalRef.current) {
      modalRef.current.addEventListener('hidden.bs.modal', handleModalHidden);
    }
    return () => {
      if (modalRef.current) {
        modalRef.current.removeEventListener('hidden.bs.modal', handleModalHidden);
      }
    };
  }, []);

  const getRisk = async () => {
    setPendingRequests(prev => prev + 1);
    try {
      const response: AxiosResponse<Riesgo[]> = await axios.get(`${baseURL}/risk/`);
      const data = response.data.map(Risk => ({
        ...Risk,
       
      }));
      setRisk(data);
    } catch (error) {
      showAlert("Error al obtener el riesgo", "error");
    } finally {
      setPendingRequests(prev => prev - 1);  // Disminuir contador
    }
  };

  const openModal = (op: string, risk?: Riesgo) => {
    if (op === "1") {
      setId(null);
      setName("");
      setDescription("");
      setTitle("Registrar Riesgo");
    } else if (op === "2" && risk) {
      setId(risk.id);
      setName( risk.name);
      setDescription(risk.description);
     
      setTitle("Editar Riesgo");
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
    if (!name.trim()) {
      showAlert("Escribe el nombre", "warning", "nombre");
      return;
    }
    if (!description.trim()) {
      showAlert("Escribe la descripción", "warning", "descripción");
      return;
    }
    setLoading(true);
    
    const parametros: RiesgoData = {  
      name: name.trim(), 
      description: description.trim(), 
      
    };
    const metodo = id ? "PUT" : "POST";
    enviarSolicitud(metodo, parametros);
  };

  const enviarSolicitud = async (method: "POST" | "PUT", data: RiesgoData) => {
    setLoading(true);
    try {
      const url = method === "PUT" && id ? `${baseURL}/risk/${id}` : `${baseURL}/risk/`;
      const response = await axios({
        method,
        url,
        data,
        headers: { "Content-Type": "application/json" },
      });
  
      showAlert("Operación realizada con éxito", "success");
      getRisk();
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

  const deleteRisk = async (id: number) => {
    setLoading(true);
    try {
      await axios.delete(`${baseURL}/risk/${id}`, {
        headers: { "Content-Type": "application/json" },
      });
      Swal.fire("Riesgo eliminado correctamente", "", "success");
      getRisk();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Error al eliminar el Riesgo.",
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
              <EncabezadoTabla title='Riesgos' onClick={() => openModal("1")} />
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
                  style={{ background: 'linear-gradient(90deg, #009FE3 0%, #00CFFF 100%)', 
                  color: '#fff' }}>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                  {risk.map((cit, i) => (
                    <tr key={cit.id} className="text-center">
                      <td>{i + 1}</td>
                      <td>{capitalizeFirstLetter(cit.name)}</td>
                      <td>{capitalizeFirstLetter(cit.description)}</td>
                      <td className="text-center">
                        <OverlayTrigger placement="top" overlay={renderEditTooltip({})}>
                        <button
                          onClick={() => openModal("2", cit)}
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
                              deleteRisk(cit.id);
                            }
                          });
                        }}
                        >
                          <FontAwesomeIcon icon={faCircleXmark} />
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
        <div
          className="modal fade"
          id="modalUsers"
          ref={modalRef}
          data-bs-backdrop="true"
          data-bs-keyboard="false"
          tabIndex={-1}
          aria-labelledby="modalTitle"
          aria-hidden="true"
        >
          <div className="modal-dialog">
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
                  <i className="fa-solid fa-circle-exclamation"></i>
                  </span>
                  <input
                    type="text"
                    id="name"
                    className="form-control"
                    placeholder="Nombre"
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
                    id="description"
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

export default Riesgo;
