import React, { useEffect, useState, useRef } from "react";
import axios, { AxiosResponse } from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { showAlert } from "../functions";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import EncabezadoTabla from "../EncabezadoTabla/EncabezadoTabla";
import * as bootstrap from "bootstrap";

const MySwal = withReactContent(Swal);

interface Checkpoint {
	id: number;
	name: string;
	description: string;
	checker: Checker;
}

interface Checker {
	id: number;
	name: string;
	checkerId: number;
}

const Checkpoint: React.FC = () => {
	const baseURL = import.meta.env.VITE_API_URL;
	const [checkpoint, setCheckpoint] = useState<Checkpoint[]>([]);
	const [id, setId] = useState<number | null>(null);
	const [name, setName] = useState<string>("");
	const [description, setDescription] = useState<string>("");
	const [checker, setChecker] = useState<Checker[]>([]);
	const [selectedCheckpointId, setSelectedCheckpointId] = useState<number>(0);
	const [title, setTitle] = useState<string>("");
	const modalRef = useRef<HTMLDivElement | null>(null);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	useEffect(() => {
		getCheckpoint();
		getChecker();
		if (modalRef.current) {
			modalRef.current.addEventListener("hidden.bs.modal", handleModalHidden);
		}
		return () => {
			if (modalRef.current) {
				modalRef.current.removeEventListener("hidden.bs.modal", handleModalHidden);
			}
		};
	}, []);

	const getCheckpoint = async () => {
		try {
			const response: AxiosResponse<Checkpoint[]> = await axios.get(`${baseURL}/checkpoint/`);
			setCheckpoint(response.data);
		} catch (error) {
			showAlert("Error al obtener los Checkpoint", "error");
		}
	};

	const getChecker = async () => {
		try {
			const response = await axios.get<Checker[]>(`${baseURL}/checker/`);
			setChecker(response.data);
		} catch (error) {
			showAlert("Error al obtener el cargo del Perfiles", "error");
		}
	};

	const openModal = (op: string, checkpoint?: Checkpoint) => {
		if (checkpoint) {
			setId(checkpoint.id);
			setName(checkpoint.name);
			setDescription(checkpoint.description);
		} else {
			setId(null);
			setName("");
			setDescription("");
		}
		setTitle(op === "1" ? "Registrar el Tipo de Checkpoint" : "Editar el Tipo de Checkpoint");

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
			showAlert("Escribe el nombre", "warning", "nombre del checkpoint");
			return;
		}
		if (description.trim() === "") {
			showAlert("Escribe la descripción", "warning", "descripción");
			return;
		}
		if (selectedCheckpointId === 0) {
			showAlert("Selecciona un tipo de Checker", "warning");
			return;
		}

		const parametros = { id, name: name.trim(), description: description.trim(), checkerId: selectedCheckpointId };
		const metodo = id ? "PUT" : "POST";
		enviarSolicitud(metodo, parametros);
	};

	const parametros: Checker = {
		id: 0,
		name: name.trim(),
		checkerId: selectedCheckpointId,
	};

	const enviarSolicitud = async (method: "POST" | "PUT", data: any) => {
		try {
			// const url = method === "PUT" && id ? `${URL}${id}` : URL;
			const url = method === "PUT" && id ? `${baseURL}/checkpoint/${id}` : `${baseURL}/checkpoint/`;
			const response = await axios({
				method,
				url,
				data,
				headers: { "Content-Type": "application/json" },
			});

			const { tipo, msj } = response.data;
			showAlert(msj, tipo);
			getCheckpoint();
			if (tipo === "success") {
				setTimeout(() => {
					const closeModalButton = document.getElementById("btnCerrar");
					if (closeModalButton) {
						closeModalButton.click();
					}
					getCheckpoint();
				}, 500);
			}
		} catch (error) {
			showAlert("Error al enviar la solicitud", "error");
			console.error(error);
		}
	};

	// const deleteCheckpoint = async (id: number) => {
	// 	try {
	// 		await axios.delete(`${URL}${id}`, {
	// 			headers: {
	// 				"Content-Type": "application/json",
	// 			},
	// 		});
	// 		showAlert("Checkpoint eliminado correctamente", "success");
	// 		getCheckpoint();
	// 	} catch (error) {
	// 		showAlert("Error al eliminar el Tipo de Checkpoint", "error");
	// 		console.error(error);
	// 	}
	// };

	const deleteCheckpoint = async (id: number) => {
		try {
		  await axios.delete(`${baseURL}/checkpoint/${id}`, {
			headers: { "Content-Type": "application/json" },
		  });
		  Swal.fire("Checkpoint eliminado correctamente", "", "success");
		  getCheckpoint();
		} catch (error) {
		  console.error(error);
		  Swal.fire({
			title: "Error",
			text: "Error al eliminar Checkpoint.",
			icon: "error",
			confirmButtonText: "OK",
		  });
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
							<EncabezadoTabla title="Checkpoint" onClick={() => openModal("1")} />
						</div>
						<div className="table-responsive">
							<table className="table table-bordered">
								<thead
									className="text-center"
									style={{
										background: "linear-gradient(90deg, #009FE3 0%, #00CFFF 100%)",
										color: "#fff",
									}}>
									<tr>
										<th>N°</th>
										<th>Nombre</th>
										<th>Descripción </th>
										<th>Tipo de Verificación</th>
										<th>Acciones</th>
									</tr>
								</thead>
								<tbody className="table-group-divider">
									{checkpoint.map((check, i) => (
										<tr key={JSON.stringify(check)} className="text-center">
											<td>{i + 1}</td>
											<td>{check.name}</td>
											<td>{check.description}</td>
											<td>{check.checker.name}</td>
											<td className="text-center">
												<OverlayTrigger placement="top" overlay={renderEditTooltip({})}>
													<button
														onClick={() => openModal("2", check)}
														className="btn btn-custom-editar m-2">
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
																	deleteCheckpoint(check.id);
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
										<i className="fa-solid fa-list-check"></i>
									</span>
									<input
										type="text"
										id="nombre"
										className="form-control"
										placeholder="Nombre de Checkpoint"
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
								<div className="mb-3">
									<label htmlFor="Checkpoint" className="form-label">
									Verificador:
									</label>
									<select
										id="checkpoint"
										className="form-select"
										value={selectedCheckpointId}
										onChange={(e) => setSelectedCheckpointId(Number(e.target.value))}>
										<option value={0}>Selecciona el Verificador</option>
										{checkpoint.map((chec) => (
										<option key={JSON.stringify(chec)} value={chec.checker.id}>{chec.checker.name}</option>
										))}
									</select>
								</div>
							</div>
							<div className="modal-footer">
								<button
									type="button"
									className="btn btn-secondary"
									data-bs-dismiss="modal"
									id="btnCerrar">
									Cerrar
								</button>
								<button type="button" className="btn btn-primary" onClick={validar}>
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

export default Checkpoint;
