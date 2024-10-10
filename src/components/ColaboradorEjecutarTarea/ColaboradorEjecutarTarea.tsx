import React, { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { showAlert } from "../functions";
import { useDropzone } from "react-dropzone";
import Card from "react-bootstrap/Card";
import { OverlayTrigger, Tooltip, Breadcrumb } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import DangerHead from "../DangerHead/DangerHead";
import Swal from "sweetalert2";
import "./ColaboradorEjecutarTarea.css";


interface TaskExecution {
	id: number;
	createDate: string;
	updateDate: string;
	createdAt: string;
	executedAt: string;
	checkpoint: Checkpoint;
	employee: Colaboradores;
	task: Task;
	checker: Checker;
	planning: Planning;
	files: FileData[];

}

interface Checkpoint {
	id: number;
	name: string;
}

interface Task {
	id: number;
	name: string;
	description: string;
}

interface Checker {
	id: number;
	name: string;
	checkpoints: Checkpoint[];
}

interface Status {
	id: number;
	name: string;
}

interface Planning {
	id: number;
	name: string;
	description: string;
}
interface Colaboradores {
	id: number;
	name: string;
	rut: string;
	position: {
	name: string;
	};
}

interface FileData {
	id: number;
    createDate : string;
    updateDate: string;
    executedAt: string;
    fileName: string;
    mimeType: string;
    content: string;
	fileExtension: string;
}

const ColaboradorEjecutarTarea: React.FC = () => {
	const baseURL = import.meta.env.VITE_API_URL;
	const { empId, taskId } = useParams<{ empId: string; taskId: string }>();
	const [tasks, setTasks] = useState<TaskExecution[] | null>(null);
	const [status, setStatus] = useState<Status[]>([]);
	const [title, setTitle] = useState<string>("");
	const [colaboradores, setColaboradores] = useState<Colaboradores | null>(null);
	const { getRootProps, getInputProps, isDragActive } = useDropzone();
	const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
	const [isEditMode, setIsEditMode] = useState(false);
	const { id } = useParams<{ id: string }>();

	useEffect(() => {
		console.log(`empId: ${empId}`);
		getColaborador();
		getTaskExecutionData();
		getStatus(2);
	}, [empId, taskId]);

	const getTaskExecutionData = async () => {
		try {
			const response = await axios.get(`${baseURL}/task/${taskId}/executions?employeeId=${empId}`);
			console.log("Datos de ejecución obtenidos desde getTaskExecutionData:", response.data);
			setTasks(response.data);
			// Verificamos si hay tareas y establecemos el título
			if (response.data && response.data.length > 0) {
				setTitle(response.data[0].task.name); // Establecer el título usando el nombre de la tarea
			}
		} catch (error) {
			showAlert("Error al obtener los datos de ejecución de la tarea", "error");
		}
	};

	const getColaborador = async () => {
		try {
			const response: AxiosResponse<Colaboradores> = await axios.get(
				`${baseURL}/employee/${empId}`
			);
			setColaboradores(response.data);
		} catch (error) {
			showAlert("Error al obtener los datos del colaborador", "error");
		}
	};

	const getStatus = async (taskTypeId: number) => {
		try {
			const response: AxiosResponse<Status[]> = await axios.get(
				`${baseURL}/status/taskType/${taskTypeId}` // TaskType ID específico para Capacitación
			);
			setStatus(response.data); // Guardar los estados en el estado de React
		} catch (error) {
			showAlert("Error al obtener los estados", "error");
		}
	};


	const renderSubirArchivoTooltip = (props: React.HTMLAttributes<HTMLDivElement>) => (
		<Tooltip id="button-tooltip-edit" {...props}>
			Subir Archivo
		</Tooltip>
	);

	const renderDescargarArchivoTooltip = (props: React.HTMLAttributes<HTMLDivElement>) => (
		<Tooltip id="button-tooltip-edit" {...props}>
			Descargar Archivo
		</Tooltip>
	);

	const renderCancelarEjecutarTooltip = (props: React.HTMLAttributes<HTMLDivElement>) => (
		<Tooltip id="button-tooltip-edit" {...props}>
			Cancelar
		</Tooltip>
	);

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
											{!isEditMode && (
												<div className="dropzone" {...getRootProps()}>
													<input {...getInputProps()} />
													{isDragActive ? (
														<p>Carga los archivos acá ...</p>
													) : (
														<p>Puede arrastrar y soltar archivos aquí para añadirlos</p>
													)}
													<div>
														<br />
														<p className="text-parrafo-dropzone mt-1">
															Tamaño máximo de archivo: 500kb, número máximo de archivos: 2
														</p>
													</div>
												</div>
											)}

											{uploadedImageUrl && (
												<div className="uploaded-image-preview">
													<img src={uploadedImageUrl} alt="Vista previa" />
													<span className="delete-icon">&#10006;</span>
												</div>
											)}
										</div>
									</div>
									<div className="d-flex justify-content-end mt-3">
										<OverlayTrigger placement="top" overlay={renderSubirArchivoTooltip({})}>
											<button className="btn btn-custom-tareas m-2">
												<i className="fa-solid fa-file-arrow-up"></i>
											</button>
										</OverlayTrigger>
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
									<th>Nombre de Archivo</th>
									<th>Tipo de Archivo</th>
									<th>Fecha Subida</th>
									<th>Descargar Archivo</th>
								</tr>
							</thead>
							<tbody className="table-group-divider">
								{tasks?.map((task, taskIndex) =>
									task?.files?.map((ce, fileIndex) => (
										<tr key={`${task.id}-${ce.id}`}>
											<td>{fileIndex + 1}</td>
											<td>{ce.fileName}</td>
											<td>{ce.mimeType}</td>
											<td>{formatDate(ce.createDate)}</td>
											<td>
												<OverlayTrigger
													overlay={
														<Tooltip id={`tooltip-download-${ce.id}`}>Descargar Archivo</Tooltip>
													}
												>
													<button
														onClick={() =>
															downloadFile(
																`https://testbackend-433922.uk.r.appspot.com/api/task/downloadFile?fileId=${ce.id}`,
																ce.fileName,
																ce.mimeType
															)
														}
														className="btn btn-custom-descargar m-2"
													>
														<i className="fa-solid fa-download"></i>
													</button>
												</OverlayTrigger>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>

					{/* Ejecutar Items */}
					<div className="tabla-contenedor-matriz">
						<DangerHead title="Ejecutar Items" />
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
									<th>Empleado</th>
									<th>Planificación</th>
									<th>Verificador</th>
									<th>Última Ejecución</th>
									<th>Estado Actual</th>
									<th>Nuevo Estado</th>
								</tr>
							</thead>
							<tbody>
								{tasks && tasks.length > 0 ? (
									tasks.map((task, taskIndex) => (
									task?.checker?.checkpoints?.map((checkpoint, checkpointIndex) => (
										<tr key={`${task.id}-${checkpoint.id}`}>
										<td>{`${taskIndex + 1}.${checkpointIndex + 1}`}</td> 
										<td>{checkpoint?.name || "Sin nombre"}</td> 
										<td>{task?.employee?.name || "Sin empleado"}</td> 
										<td>{task?.planning?.name || "Sin planificación"}</td> 
										<td>{task?.checker?.name || "Sin verificador"}</td> 
										<td>{task?.executedAt ? formatDate(task.executedAt) : "Sin ejecución"}</td> 
										{/* <td>{task?.status?.name || "Sin estado"}</td> */} 

										<td><select className="form-select">
												{Array.isArray(status) && status.length > 0 ? (
													status.map((status) => (
														<option key={status.id} value={status.id}>
															{status.name} 
																</option>
														))
														) : (
														<option value="">Cargando estados...</option>
														)}
												</select>
</td>
										</tr>
									))
									))
								) : (
									<tr>
									<td colSpan={8} className="text-center">
										No hay ítems para ejecutar.
									</td>
									</tr>
								)}
    						</tbody>
						</table>
					</div>
					<div className="d-flex justify-content-end">
						<OverlayTrigger placement="top" overlay={renderEjecutarTooltip({})}>
							<button className="btn btn-custom-tareas m-2">
								<i className="fa-solid fa-eject"></i>
							</button>
						</OverlayTrigger>
						<OverlayTrigger placement="top" overlay={renderCancelarEjecutarTooltip({})}>
							<button className="btn btn-custom-tareas m-2">
								<i className="fa-solid fa-rectangle-xmark"></i>
							</button>
						</OverlayTrigger>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ColaboradorEjecutarTarea;
