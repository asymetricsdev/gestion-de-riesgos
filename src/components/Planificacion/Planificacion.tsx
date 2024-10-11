
import React, { useEffect, useState, useRef } from "react";
import axios, { AxiosResponse } from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { showAlert } from "../functions";
import { OverlayTrigger, Tooltip, Spinner } from "react-bootstrap";
import EncabezadoTabla from "../EncabezadoTabla/EncabezadoTabla";
import Select from "react-select";
import { Accordion, AccordionItem, AccordionHeader, AccordionBody } from "react-bootstrap";
import * as bootstrap from "bootstrap";

const MySwal = withReactContent(Swal);

interface Planning {
	id: number;
	name: string;
	description: string;
	createDate: string;
	updateDate: string;
    startDate: string;
    endDate: string;
	profile: Profile;
    employees: Employees[];
    process: Process;
	tasks: Tasks[];
    planningData: PlanningData[];
}

interface Profile {
	id: number;
	name: string;
	description: string;
	createDate: string;
	updateDate: string;
}

interface Process {
	id: number;
	name: string;
	description: string;
	createDate?: string;
	updateDate?: string;
}

interface Employees {
    id: number;
    name: string;
    rut: string;
    description: string;
    createDate: string;
    updateDate: string;
  }

interface Tasks {
	id: number;
	name: string;
	description: string;
	createDate: string;
	updateDate: string;
}

interface PlanningData {
	name: string;
	description: string;
	startDate: string;
	endDate: string;
    employeeIds: number[];
    profileId: number;
}

const Planning: React.FC = () => {
	const baseURL = import.meta.env.VITE_API_URL;
	const [planning, setPlanning] = useState<Planning[]>([]);
	const [name, setName] = useState<string>("");
	const [description, setDescription] = useState<string>("");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
	const [profile, setProfile] = useState<Profile[]>([]);
	const [process, setProcess] = useState<Process[]>([]);
    const [employees, setEmployee] = useState<Employees[]>([]);
	const [id, setId] = useState<number | null>(null);
    const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<number[]>([]);
	const [selectedProfileId, setSelectedProfileId] = useState<number>(0);
	const [title, setTitle] = useState<string>("");
	const modalRef = useRef<HTMLDivElement | null>(null);
	const [pendingRequests, setPendingRequests] = useState<number>(0);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);


	useEffect(() => {
		getPlanning();
		getProfiles();
		getProcess();
		getEmployees();
		if (modalRef.current) {
			modalRef.current.addEventListener("hidden.bs.modal", handleModalHidden);
		}
		return () => {
			if (modalRef.current) {
				modalRef.current.removeEventListener("hidden.bs.modal", handleModalHidden);
			}
		};
	}, []);

	const getPlanning = async () => {
		setPendingRequests(prev => prev + 1);
		try {
			const response: AxiosResponse<Planning[]> = await axios.get(`${baseURL}/planning/`);
			setPlanning(response.data);
		} catch (error) {
			showAlert("Error al obtener la Planning", "error");
		} finally {
			setPendingRequests(prev => prev - 1);  
		}
	};

	const getProfiles = async () => {
		setPendingRequests(prev => prev + 1);
		try {
			const response: AxiosResponse<Profile[]> = await axios.get(`${baseURL}/profile/`);
			setProfile(response.data);
		} catch (error) {
			showAlert("Error al obtener los perfiles", "error");
		} finally {
			setPendingRequests(prev => prev - 1);  
		}
	};

	const getProcess = async () => {
		setPendingRequests(prev => prev + 1);
		try {
			const response: AxiosResponse<Process[]> = await axios.get(`${baseURL}/process/`);
			setProcess(response.data);
		} catch (error) {
			showAlert("Error al obtener los procesos", "error");
		} finally {
			setPendingRequests(prev => prev - 1);  
		}
	};

	const getEmployees = async () => {
		setPendingRequests(prev => prev + 1);
		try {
			const response: AxiosResponse<Employees[]> = await axios.get(`${baseURL}/employee/`);
			setEmployee(response.data);
		} catch (error) {
			showAlert("Error al obtener los Empleados", "error");
		} finally {
			setPendingRequests(prev => prev - 1);  
		}
	};

	const openModal = (op: string, planning?: Planning) => {
		if (op === "1") {
			setId(null);
			setName("");
			setDescription("");
			setSelectedEmployeeIds([]);
			setSelectedProfileId(0);
			setStartDate("");
			setEndDate("");
			setTitle("Crear Nueva Planificación");
		} else if (op === "2" && planning) {
			setId(planning.id);
			setName(planning.name);
			setDescription(planning.description);
			setSelectedEmployeeIds(planning.employees.map((emp) => emp.id));
			setSelectedProfileId(planning.profile.id);
			setStartDate(planning.startDate);
			setEndDate(planning.endDate);
			setTitle("Editar Planificación");
		}
	
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

	const validar = (): void => {
		if (name.trim() === "") {
			showAlert("Escribe Nombre de la Planificación", "warning");
			return;
		}
		if (description.trim() === "") {
			showAlert("Escribe la descripción del perfil", "warning");
			return;
		}
		if (startDate === "") {
			showAlert("Selecciona la fecha de inicio", "warning");
			return;
		}
		if (endDate === "") {
			showAlert("Selecciona la fecha de fin", "warning");
			return;
		}
		if (selectedProfileId === 0) {
			showAlert("Selecciona un tipo de proceso", "warning");
			return;
		}
		if (selectedEmployeeIds.length === 0) {
			showAlert("Selecciona al menos un empleado", "warning");
			return;
		}

		setLoading(true);
	
		const formattedStartDate = new Date(startDate).toISOString().split("T")[0];
		const formattedEndDate = new Date(endDate).toISOString().split("T")[0];
	
		const parametros: PlanningData = {
			name: name.trim(),
			description: description.trim(),
			startDate: formattedStartDate,
			endDate: formattedEndDate,
			employeeIds: selectedEmployeeIds,
			profileId: selectedProfileId,
		};
	
		const metodo: "PUT" | "POST" = id ? "PUT" : "POST";
		enviarSolicitud(metodo, parametros);
	};
	
	

	const enviarSolicitud = async (method: "POST" | "PUT", data: PlanningData) => {
		setLoading(true);
		try {
			const url = method === "PUT" && id ? `${baseURL}/planning/${id}` : `${baseURL}/planning/`;
			const response = await axios({
				method,
				url,
				data,
				headers: { "Content-Type": "application/json" },
			});
	
			const newPlanning = response.data;
			showAlert("Operación realizada con éxito", "success");
	
			if (method === "POST") {
				setPlanning((prev) => [...prev, newPlanning]);
			} else if (method === "PUT") {
				setPlanning((prev) =>
					prev.map((plan) => (plan.id === newPlanning.id ? newPlanning : plan))
				);
			}
	
			if (modalRef.current) {
				const modal = bootstrap.Modal.getInstance(modalRef.current);
				modal?.hide();
			}
		} catch (error) {
			if (axios.isAxiosError(error) && error.response) {
				showAlert(
					`Error: ${error.response.data.message || "No se pudo completar la solicitud."}`,
					"error"
				);
			} else {
				showAlert("Error al realizar la solicitud", "error");
			}
		} finally {
			setLoading(false);
		}
	};
	
	

	const deletePlanning = async (id: number) => {
		setLoading(true);
		try {
			const response = await axios.delete(`${baseURL}/planning/${id}`, {
				headers: { "Content-Type": "application/json" },
			});
	
			if (response.status === 200) {
				Swal.fire("Planificación eliminada correctamente", "", "success");
				getPlanning(); 
			} else {
				throw new Error("No se pudo eliminar la planificación");
			}
		} catch (error) {
			Swal.fire({
				title: "Error",
				text: "Error al eliminar la Planificación. Verifica si hay dependencias.",
				icon: "error",
				confirmButtonText: "OK",
			});
			console.error("Error al eliminar la planificación:", error);
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

	const handleHazzardSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedOptions = Array.from(event.target.selectedOptions, (option) =>
			Number(option.value)
		);
		setSelectedEmployeeIds(selectedOptions);
	};

	const formatDate = (dateString: string) => {
		return dateString.split("T")[0];
	};

	const opcionesEmpleados = employees.map((emp) => ({
		value: emp.id,
		label: `${emp.rut} - ${emp.name}`,
	}));
	
    

	return (
		<div className="App">
			<div className="container-fluid">
				<div className="row mt-3">
					<div className="col-12">
						<div className="tabla-contenedor">
							<EncabezadoTabla title="Planificación" onClick={() => openModal("1")} />
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
											<th>N°</th>
											<th>Perfiles</th>
											<th className="w-50">Rut-Empleados</th>
											<th>Fecha de Inicio</th>
											<th>Fecha de Fin</th>
											<th>Acciones</th>
										</tr>
									</thead>
									<tbody className="table-group-divider">
										{planning.map((plan, i) => (
											<tr key={JSON.stringify(plan)} className="text-center">
												<td>{i + 1}</td>
												<td>{plan.profile?.name}</td>
												<td className="text-start">
													<ul className="list-unstyled">
														{plan.employees?.map((emp) => (
															<li key={emp.id}>
																<table className="w-100">
																	<tbody>
																		<tr>
																			<td className="text-start w-25">{emp.rut}</td>
																			<td className="text-start w-45">{emp.name}</td>
																		</tr>
																	</tbody>
																</table>
															</li>
														))}
													</ul>
												</td>
												<td>{formatDate(plan.startDate)}</td>
												<td>{formatDate(plan.endDate)}</td>
												<td className="text-center">
													<OverlayTrigger placement="top" overlay={renderEditTooltip({})}>
														<button
															onClick={() => openModal("2", plan)}
															className="btn btn-custom-editar m-2"
														>
															<i className="fa-solid fa-edit"></i>
														</button>
													</OverlayTrigger>
													<OverlayTrigger placement="top" overlay={renderDeleteTooltip({})}>
														<button
															className="btn btn-custom-danger"
															onClick={() => deletePlanning(plan.id)}
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
								<div className="input-group mb-3">
									<span className="input-group-text">
										<i className="fa-solid fa-id-badge"></i>
									</span>
									<input
										type="text"
										className="form-control"
										placeholder="Nombre de la Planificación"
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
										placeholder="Descripción de la Planificación"
										value={description}
										onChange={(e) => setDescription(e.target.value)}
									/>
								</div>
								<div className="mb-3">
									<label htmlFor="profile" className="form-label">
										Perfiles:
									</label>
									<select
										id="profile"
										className="form-select"
										value={selectedProfileId}
										onChange={(e) => setSelectedProfileId(Number(e.target.value))}
									>
										<option value={0}>Selecciona...</option>
										{profile.map((prof) => (
											<option key={JSON.stringify(prof)} value={prof.id}>
												{prof.name}
											</option>
										))}
									</select>
								</div>
								<div className="form-group mt-3">
									<label htmlFor="empleados">Empleados:</label>
									<Select
										isMulti
										value={opcionesEmpleados.filter((option) =>
											selectedEmployeeIds.includes(option.value)
										)}
										onChange={(selectedOptions) => {
											const selectedIds = selectedOptions.map((option) => Number(option.value));
											setSelectedEmployeeIds(selectedIds as number[]);
										}}
										options={opcionesEmpleados}
									/>
								</div>

								<div className="input-group mt-3">
									<span className="input-group-text">
										<label htmlFor="empleados">
											<i className="fa-solid fa-calendar-alt"></i> Fecha Inicio:
										</label>
									</span>
									<input
										type="date"
										className="form-control"
										placeholder="Fecha de inicio"
										value={startDate}
										onChange={(e) => setStartDate(e.target.value)}
									/>
								</div>

								<div className="input-group mt-3">
									<span className="input-group-text">
										<label htmlFor="empleados">
											<i className="fa-solid fa-calendar-alt mr-1"></i> Fecha Final:
										</label>
									</span>
									<input
										type="date"
										className="form-control"
										placeholder="Fecha de fin"
										value={endDate}
										onChange={(e) => setEndDate(e.target.value)}
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

export default Planning;