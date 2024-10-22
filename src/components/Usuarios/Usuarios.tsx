
import React, { useEffect, useState, useRef } from "react";
import axios, { AxiosResponse } from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { showAlert } from '../functions';
import { OverlayTrigger, Tooltip, Spinner } from 'react-bootstrap';
import EncabezadoTabla from "../EncabezadoTabla/EncabezadoTabla";
import Select from 'react-select';
import * as bootstrap from 'bootstrap';

const MySwal = withReactContent(Swal);

interface Usuarios {
  id: number;
  username: string;
  password?: string;
  roles: Roles[];
  enabled: boolean;
}

interface Roles {
  id: number;
  name: string;
  enabled?: boolean;
}

interface UsuarioData {
  id?: number;
  username: string;
  password?: string;
  roles: number[]; // Enviar los IDs de roles
  enabled: boolean;
}

const Usuarios: React.FC = () => {
  const baseURL = import.meta.env.VITE_API_URL;
  const [users, setUsers] = useState<Usuarios[]>([]);
  const [roles, setRoles] = useState<Roles[]>([]);
  const [id, setId] = useState<number | null>(null);
  const [username, setUsername] = useState<string>(""); 
  const [password, setPassword] = useState<string>(""); 
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]); 
  const [title, setTitle] = useState<string>("");
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [pendingRequests, setPendingRequests] = useState<number>(0);
  const [estado, setEstado] = useState<boolean>(true);

  useEffect(() => {
    getUsers();
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

  const getUsers = async () => {
    setPendingRequests(prev => prev + 1);
    try {
      const response: AxiosResponse<Usuarios[]> = await axios.get(`${baseURL}/user/`);
      setUsers(response.data);
    } catch (error) {
      showAlert("Error al obtener los usuarios", "error");
    } finally {
      setPendingRequests(prev => prev - 1);
    }
  };

  const getRoles = async () => {
    setPendingRequests(prev => prev + 1);
    try {
      const response: AxiosResponse<Roles[]> = await axios.get(`${baseURL}/role/`);
      setRoles(response.data);
    } catch (error) {
      showAlert("Error al obtener los roles", "error");
    } finally {
      setPendingRequests(prev => prev - 1);
    }
  };

  const openModal = (op: string, user?: Usuarios) => {
    if (op === "1") {
      setId(null);
      setUsername("");
      setPassword(""); 
      setSelectedRoles([]);
      setEstado(true); 
      setTitle("Crear Usuario");
    } else if (op === "2" && user) {
      setId(user.id);
      setUsername(user.username || "");
      setPassword(""); 
      setSelectedRoles(user.roles?.map(role => role.id) || []); 
      setEstado(user.enabled);
      setTitle("Editar Usuario");
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
    if (!username || username.trim() === "") {
      showAlert("Escribe el username del usuario", "warning");
      return;
    }

    if (selectedRoles.length === 0) {
      showAlert("Selecciona al menos un rol", "warning");
      return;
    }

    setLoading(true);

    const parametros: UsuarioData = {
      username: username.trim(),
      password: password ? password.trim() : undefined, 
      roles: selectedRoles, 
      enabled: estado
    };

    const metodo: "PUT" | "POST" = id ? "PUT" : "POST";
    enviarSolicitud(metodo, parametros);
  };

  const enviarSolicitud = async (method: "POST" | "PUT", data: UsuarioData) => {
    setLoading(true);
    try {
      const url = method === "PUT" && id ? `${baseURL}/user/${id}` : `${baseURL}/user/`;
      
      const response = await axios({
        method,
        url,
        data,
        headers: { "Content-Type": "application/json" },
      });
  
      const newUser = response.data;
  
      showAlert("Operación realizada con éxito", "success");
  
      if (method === "POST") {
        setUsers((prev) => [...prev, newUser]);
      } else if (method === "PUT") {
        setUsers((prev) =>
          prev.map((us) => (us.id === newUser.id ? newUser : us))
        );
      }
  
      if (modalRef.current) {
        const modal = bootstrap.Modal.getInstance(modalRef.current);
        modal?.hide();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        showAlert(`Error: ${error.response?.data?.message || "No se pudo completar la solicitud."}`, "error");
      } else {
        showAlert("Error al realizar la solicitud", "error");
      }
    } finally {
      setLoading(false);
    }
  };
  
  const deleteUser = async (id: number) => {
    try {
      const response = await axios.delete(`${baseURL}/user/${id}`, {
        headers: { "Content-Type": "application/json" }, 
      });
  
      if (response.status === 200) {
        setUsers(users.filter((user) => user.id !== id));
        showAlert("Usuario eliminado con éxito", "success");
      } else {
        showAlert("Error al eliminar el usuario", "error");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error en la eliminación:", error.response?.data);
      }
      showAlert("Error al eliminar el usuario", "error");
    }
  };

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
                      <th>Username</th>
                      <th>Roles</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    {users &&
                      users.length > 0 &&
                      users.map((us, i) => (
                        <tr key={us.id} className="text-center">
                          <td>{i + 1}</td>
                          <td>{us.username || "N/A"}</td>
                          <td>
                            <ul>
                              {us.roles?.map((role) => (
                                <li key={role.id}>{role.name}</li>
                              )) || <li>No roles</li>}
                            </ul>
                          </td>
                          <td>{us.enabled ? "Activo" : "Inactivo"}</td>
                          <td className="text-center">
                            <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-edit">Editar</Tooltip>}>
                              <button
                                onClick={() => openModal("2", us)}
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
                                      deleteUser(us.id);
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
                    <i className="fa-solid fa-user"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="input-group mb-3">
                  <span className="input-group-text">
                    <i className="fa-solid fa-key"></i>
                  </span>
                  <input
                    type="password"
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
                    value={estado ? 1 : 0}
                    onChange={(e) => setEstado(e.target.value === "1")}
                  >
                    <option value={1}>Activo</option>
                    <option value={0}>Inactivo</option>
                  </select>
                </div>
                <div className="form-group mt-3">
                  <label htmlFor="roles">Roles:</label>
                  <Select
                    isMulti
                    value={roles
                      .filter((role) => selectedRoles.includes(role.id))
                      .map((role) => ({ value: role.id, label: role.name }))}
                    onChange={(selectedOptions) => {
                      const selectedIds = selectedOptions.map((option) => option.value);
                      setSelectedRoles(selectedIds);
                    }}
                    options={roles.map((role) => ({
                      value: role.id,
                      label: role.name,
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
