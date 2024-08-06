import React, { useEffect, useState, useRef } from "react";
import axios, { AxiosResponse } from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { showAlert } from "../functions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import EncabezadoTabla from "../EncabezadoTabla/EncabezadoTabla";
import * as bootstrap from "bootstrap";

const MySwal = withReactContent(Swal);

interface Profile {
	id: string;
	name: string;
	description: string;
	createDate: string;
	// createDate: Date;
	tasks: string;
}

const Profiles: React.FC = () => {
	const URL = "https://asymetricsbackend.uk.r.appspot.com/profile/";
	const [profiles, setProfiles] = useState<Profile[]>([]);
	const [id, setId] = useState<string>("");
	const [name, setName] = useState<string>("");
	const [description, setDescription] = useState<string>("");
	const [createDate, setCreateDate] = useState<string>("");
	// const [createDate, setCreateDate] = useState<Date | null>(null);
	const [tasks, setTasks] = useState<string>("");
	const [title, setTitle] = useState<string>("");
	const modalRef = useRef<HTMLDivElement | null>(null);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	useEffect(() => {
		getProfiles();
		if (modalRef.current) {
			modalRef.current.addEventListener("hidden.bs.modal", handleModalHidden);
		}
		return () => {
			if (modalRef.current) {
				modalRef.current.removeEventListener("hidden.bs.modal", handleModalHidden);
			}
		};
	}, []);

	const getProfiles = async () => {
		try {
			const response: AxiosResponse<Profile[]> = await axios.get(URL);
			/*CODIGO EN CRUDO BORRAR CUANDO SE NECESITE EL DATO DE FECHA**/
			const formattedProfiles = response.data.map((profile) => ({
				...profile,
				createDate: new Date(profile.createDate).toLocaleString(),
			}));
			/*CODIGO EN CRUDO BORRAR CUANDO SE NECESITE EL DATO DE FECHA**/
			setProfiles(response.data);
		} catch (error) {
			showAlert("Error al obtener los perfiles", "error");
		}
	};

	const openModal = (op: string, profile?: Profile) => {
		if (profile) {
			setId(profile.id);
			setName(profile.name);
			setDescription(profile.description);
			// setCreateDate(new Date(profile.createDate));
			setCreateDate(profile.createDate);
			setTasks(profile.tasks);
		} else {
			setId("");
			setName("");
			setDescription("");
			// setCreateDate(null);
			setCreateDate("");
			setTasks("");
		}
		setTitle(op === "1" ? "Registrar Perfil" : "Editar Perfil");

		setTimeout(() => {
			document.getElementById("nombre")?.focus();
		}, 500);

		if (modalRef.current) {
			const modal = new bootstrap.Modal(modalRef.current);
			modal.show();
			setIsModalOpen(true);
		}
	};

	const handleModalHidden = () => {
		setIsModalOpen(false);
		const modals = document.querySelectorAll(".modal-backdrop");
		modals.forEach((modal) => modal.parentNode?.removeChild(modal));
	};

	const validar = () => {
		if (name.trim() === "") {
			showAlert("Escribe el nombre", "warning", "nombre");
			return;
		}
		if (description.trim() === "") {
			showAlert("Escribe la descripción", "warning", "description");
			return;
		}
		// if (!createDate || isNaN(createDate.getTime())) {
		//   showAlert("Escribe la fecha de creación", "warning", "createDate");
		//   return;
		// }
		if (createDate.trim() === "") {
			showAlert("Escribe la fecha de creación", "warning", "createDate");
			return;
		}
		if (tasks.trim() === "") {
			showAlert("Escribe las tareas", "warning", "tasks");
			return;
		}

		const parametros = {
			id,
			name: name.trim(),
			description: description.trim(),
			// createDate: createDate || new Date(),
			createDate: createDate.trim(),
			tasks: tasks.trim(),
		};
		const metodo = id ? "PUT" : "POST";
		enviarSolicitud(metodo, parametros);
	};

	const enviarSolicitud = async (method: "POST" | "PUT", data: any) => {
		try {
			const url = method === "PUT" && id ? `${URL}${id}` : URL;
			const response = await axios({
				method,
				url,
				data,
				headers: { "Content-Type": "application/json" },
			});

			const { tipo, msj } = response.data;
			showAlert(msj, tipo);
			getProfiles();
			if (tipo === "success") {
				setTimeout(() => {
					const closeModalButton = document.getElementById("btnCerrar");
					if (closeModalButton) {
						closeModalButton.click();
					}
					getProfiles();
				}, 500);
			}
		} catch (error) {
			showAlert("Error al enviar la solicitud", "error");
			console.error(error);
		}
	};

	const deleteProfile = async (id: string) => {
		try {
			await axios.delete(`${URL}${id}`, {
				headers: {
					"Content-Type": "application/json",
				},
			});
			showAlert("Perfil eliminado correctamente", "success");
			getProfiles();
		} catch (error) {
			showAlert("Error al eliminar el perfil", "error");
			console.error(error);
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
							<EncabezadoTabla title='Perfiles' onClick={() => openModal("1")} />
						</div>
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
										<th>Nombre</th>
										<th>Descripción</th>
										<th>Fecha de Creación</th>
										<th>Tareas</th>
										<th>Acciones</th>
									</tr>
								</thead>
								<tbody className="table-group-divider">
									{profiles.map((profile, i) => (
										<tr key={profile.id} className="text-center">
											<td>{i + 1}</td>
											<td>{profile.name}</td>
											<td>{profile.description}</td>
											{/* <td>{new Date(profile.createDate).toLocaleString()}</td> */}
											<td>{profile.createDate}</td>
											<td>{profile.tasks}</td>
											<td className="text-center">
												<OverlayTrigger placement="top" overlay={renderEditTooltip}>
												<button
													onClick={() => openModal("2", profile)}
													className="btn btn-custom-editar m-2"
													data-bs-toggle="modal"
													data-bs-target="#modalProfiles"
												>
													<i className="fa-solid fa-edit"></i>
												</button>
												</OverlayTrigger>
												<OverlayTrigger placement="top" overlay={renderDeleteTooltip}>
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
																deleteProfile(profile.id);
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
					</div>
				</div>
				<div
					className="modal fade"
					id="modalProfiles"
					data-bs-backdrop="true"
					data-bs-keyboard="true"
					aria-labelledby="staticBackdropLabel"
					aria-hidden="true"
				>
					<div className="modal-dialog">
						<div className="modal-content">
							<div className="modal-header text-white">
								<label className="h5">{title}</label>
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
										<i className="fa-solid fa-user"></i>
									</span>
									<input
										type="text"
										id="nombre"
										className="form-control"
										placeholder="Nombre"
										value={name}
										onChange={(e) => setName(e.target.value)}
									/>
								</div>
								<div className="input-group mb-3">
									<span className="input-group-text">
										<i className="fa-regular fa-envelope"></i>
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
								<div className="input-group mb-3">
									<span className="input-group-text">
										<i className="fa-solid fa-calendar"></i>
									</span>
									<input
										type="text"
										id="createDate"
										className="form-control"
										placeholder="Fecha de creación"
										value={createDate}
										onChange={(e) => setCreateDate(e.target.value)}
									/>
									{/* <input
                    type="datetime-local"
                    id="createDate"
                    className="form-control"
                    value={createDate ? createDate.toISOString().substring(0, 16) : ""}
                    onChange={(e) => setCreateDate(e.target.value ? new Date(e.target.value) : null)}
                  /> */}
								</div>
								<div className="input-group mb-3">
									<span className="input-group-text">
										<i className="fa-solid fa-tasks"></i>
									</span>
									<input
										type="text"
										id="tasks"
										className="form-control"
										placeholder="Tareas"
										value={tasks}
										onChange={(e) => setTasks(e.target.value)}
									/>
								</div>
								<div className="d-grid col-6 mx-auto">
									<button onClick={validar} className="btn btn-success">
										<i className="fa-solid fa-floppy-disk m-2"></i>Guardar
									</button>
								</div>
							</div>
							<div className="modal-footer">
								<button
									type="button"
									className="btn btn-secondary m-2"
									data-bs-dismiss="modal"
									id="btnCerrar"
								>
									Cerrar
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Profiles;
