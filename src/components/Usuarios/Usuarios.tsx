import axios, { AxiosResponse } from "axios";
import * as bootstrap from 'bootstrap';
import React, { useEffect, useRef, useState } from "react";
import { OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Select from 'react-select';
import EncabezadoTabla from "../EncabezadoTabla/EncabezadoTabla";
import { showAlert } from '../functions';

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
}

interface UsuarioData {
  id?: number;
  username: string;
  password?: string;
  roleIds: number[];
  enabled: boolean;
}

interface UsuariosProps {
  isNewRecord: boolean;
}

const Usuarios: React.FC<UsuariosProps> = ({ isNewRecord }: UsuariosProps) => {
  const baseURL = import.meta.env.VITE_API_URL;
  const [usuarios, setUsuarios] = useState<Usuarios[]>([]);
  const [roles, setRoles] = useState<Roles[]>([]);
  const [id, setId] = useState<number | null>(null);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [estado, setEstado] = useState<boolean>(true);
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);
  const [title, setTitle] = useState<string>("");
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [pendingRequests, setPendingRequests] = useState<number>(0);

  useEffect(() => {
    getUsuarios();
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

  const getUsuarios = async () => {
    setPendingRequests(prev => prev + 1);
    try {
      const response: AxiosResponse<Usuarios[]> = await axios.get(`${baseURL}/user/`);
      setUsuarios(response.data);
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

  const openModal = (op: string, usuario?: Usuarios) => {
    if (op === "1") {
      setId(null);
      setUsername("");
      setPassword(""); 
      setEstado(true);
      setSelectedRoleIds([]);
      setTitle("Registrar Usuario");
    } else if (op === "2" && usuario) {
      setId(usuario.id);
      setUsername(usuario.username);
      setPassword(""); 
      setEstado(usuario.enabled);
      setSelectedRoleIds(usuario.roles.map(role => role.id));
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
    if (username.trim() === "") {
      showAlert("Escribe el nombre del usuario", "warning");
      return;
    }
    if (selectedRoleIds.length === 0) {
      showAlert("Selecciona al menos un Rol", "warning");
      return;
    }

    setLoading(true);

    const parametros: UsuarioData = {
      username: username.trim(),
      password: password ? password.trim() : undefined,
      roleIds: selectedRoleIds,
      enabled: estado,
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
        setUsuarios((prev) => [...prev, newUser]);
      } else if (method === "PUT") {
        setUsuarios((prev) =>
          prev.map((us) => (us.id === newUser.id ? newUser : us))
        );
      }
  
      if (modalRef.current) {
        const modal = bootstrap.Modal.getInstance(modalRef.current);
        modal?.hide();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("Error en la solicitud:", error.response?.data);
        showAlert(`Error: ${error.response?.data?.message || "No se pudo completar la solicitud."}`, "error");
      } else {
        showAlert("Error al realizar la solicitud", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteUsuario = async (id: number) => {
    setLoading(true);
    try {
      await axios.delete(`${baseURL}/user/${id}`, {
        headers: { "Content-Type": "application/json" },
      });
      Swal.fire("Usuario eliminado correctamente", "", "success");
      getUsuarios();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Error al eliminar el Usuario.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

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
											<th>Username</th>
											<th>Roles</th>
											<th>Estado</th>
											<th>Acciones</th>
										</tr>
									</thead>
									<tbody className="table-group-divider">
										{usuarios.map((usuario, i) => (
											<tr key={usuario.id} className="text-center">
												<td>{i + 1}</td>
												<td>{usuario.username}</td>
												<td>
													<ul>
														{usuario.roles.map((role) => (
															<li key={role.id}>{role.name}</li>
														))}
													</ul>
												</td>
												<td>{usuario.enabled ? "Activo" : "Inactivo"}</td>
												<td className="text-center">
													<OverlayTrigger placement="top" overlay={renderEditTooltip({})}>
														<button
															onClick={() => openModal("2", usuario)}
															className="btn btn-custom-editar m-2"
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
																		deleteUsuario(usuario.id);
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

				<div
					className="modal fade"
					id="modalUsuario"
					tabIndex={-1}
					aria-hidden="true"
					ref={modalRef}
				>
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
											.filter((role) => selectedRoleIds.includes(role.id))
											.map((role) => ({ value: role.id, label: role.name }))} 
										onChange={(selectedOptions) => {
											const selectedIds = selectedOptions.map((option) => option.value);
											setSelectedRoleIds(selectedIds);
										}}
										options={roles.map((role) => ({
											value: role.id,
											label: role.name,
										}))}
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

export default Usuarios;
