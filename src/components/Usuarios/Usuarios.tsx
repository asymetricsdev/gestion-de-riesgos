
import React, { useEffect, useState, useRef } from "react";
import axios, { AxiosResponse } from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { showAlert } from '../functions';
import { OverlayTrigger, Tooltip, Spinner } from 'react-bootstrap';
import EncabezadoTabla from "../EncabezadoTabla/EncabezadoTabla";
import Select from 'react-select';
import { Accordion } from 'react-bootstrap';
import * as bootstrap from 'bootstrap';

const MySwal = withReactContent(Swal);

interface Usuarios {
  id: number;
  name: string;
  password: string;
  roles: Roles[];
  managerPosition: ManagerPosition;
  subordinatePositions: SubordinatePosition[];
}

interface Roles {
  id: number;
  name: string;
}

interface SubordinatePosition {
  id: number;
  name: string;
  roles: string;
  createDate: string;
  updateDate: string;
}

interface ManagerPosition {
  id: number;
  name: string;
  roles: string;
  createDate?: string;
  updateDate?: string;
}

interface UsuarioData {
  id?: number;
  name: string;
  password: string;
  roles: string;
  managerPositionId: number;
}

const Usuarios: React.FC = () => {
  const baseURL = import.meta.env.VITE_API_URL;
  const [positions, setPositions] = useState<Usuarios[]>([]);
  const [roles, setRoles] = useState<string>("");
  const [managerPosition, setManagerPosition] = useState<ManagerPosition[]>([]);
  const [subordinatePositions, setSubordinatePositions] = useState<SubordinatePosition[]>([]);
  const [id, setId] = useState<number | null>(null);
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [selectedManagerIds, setSelectedManagerIds] = useState<number[]>([]);
  const [title, setTitle] = useState<string>("");
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false); 
  const [pendingRequests, setPendingRequests] = useState<number>(0);
  const [estado, setEstado] = useState<number>(1);

  useEffect(() => {
    getPositions();
    getManagerPositions();
    getSubordinatePositions();
    if (modalRef.current) {
      modalRef.current.addEventListener('hidden.bs.modal', handleModalHidden);
    }
    return () => {
      if (modalRef.current) {
        modalRef.current.removeEventListener('hidden.bs.modal', handleModalHidden);
      }
    };
  }, []);

  const getPositions = async () => {
    setPendingRequests(prev => prev + 1);
    try {
      const response: AxiosResponse<Usuarios[]> = await axios.get(`${baseURL}/user/`);
      setPositions(response.data);
    } catch (error) {
      showAlert("Error al obtener los Usuarios", "error");
    } finally {
      setPendingRequests(prev => prev - 1); 
    }
  };

  const getManagerPositions = async () => {
    setPendingRequests(prev => prev + 1);
    try {
      const response: AxiosResponse<ManagerPosition[]> = await axios.get(`${baseURL}/role/`);
      setManagerPosition(response.data);
    } catch (error) {
      showAlert("Error al obtener las Jefaturas", "error");
    } finally {
      setPendingRequests(prev => prev - 1); 
    }
  };

  const getSubordinatePositions = async () => {
    setPendingRequests(prev => prev + 1);
    try {
      const response: AxiosResponse<SubordinatePosition[]> = await axios.get(`${baseURL}/role/`);
      setSubordinatePositions(response.data);
    } catch (error) {
      showAlert("Error al obtener las Tareas", "error");
    } finally {
      setPendingRequests(prev => prev - 1);
    }
  };

  const openModal = (op: string, position?: Usuarios) => {
    if (op === "1") {
      setId(null);
      setName("");
      setPassword("");
      setSelectedManagerIds([]); 
      setTitle("Crear Usuarios");
    } else if (op === "2" && position) {
      setId(position.id);
      setName(position.name);
      setPassword(position.password);
      setSelectedManagerIds([position.managerPosition?.id || 0]);
      setTitle("Editar Usuarios");
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
      showAlert("Escribe el nombre del Usuarios", "warning");
      return;
    }

    if (password.trim() === "") {
      showAlert("Escribe el Password del Usuarios", "warning");
      return;
    }

    if (selectedManagerIds.length === 0) {
      showAlert("Selecciona Jefatura", "warning");
      return;
    }

    setLoading(true);

    const parametros: UsuarioData = {
      name: name.trim(),
      password: password.trim(),
      roles: roles.trim(),
      managerPositionId: selectedManagerIds[0], 
    };

    const metodo: "PUT" | "POST" = id ? "PUT" : "POST";
    enviarSolicitud(metodo, parametros);
  };

  const enviarSolicitud = async (method: "POST" | "PUT", data: UsuarioData) => {
    setLoading(true);
    try {
      const url = method === "PUT" && id ? `${baseURL}/role/${id}` : `${baseURL}/role/`;
      const response = await axios({
        method,
        url,
        data,
        headers: { "Content-Type": "application/json" },
      });
  
      const newActividad = response.data; 
  
      showAlert("Operación realizada con éxito", "success");
  
      if (method === "POST") {
        setPositions((prev) => [...prev, newActividad]);
      } else if (method === "PUT") {
        setPositions((prev) =>
          prev.map((pos) => (pos.id === newActividad.id ? newActividad : pos))
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
    } finally {
      setLoading(false);
    }
  };


  const deletePosition = async (id: number) => {
    try {
      const response = await axios.delete(`${baseURL}/role/${id}`, {
        headers: { "Content-Type": "application/json" },
      });
  
      if (response.status === 200) {
        setPositions(positions.filter((position) => position.id !== id));
        showAlert("Eliminado con éxito", "success");
      } else {
        showAlert("Error al eliminar", "error");
      }
    } catch (error) {
      showAlert("Error al eliminar la posición", "error");
    }
  };

  const opcionesEquipo = subordinatePositions.map(rl => ({
    value: rl.id,
    label: rl.roles,
  }));

  return (
    <div className="App">
      <div className="container-fluid">
        <div className="row mt-3">
          <div className="col-12">
            <div className="tabla-contenedor">
              <EncabezadoTabla title="Usuarios" onClick={() => openModal("1")} />
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
              <div className="table-responsive tabla-scroll">
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
                      <th>Nombre de Usuario</th>
                      <th>Roles</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    {positions &&
                      positions.length > 0 &&
                      positions.map((pos, i) => (
                        <tr key={pos.id} className="text-center">
                          <td>{i + 1}</td>
                          <td>{pos.name}</td>
                          <td>{pos.managerPosition?.name || "N/A"}</td>
                          <td>
                            <Accordion>
                              <Accordion.Item eventKey="0">
                                <Accordion.Header>Roles</Accordion.Header>
                                <Accordion.Body>
                                  <ul>
                                    {pos.subordinatePositions &&
                                    pos.subordinatePositions.length > 0 ? (
                                      pos.subordinatePositions.map((sub) => (
                                        <li key={sub.id}>{sub.roles}</li>
                                      ))
                                    ) : (
                                      <li>No hay subordinados</li>
                                    )}
                                  </ul>
                                </Accordion.Body>
                              </Accordion.Item>
                            </Accordion>
                          </td>
                          <td className="text-center">
                            <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-edit">Editar</Tooltip>}>
                              <button
                                onClick={() => openModal("2", pos)}
                                className="btn btn-custom-editar m-2"
                              >
                                <i className="fa-solid fa-edit"></i>
                              </button>
                            </OverlayTrigger>
                            <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-delete">Eliminar</Tooltip>}>
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
                                      deletePosition(pos.id); 
                                    }
                                  });
                                }}
                              >
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

        <div className="modal fade" id="modalEquipo" tabIndex={-1} ref={modalRef}>
          <div className="modal-dialog modal-dialog-top modal-md">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title w-100">{title}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body">
                <div className="input-group mb-3">
                  <span className="input-group-text">
                    <i className="fa-solid fa-address-card"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nombre del Usuario"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="input-group mb-3">
                  <span className="input-group-text">
                  <i className="fa-solid fa-key"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="mb-3">

      <label htmlFor="Estado">Estado:</label>
      <select
        id="Estado"
        className="form-select"
        value={estado}
        onChange={(e) => setEstado(Number(e.target.value))}
      >
        <option value={1}>Activo</option>
        <option value={0}>Inactivo</option>
      </select>
      </div>

                {/* Multiselect for ROLES1 */}
                <div className="form-group mt-3">
                  <label htmlFor="managerPosition">Roles:</label>
                  <Select
                    isMulti
                    value={managerPosition
                      .filter((proc) => selectedManagerIds.includes(proc.id))
                      .map((proc) => ({ value: proc.id, label: proc.name }))
                    }
                    onChange={(selectedOptions) => {
                      const selectedIds = selectedOptions.map((option) => option.value);
                      setSelectedManagerIds(selectedIds);
                    }}
                    options={managerPosition.map((proc) => ({
                      value: proc.id,
                      label: proc.name,
                    }))}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
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

export default Usuarios;