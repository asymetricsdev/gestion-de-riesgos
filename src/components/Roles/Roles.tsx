
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios, { AxiosResponse } from "axios";
import * as bootstrap from 'bootstrap';
import React, { useEffect, useRef, useState } from "react";
import { OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import EncabezadoTabla from "../EncabezadoTabla/EncabezadoTabla";
import { showAlert } from '../functions';
import "/index.css";

const MySwal = withReactContent(Swal);

interface Roles {
  id: string;
  name: string;
}

interface RolesData {
  id?: string;
  name: string;
}

const Roles: React.FC = () => {
  const baseURL = import.meta.env.VITE_API_URL;
  const [roles, setRoles] = useState<Roles[]>([]);
  const [id, setId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [pendingRequests, setPendingRequests] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getRoles();
    if (modalRef.current) {
      modalRef.current.addEventListener('hidden.bs.modal', handleModalHidden);
    }
    return () => {
      if (modalRef.current) {
        modalRef.current.removeEventListener('hidden.bs.modal', handleModalHidden);
      }
    };
  }, []);

  const getRoles = async () => {
    setPendingRequests(prev => prev + 1);
    try {
      const response: AxiosResponse<Roles[]> = await axios.get(`${baseURL}/role/`);
      setRoles(response.data);
    } catch (error) {
      showAlert("Error al obtener los Roles", "error");
    } finally {
      setPendingRequests(prev => prev - 1);
    }
  };

  const openModal = (op: string, rol?: Roles) => {
    if (op === "1") {
      setId("");
      setName("");
      setTitle("Registrar Roles");
    } else if (op === "2" && rol) {
      setId(rol.id);
      setName(rol.name);
      setTitle("Editar Roles");
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
      showAlert("Escribe el nombre del rol", "warning", "nombre");
      return;
    }
    setLoading(true);

    const parametros : RolesData = {  
      name: name.trim(),
    };
    const metodo = id ? "PUT" : "POST";
    enviarSolicitud(metodo, parametros);
  };

  const enviarSolicitud = async (method: "POST" | "PUT", data: RolesData) => {
    setLoading(true);
    try {
      const url = method === "PUT" && id ? `${baseURL}/role/${id}` : `${baseURL}/role/`;
      const response = await axios({
        method,
        url,
        data,
        headers: { "Content-Type": "application/json" },
      });
  
      showAlert("Operación realizada con éxito", "success");
      getRoles();
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

  const deleteRol = async (id: string) => {
    setLoading(true);
    try {
      await axios.delete(`${baseURL}/role/${id}`, {
        headers: { "Content-Type": "application/json" },
      });
      Swal.fire("Rol eliminado correctamente", "", "success");
      getRoles();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Error al eliminar el Rol.",
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
              <EncabezadoTabla title="Roles" onClick={() => openModal("1")} />
            </div>
            {pendingRequests > 0 ? (
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "100vh", marginTop: "-200px" }}
              >
                <Spinner animation="border" role="status" style={{ color: "#A17BB6" }}>
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead
                    className="text-center"
                    style={{
                      background: "linear-gradient(90deg, #009FE3 0%, #00CFFF 100%)",
                      color: "#fff",
                    }}
                  >
                    <tr>
                      <th>ID</th>
                      <th>Nombre del Rol</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    {roles.map((rol, i) => (
                      <tr key={rol.id} className="text-center">
                        <td>{i + 1}</td>
                        <td>{rol.name}</td>
                        <td className="text-center">
                          <OverlayTrigger placement="top" overlay={renderEditTooltip({})}>
                            <button
                              onClick={() => openModal("2", rol)}
                              className="btn btn-custom-editar m-2"
                              data-bs-toggle="modal"
                              data-bs-target="#modalUsers"
                            >
                              <i className="fa-solid fa-edit"></i>
                            </button>
                          </OverlayTrigger>
                          <OverlayTrigger placement="top" overlay={renderDeleteTooltip({})}>
                            <button
                              className="btn btn-custom-danger"
                              onClick={() => {
                                MySwal.fire({
                                  title: "¿Estás seguro?",
                                  text: "No podrás revertir esto",
                                  icon: "warning",
                                  showCancelButton: true,
                                  confirmButtonText: "Sí, bórralo",
                                  cancelButtonText: "Cancelar",
                                }).then((result) => {
                                  if (result.isConfirmed) {
                                    deleteRol(rol.id);
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
                <h1 className="modal-title fs-5" id="modalTitle">
                  {title}
                </h1>
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
                    <i className="fa-solid fa-tree-rol"></i>
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
                  disabled={loading}
                >
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

export default Roles;
