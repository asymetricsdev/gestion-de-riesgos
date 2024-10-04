import React, { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { showAlert } from "../functions";
import { useDropzone } from "react-dropzone";
import Card from "react-bootstrap/Card";
import { OverlayTrigger, Tooltip, Breadcrumb } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import DangerHead from "../DangerHead/DangerHead";
import "./ColaboradorEjecutarTarea.css";

interface TaskType {
	id: number;
	name: string;
	description: string;
	createDate: string;
	updateDate: string;
}

interface CheckerType {
	id: number;
	name: string;
	description: string;
	createDate: string;
	updateDate: string;
}

interface Checkpoint {
	id: number;
	name: string;
	description: string;
	createDate: string;
	updateDate: string;
	checker: {
		id: number;
		name: string;
	};
}

interface Checker {
	id: number;
	name: string;
	description: string;
	createDate: string;
	updateDate: string;
	checkerType: CheckerType;
	task: {
		id: number;
		name: string;
	};
	checkpoints: Checkpoint[];
}

interface Task {
	id: number;
	name: string;
	description: string;
	createDate: string;
	updateDate: string;
	version: string;
	extension: string;
	taskType: TaskType;
	checker: Checker;
}

interface Colaboradores {
	id: number;
	name: string;
	rut: string;
	position: {
	name: string;
	};
}

const ColaboradorEjecutarTarea: React.FC = () => {
	const baseURL = import.meta.env.VITE_API_URL;
	const { empId, taskId } = useParams<{ empId: string; taskId: string }>();
	const [tasks, setTasks] = useState<Task | null>(null);
	const [colaboradores, setColaboradores] = useState<Colaboradores | null>(null);
	const { getRootProps, getInputProps, isDragActive } = useDropzone();
	const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
	const [file, setFile] = useState<File[]>([]);
	const [isEditMode, setIsEditMode] = useState(false);
	const { id } = useParams<{ id: string }>();

	useEffect(() => {
		console.log(`empId: ${empId}`);
		getColaborador();
		getTask();
	}, [empId, taskId]);

	const getColaborador = async () => {
		try {
			const response: AxiosResponse<Colaboradores> = await axios.get(
				`${baseURL}/employee/${empId}`
			);
			console.log("Colaborador obtenido:", response.data);
			setColaboradores(response.data);
		} catch (error) {
			showAlert("Error al obtener los datos del colaborador", "error");
		}
	};

	const getTask = async () => {
		try {
			const response: AxiosResponse<Task> = await axios.get(`${baseURL}/task/${taskId}`);
			console.log("Tarea Obtenido:", response.data);
			setTasks(response.data);
		} catch (error) {
			showAlert("Error al obtener las tareas del colaborador", "error");
		}
	};

	const eliminarImagen = () => {
		setFile([]);
		setUploadedImageUrl(null);
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

	return (
		<div className="App">
			<div className="container-fluid">
				<div className="row mt-3">
					<div className="col-12">
						<div className="modulo-titulo-tarea">
							<h1>Modulo de Tarea: {tasks?.description}</h1>
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
													<span className="delete-icon" onClick={eliminarImagen}>
														&#10006;
													</span>
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
								<tr className="text-center">
									<td>xxxxxx</td>
									<td>xxxxxxxxxx</td>
									<td>xxxxxxxxxx</td>
									<td>xxxxxxxx</td>
									<td>
										<div className="">
											<OverlayTrigger placement="top" overlay={renderDescargarArchivoTooltip({})}>
												<button className="btn btn-custom-tareas m-2">
													<i className="fa-solid fa-file-arrow-down"></i>
												</button>
											</OverlayTrigger>
										</div>
									</td>
								</tr>
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
									<th>Descripción</th>
									<th>Verificadores</th>
									<th>Última Ejecución</th>
									<th>Empleado</th>
									<th>Estado Actual</th>
									<th>Nuevo Estado</th>
								</tr>
							</thead>
							<tbody className="table-group-divider">
								{tasks?.checker.checkpoints && tasks.checker.checkpoints.length > 0 ? (
									<tr className="text-center">
										<td></td>
										<td>{tasks.checker.checkpoints[0].name}</td>
										<td></td>
										<td>{tasks.checker.name}</td>
										<td></td>
										<td>{colaboradores?.name}</td>
										<td>Estado Actual</td>
										<td>Nuevo Estado</td>
									</tr>
								) : (
									<tr>
										<td colSpan={8}>No hay items disponibles para esta tarea.</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
					<div className="d-flex justify-content-end">
						{(tasks?.checker?.checkpoints ?? []).length > 0 ? (
							<>
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
							</>
						) : (
							<>
								<OverlayTrigger placement="top" overlay={renderEjecutarTooltip({})}>
									<button className="btn btn-custom-tareas m-2" disabled>
										<i className="fa-solid fa-eject"></i>
									</button>
								</OverlayTrigger>
								<OverlayTrigger placement="top" overlay={renderCancelarEjecutarTooltip({})}>
									<button className="btn btn-custom-tareas m-2" disabled>
										<i className="fa-solid fa-rectangle-xmark"></i>
									</button>
								</OverlayTrigger>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ColaboradorEjecutarTarea;
