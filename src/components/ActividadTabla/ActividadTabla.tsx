import React, { useEffect, useState, useRef } from "react";
import axios, { AxiosResponse } from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { showAlert } from "../functions";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import EncabezadoTabla from "../EncabezadoTabla/EncabezadoTabla";
import Select from "react-select";
import * as bootstrap from "bootstrap";

const MySwal = withReactContent(Swal);

interface Actividad {
	id: number;
	name: string;
	description: string;
	createDate: string;
	updateDate: string;
	activityType: ActivityType;
	process: Process;
	criticities: Criticity[];
	hazzards: HazzardCriticity[];
}

interface HazzardCriticity {
	hazzard: Hazzard;
	criticity: Criticity;
}

interface Hazzard {
	id: number;
	name: string;
	description: string;
	createDate: string;
	updateDate: string;
}

interface ActivityType {
	id: number;
	name: string;
	description: string;
	createDate?: string;
	updateDate?: string;
}

interface Process {
	id: number;
	name: string;
	description: string;
	createDate?: string;
	updateDate?: string;
}

interface Criticity {
	id: number;
	name: string;
	description: string;
	createDate: string;
}

interface ActividadData {
	name: string;
	description: string;
	activityTypeId: number;
	processId: number;
	hazzards: HazzardCriticity[];
}


interface Option {
	value: number;
	label: string;
}

const Actividad: React.FC = () => {
	const baseURL = import.meta.env.VITE_API_URL;
	const [actividad, setActividad] = useState<Actividad[]>([]);
	const [description, setDescription] = useState<string>("");
	const [activityType, setActivityType] = useState<ActivityType[]>([]);
	const [process, setProcess] = useState<Process[]>([]);
	const [hazzards, setHazzard] = useState<Hazzard[]>([]);
	const [criticity, setCriticity] = useState<Criticity[]>([]);
	const [id, setId] = useState<number | null>(null);
	const [name, setName] = useState<string>("");
	const [selectedActivityTypeId, setSelectedActivityTypeId] = useState<number>(0);
	const [selectedProcessId, setSelectedProcessId] = useState<number>(0);
	const [selectedHazzardCriticity, setSelectedHazzardCriticity] = useState<number[]>([]);
	const [selectedCriticityIds, setSelectedCriticityIds] = useState<number[]>([]);
	const [title, setTitle] = useState<string>("");
	const modalRef = useRef<HTMLDivElement | null>(null);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	const [filteredCriticity, setFilteredCriticity] = useState<Option[]>([]);

	useEffect(() => {
		getActivity();
		getActivityType();
		getProcess();
		getHazzard();
		getCriticity();
		if (modalRef.current) {
			modalRef.current.addEventListener("hidden.bs.modal", handleModalHidden);
		}
		return () => {
			if (modalRef.current) {
				modalRef.current.removeEventListener("hidden.bs.modal", handleModalHidden);
			}
		};
	}, []);

	const getActivity = async () => {
		try {
			const response: AxiosResponse<Actividad[]> = await axios.get(`${baseURL}/activity/`);
			setActividad(response.data || []);
		} catch (error) {
			showAlert("Error al obtener las actividades", "error");
		}
	};

	const getActivityType = async () => {
		try {
			const response: AxiosResponse<ActivityType[]> = await axios.get(`${baseURL}/activity_type/`);
			setActivityType(response.data || []);
		} catch (error) {
			showAlert("Error al obtener los tipos de actividad", "error");
		}
	};

	const getProcess = async () => {
		try {
			const response: AxiosResponse<Process[]> = await axios.get(`${baseURL}/process/`);
			setProcess(response.data || []);
		} catch (error) {
			showAlert("Error al obtener los procesos", "error");
		}
	};

	const getHazzard = async () => {
		try {
			const response: AxiosResponse<Hazzard[]> = await axios.get(`${baseURL}/hazzard/`);
			setHazzard(response.data || []);
		} catch (error) {
			showAlert("Error al obtener los peligros", "error");
		}
	};

	const getCriticity = async () => {
		try {
			const response: AxiosResponse<Criticity[]> = await axios.get(`${baseURL}/criticity/`);
			setCriticity(response.data || []);
		} catch (error) {
			showAlert("Error al obtener las criticidades", "error");
		}
	};

	const handleHazzardSelection = (selectedOptions: Option[]) => {
		const selectedIds = selectedOptions.map((option) => option.value);
		setSelectedHazzardCriticity(selectedIds);

		const filteredOptions = criticity
			.filter((criticityItem) => selectedIds.includes(criticityItem.id))
			.map((criticityItem) => ({
				value: criticityItem.id,
				label: criticityItem.description,
			}));
		setFilteredCriticity(filteredOptions);
	};

	const handleModalHidden = () => {
		setIsModalOpen(false);
		const modals = document.querySelectorAll(".modal-backdrop");
		modals.forEach((modal) => modal.parentNode?.removeChild(modal));
	};

	const openModal = (op: string, actividad?: Actividad) => {
		if (op === "1") {
			setId(null);
			setName("");
			setDescription("");
			setSelectedActivityTypeId(0);
			setSelectedHazzardCriticity([]);
			setSelectedCriticityIds([]);
			setSelectedProcessId(0);
			setTitle("Registrar Actividad");
		} else if (op === "2" && actividad) {
			setId(actividad?.id || null);
			setName(actividad.name);
			setDescription(actividad.description);
			setSelectedActivityTypeId(actividad.activityType.id);
			setSelectedProcessId(actividad.process.id);
			setSelectedHazzardCriticity(actividad.hazzards.map((h) => h.hazzard.id));
			setSelectedCriticityIds(actividad.hazzards.map((h) => h.criticity.id));
			setSelectedProcessId(actividad.process.id);
			setTitle("Editar Actividad");
		}

		if (modalRef.current) {
			const modal = new bootstrap.Modal(modalRef.current);
			modal.show();
			setIsModalOpen(true);
		}
	};

	const validar = (): void => {
		if (name.trim() === "") {
			showAlert("Escribe el nombre de la actividad", "warning");
			return;
		}
		if (description.trim() === "") {
			showAlert("Escribe la descripción de la actividad", "warning");
			return;
		}
		if (selectedActivityTypeId === 0) {
			showAlert("Selecciona un tipo de actividad", "warning");
			return;
		}
		if (selectedProcessId === 0) {
			showAlert("Selecciona un tipo de proceso", "warning");
			return;
		}
		if (setSelectedHazzardCriticity.length === 0) {
			showAlert("Selecciona al menos un peligro", "warning");
			return;
		}

		const setSelectedHazzardCriticitySend = setSelectedHazzardCriticity || [];

		const parametros: ActividadData = {
			name: name.trim(),
			description: description.trim(),
			activityTypeId: selectedActivityTypeId,
			processId: selectedProcessId,
			hazzards: selectedHazzardCriticity.map((hazzardId, index) => ({
				hazzardId,
				criticityId: selectedCriticityIds[index],
			})),
		};
    

		enviarSolicitud(id ? "PUT" : "POST", parametros);
	};

  const enviarSolicitud = async (method: "POST" | "PUT", data: any) => {
    try {
        const url = method === "PUT" && id ? `${baseURL}/activity/${id}` : `${baseURL}/activity/`;
        const response = await axios({
            method,
            url,
            data,
            headers: { "Content-Type": "application/json" },
        });

        const newActividad = response.data;

        if (method === "POST") {
            setActividad((prev) => [...prev, newActividad]);
        } else if (method === "PUT") {
            setActividad((prev) =>
                prev.map((act) => (act.id === newActividad.id ? newActividad : act))
            );
        }

        showAlert("Operación realizada con éxito", "success");

        if (modalRef.current) {
            const modal = bootstrap.Modal.getInstance(modalRef.current);
            modal?.hide();
        }

    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
            console.error("Detalles del error:", error.response);
            showAlert(`Error: ${error.response.data.message || "No se pudo completar la solicitud."}`, "error");
        } else if (error.request) {
            console.error("No hay respuesta del servidor:", error.request);
            showAlert("Error: El servidor no respondió. Verifica tu conexión o intenta más tarde.", "error");
        } else {
            console.error("Error inesperado:", error.message);
            showAlert(`Error inesperado: ${error.message}`, "error");
        }
    }
};



	const deleteActividad = async (id: number) => {
		try {
			await axios.delete(`${baseURL}/activity/${id}`, {
				headers: { "Content-Type": "application/json" },
			});
			Swal.fire("Tarea eliminada correctamente", "", "success");
			setActividad((prev) => prev.filter((act) => act.id !== id));
			getActivity();
		} catch (error) {
			Swal.fire({
				title: "Error",
				text: "Error al eliminar la tarea.",
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
							<EncabezadoTabla title="Actividad" onClick={() => openModal("1")} />
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
										<th>N°</th>
										<th>Nombre</th>
										<th>Descripción</th>
										<th>Tipo de Actividad</th>
										<th>Proceso</th>
										<th>Peligro / Criticidad</th>
										<th>Acciones</th>
									</tr>
								</thead>
								<tbody className="table-group-divider">
									{actividad.length > 0 ? (
										actividad.map((act, i) => (
											<tr key={act.id} className="text-center">
												<td>{i + 1}</td>
												<td>{act.name}</td>
												<td>{act.description}</td>
												<td>{act.activityType?.description || "Sin tipo de actividad"}</td>
												<td>{act.process?.name || "Sin proceso"}</td>
												<td>
													{Array.isArray(act.hazzards) && act.hazzards.length > 0 ? (
														<>
															<ul>
																{act.hazzards.map((h) => (
																	<li key={h.hazzard.id}>
																		{`${h.hazzard.name} / ${h.criticity.description}`}
																	</li>
																))}
															</ul>
														</>
													) : (
														<>
															<b>Peligros:</b> Sin peligros <br />
															<b>Criticidades:</b> Sin criticidades
														</>
													)}
												</td>
												<td className="text-center">
													<OverlayTrigger placement="top" overlay={renderEditTooltip({})}>
														<button
															onClick={() => openModal("2", act)}
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
																		deleteActividad(act.id);
																	}
																});
															}}
														>
															<i className="fa-solid fa-circle-xmark"></i>
														</button>
													</OverlayTrigger>
												</td>
											</tr>
										))
									) : (
										<tr>
											<td colSpan={7}>No hay actividades disponibles</td>
										</tr>
									)}
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
								<div className="mb-3">
									<label htmlFor="process" className="form-label">
										Proceso:
									</label>
									<select
										id="process"
										className="form-select"
										value={selectedProcessId}
										onChange={(e) => setSelectedProcessId(Number(e.target.value))}
									>
										<option value={0}>Selecciona...</option>
										{process.map((proc) => (
											<option key={proc.id} value={proc.id}>
												{proc.name}
											</option>
										))}
									</select>
								</div>
								<div className="input-group mb-3">
									<span className="input-group-text">
										<i className="fa-solid fa-chart-line"></i>
									</span>
									<input
										type="text"
										className="form-control"
										placeholder="Nombre de la actividad"
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
										className="form-control"
										placeholder="Descripción de la actividad"
										value={description}
										onChange={(e) => setDescription(e.target.value)}
									/>
								</div>
								<div className="mb-3">
									<label htmlFor="activityType" className="form-label">
										Tipo de Actividad:
									</label>
									<select
										id="activityType"
										className="form-select"
										value={selectedActivityTypeId}
										onChange={(e) => setSelectedActivityTypeId(Number(e.target.value))}
									>
										<option value={0}>Selecciona...</option>
										{activityType.map((actv) => (
											<option key={actv.id} value={actv.id}>
												{actv.description}
											</option>
										))}
									</select>
								</div>

								<div className="form-group mt-3">
									<label htmlFor="hazzard">Peligros:</label>
									<Select
										isMulti
										value={hazzards
											.filter((h) => selectedHazzardCriticity.includes(h.id))
											.map((h) => ({ value: h.id, label: h.name }))}
										onChange={(selectedOptions) => {
											handleHazzardSelection(selectedOptions as Option[]);
										}}
										options={hazzards.map((h) => ({
											value: h.id,
											label: h.name,
										}))}
									/>
								</div>
								<div className="form-group mt-3">
									<label htmlFor="criticity">Criticidad:</label>
									<Select
										isMulti
										value={filteredCriticity.filter((option) =>
											selectedCriticityIds.includes(option.value)
										)}
										onChange={(selectedOptions) => {
											const selectedIds = selectedOptions.map((option) => option.value);
											setSelectedCriticityIds(selectedIds);
										}}
										options={filteredCriticity}
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

export default Actividad;
