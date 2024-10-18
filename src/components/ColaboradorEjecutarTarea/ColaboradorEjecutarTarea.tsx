import React, { useEffect, useState } from "react";
import axios, { AxiosResponse, AxiosError } from "axios";
import { showAlert } from "../functions";
import { useDropzone } from "react-dropzone";
import { useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";
import { OverlayTrigger, Tooltip, Breadcrumb, ProgressBar } from "react-bootstrap";
import { Link } from "react-router-dom";
import DangerHead from "../DangerHead/DangerHead";
import Swal from "sweetalert2";
import "./ColaboradorEjecutarTarea.css";

interface TaskExecution {
	id: number;
	executedAt: string;
	employee: Employee;
	task: Task;
	checker: Checker;
	planning: Planning;
	files: FileData[];
	checkpointExecutions: {
		id: number;
		executedAt: string;
		checkpoint: {
			id: number;
			name: string;
		};
		status: {
			id: number;
			name: string;
		};
		lastExecution: string;
	}[];
	completion: number;
}

interface Checkpoint {
	id: number;
	name: string;
	completion: boolean;
}

interface Task {
	id: number;
	name: string;
	description?: string;
}

interface Checker {
	id: number;
	name: string;
}

interface Status {
	id: number;
	name: string;
}

interface Planning {
	id: number;
	name: string;
	description?: string;
}

interface Employee {
	id: number;
	name: string;
	rut?: string;
	position?: {
		name: string;
	};
}

interface FileData {
	id: number;
	executedAt: string;
	fileName: string;
	mimeType: string;
	createDate?: string;
	updateDate?: string;
	content?: string;
	fileExtension?: string;
}

interface ResponseData {
	message: string;
}

const ColaboradorEjecutarTarea: React.FC = () => {
	const baseURL = import.meta.env.VITE_API_URL;
	const { empId, taskId } = useParams<{ empId: string; taskId: string }>();
	const [taskExecution, setTaskExecution] = useState<TaskExecution | null>(null);
	const [status, setStatus] = useState<Status[]>([]);
	const [selectedStatus, setSelectedStatus] = useState<Record<number, number>>({});
	const [checkerId, setCheckerId] = useState<number | null>(null);
	const [progressCompletion, setProgressCompletion] = useState<number>(0);
	const [title, setTitle] = useState<string>("");
	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop: (acceptedFiles) => handleFileUpload(acceptedFiles),
	});
	const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

	const { id } = useParams<{ id: string }>();

	useEffect(() => {
		console.log(`empId: ${empId}`);
		getTaskExecutionData();
		getStatus(2);
	}, [empId, taskId]);

	//LLENAMOS LA TABLA DE EJECUCION DE CHECKPOINTS
	const getTaskExecutionData = async () => {
		try {
			const response = await axios.get(`${baseURL}/task/${taskId}/executions?employeeId=${empId}`);
			console.log("Datos de ejecución obtenidos desde getTaskExecutionData:", response.data);

			setTaskExecution(response.data);

			// Si existen ejecuciones de checkpoints
			if (response.data.checkpointExecutions && response.data.checkpointExecutions.length > 0) {
				setTitle(response.data.task.name);

				// Calcular el progreso basado en las ejecuciones de los checkpoints
				const totalCheckpoints = response.data.checkpointExecutions.length;

				// Filtrar checkpoints completados (en este caso, con el estado "Asiste")
				const completedCheckpoints = response.data.checkpointExecutions.filter(
					(checkpoint: any) => checkpoint.status.name === "Asiste"
				).length;

				// Calcular el porcentaje de progreso
				const progress = (completedCheckpoints / totalCheckpoints) * 100;

				// Asignar el progreso al estado
				setProgressCompletion(progress);
			}
		} catch (error) {
			showAlert("Error al obtener los datos de ejecución de la tarea", "error");
		}
	};

	const getStatus = async (taskTypeId: number) => {
		try {
			const response: AxiosResponse<Status[]> = await axios.get(
				`${baseURL}/status/taskType/${taskTypeId}` // TaskType ID específico para Capacitación
			);
			console.log("Datos de ejecución obtenidos desde Status:", response.data);
			setStatus(response.data); // Guardar los estados en el estado de React
		} catch (error) {
			showAlert("Error al obtener los estados", "error");
		}
	};

	//CARGA DE ARCHIVO
	const handleFileUpload = async (files: File[]) => {
		if (files.length === 0) return;

		// Verificar el tamaño del archivo
		const maxSizeInMB = 20;
		const maxSizeInBytes = maxSizeInMB * 1024 * 1024; // Convertir MB a Bytes

		// Validar si el tamaño del archivo excede el límite
		if (files[0].size > maxSizeInBytes) {
			Swal.fire("Error", `El archivo debe ser menor a ${maxSizeInMB} MB.`, "error");
			return;
		}

		// Verificar los valores que estás utilizando
		console.log("Iniciando subida de archivo...");
		console.log("Files: ", files);
		console.log("TaskExecution: ", taskExecution);
		console.log("CheckerId: ", taskExecution?.checker?.id);
		console.log("PlanningId: ", taskExecution?.planning?.id);

		const formData = new FormData();
		formData.append("file", files[0]); // Subir un archivo
		formData.append("taskId", taskId!);
		formData.append("employeeId", empId!);

		// Validar que taskExecution y planning existan antes de acceder a planningId
		let planningId: string | undefined;
		if (taskExecution && taskExecution.planning && taskExecution.planning.id) {
			planningId = taskExecution.planning.id.toString();
			formData.append("planningId", planningId);
		} else {
			console.error("Planning ID no está disponible.");
		}

		// Validar si checkerId está disponible
		if (taskExecution && taskExecution.checker && taskExecution.checker.id) {
			const checkerId = taskExecution?.checker?.id.toString();
			formData.append("checkerId", checkerId);
		} else {
			console.error("Checker ID no está disponible.");
		}

		try {
			const response: AxiosResponse<TaskExecution> = await axios.post(
				`${baseURL}/task/upload/executionFile`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);
			setTaskExecution(response.data);
			setUploadedFiles(files);
			Swal.fire("Éxito", "Archivo subido correctamente", "success");
		} catch (error) {
			const axiosError = error as AxiosError;
			if (axiosError.response) {
				console.error("Detalles del error:", axiosError.response.data);
				const errorMessage = (axiosError.response.data as any)?.message || "Error desconocido";
				Swal.fire("Error", errorMessage, "error");
			} else {
				console.error("Error sin respuesta del servidor:", axiosError.message);
				Swal.fire("Error", "Hubo un problema al subir el archivo", "error");
			}
		}
	};

	//MODIFICAMOS EL ESTADO DEL SELECT
	const handleStatusChange = (checkpointId: number, newStatusId: string) => {
		console.log("Checkpoint ID:", checkpointId);
		console.log("New Status ID:", newStatusId);
		const statusIdNumber = Number(newStatusId);
		if (!isNaN(statusIdNumber)) {
			// Actualizamos el estado con el checkpoint ID y su nuevo estado
			setSelectedStatus((prev) => ({ ...prev, [checkpointId]: statusIdNumber }));
			console.log(
				`Estado actualizado para el checkpoint ${checkpointId}: Nuevo estado ID ${statusIdNumber}`
			);
		} else {
			console.error(`Error: ID de estado inválido (${newStatusId})`);
		}
	};

	
	 const saveCheckpointExecution = async () => {
		// Generar el arreglo dataToSend basado en selectedStatus
		const dataToSend = Object.entries(selectedStatus).map(([checkpointId, statusId]) => ({
			checkpointId: Number(checkpointId),
			statusId: Number(statusId),
		}));

		// Verificar si dataToSend está vacío o no
		if (!dataToSend || dataToSend.length === 0) {
			showAlert("No se ha seleccionado ningún estado.", "warning");
			return;
		}

		console.log("Datos a enviar:", dataToSend);

		try {
			const response = await axios.post(
				`${baseURL}/task/update/checkpointExecutions?taskId=${taskId}&employeeId=${empId}`,
				dataToSend,
				{ headers: { "Content-Type": "application/json" } }
			);
			showAlert("Datos guardados correctamente", "success");

			// Recalcular el progreso después de la actualización
			await getTaskExecutionData(); // Llama a la función para obtener los datos de ejecución nuevamente
		} catch (error) {
			const axiosError = error as AxiosError;
			if (axiosError.response) {
				console.error("Detalles del error:", axiosError.response.data);
				const errorMessage =
					(axiosError.response.data as ResponseData)?.message || "Error desconocido";
				showAlert(`Error: ${errorMessage}`, "error");
			} else {
				console.error("Error sin respuesta del servidor:", axiosError.message);
				showAlert(`Error sin respuesta del servidor: ${axiosError.message}`, "error");
			}
		}
	};
 

	const renderEjecutarTooltip = (props: React.HTMLAttributes<HTMLDivElement>) => (
		<Tooltip id="button-tooltip-edit" {...props}>
			Ejecutar
		</Tooltip>
	);

	// DESCARGAR ARCHIVO
	const downloadFile = async (fileUrl: string, fileName: string, mimeType: string) => {
		try {
			const response = await axios.get(fileUrl, {
				responseType: "json",
			});

			const base64Data = response.data.content;
			if (!base64Data) {
				Swal.fire({
					title: "Error",
					text: "No se pudo obtener el archivo para descargar.",
					icon: "error",
					confirmButtonText: "OK",
				});
				return;
			}

			// Decodificamos la cadena Base64 y creamos un Blob para el archivo
			const byteCharacters = atob(base64Data);
			const byteNumbers = new Array(byteCharacters.length);
			for (let i = 0; i < byteCharacters.length; i++) {
				byteNumbers[i] = byteCharacters.charCodeAt(i);
			}
			const byteArray = new Uint8Array(byteNumbers);
			const blob = new Blob([byteArray], { type: "image/png" });

			// Creamos un enlace de descarga para el archivo
			const link = document.createElement("a");
			link.href = window.URL.createObjectURL(blob);
			link.setAttribute("download", fileName);
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

			// Liberamos el objeto URL creado
			window.URL.revokeObjectURL(link.href);
		} catch (error) {
			Swal.fire({
				title: "Error",
				text: "Hubo un error al descargar el archivo.",
				icon: "error",
				confirmButtonText: "OK",
			});
		}
	};

	function formatDate(date: string | null | undefined): string {
		if (!date) return "Sin fecha";
		const parsedDate = new Date(date);
		return parsedDate.toLocaleDateString();
	}

	function WithLabelExample() {
		const now = 60;
		return <ProgressBar now={now} label={`${now}%`} />;
	}

	return (
		<div className="App">
			<div className="container-fluid">
				<div className="row mt-3">
					<div className="col-12">
						<div className="modulo-titulo-tarea">
							<h2 className="text-center">Ejecutar Tarea: {title}</h2>
						</div>
						<div className="card-contenedor">
							<Card className="card">
								<Card.Body>
									<Card.Title>Cargar Archivo</Card.Title>
									<div className="container">
										<div className="col-md-12">
											<div className="dropzone" {...getRootProps()}>
												<input {...getInputProps()} />
												{isDragActive ? (
													<p>Suelta el archivo aquí ...</p>
												) : (
													<p>Arrastra y suelta un archivo aquí, o haz clic para seleccionar uno.</p>
												)}
											</div>
											{uploadedFiles.length > 0 && (
												<div className="mt-3">
													<p>Archivo subido: {uploadedFiles[0].name}</p>
												</div>
											)}
										</div>
									</div>
								</Card.Body>
							</Card>
						</div>
					</div>

					{/* Breadcrumb */}
					<div className="migas-pan-contenedor">
						<Breadcrumb>
							<Breadcrumb.Item
								className="breadcrumb-link"
								linkAs={Link}
								linkProps={{ to: `/tarea-colaborador/${empId}` }}
							>
								Tarea Colaborador
							</Breadcrumb.Item>
							<Breadcrumb.Item active>Ejecutar Tarea Colaborador</Breadcrumb.Item>
						</Breadcrumb>
					</div>
					{/* Historial de Archivos */}
					<div className="tabla-contenedor-matriz">
						<DangerHead title="Historial de Archivos" />
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
									<th>Nombre de Archivo</th>
									<th>Tipo de Archivo</th>
									<th>Fecha Subida</th>
									<th>Descargar Archivo</th>
								</tr>
							</thead>
							<tbody className="table-group-divider">
								{taskExecution?.files.map((file, index) => (
									<tr key={file.id}>
										<td>{index + 1}</td>
										<td>{file.fileName}</td>
										<td>{file.mimeType}</td>
										<td>{formatDate(file.executedAt)}</td>
										<td>
											<OverlayTrigger
												overlay={
													<Tooltip id={`tooltip-download-${file.id}`}>Descargar Archivo</Tooltip>
												}
											>
												<button
													onClick={() =>
														downloadFile(
															`https://testbackend-433922.uk.r.appspot.com/api/task/download/executionFile?fileId=${file.id}`,
															file.fileName,
															file.mimeType
														)
													}
													className="btn btn-custom-descargar m-2"
												>
													<i className="fa-solid fa-download"></i>
												</button>
											</OverlayTrigger>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					{/* Progreso de la Tarea */}
					<div className="mb-3 mt-3">
						<h5>Progreso de la Tarea</h5>
						{/* Barra de progreso animada */}
						{taskExecution && (
							<ProgressBar animated now={taskExecution.completion} label={`${taskExecution.completion}%`} />
						)}
					</div>
					{/* Ejecutar Items */}
					<div className="tabla-contenedor-matriz">
						<DangerHead title="Ejecutar Checkpoints" />
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
									<th>Items</th>
									<th>Última Ejecución</th>
									<th>Estado Actual</th>
									<th>Nuevo Estado</th>
								</tr>
							</thead>
							<tbody>
								{taskExecution && taskExecution.checkpointExecutions.length > 0 ? (
									taskExecution.checkpointExecutions.map((checkpoint, index) => (
										<tr key={checkpoint.id}>
											<td>{index + 1}</td>
											<td>{checkpoint.checkpoint.name}</td>
											<td>{formatDate(checkpoint.executedAt)}</td>
											<td>{checkpoint.status.name}</td>
											<td>
												<select
													className="form-select"
													onChange={(e) =>
														handleStatusChange(checkpoint.checkpoint.id, e.target.value)
													}
													defaultValue={selectedStatus[checkpoint.checkpoint.id] || ""}
												>
													<option value="" disabled>
														Seleccionar Estado
													</option>
													{status.map((s) => (
														<option key={s.id} value={s.id}>
															{s.name}
														</option>
													))}
												</select>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan={5} className="text-center">
											No hay datos disponibles
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
					<div className="d-flex justify-content-end">
						<OverlayTrigger placement="top" overlay={renderEjecutarTooltip({})}>
							<button className="btn btn-custom-tareas m-2" onClick={saveCheckpointExecution}>
								<i className="fa-solid fa-eject"></i>
							</button>
						</OverlayTrigger>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ColaboradorEjecutarTarea;
