
import { faCircleXmark, faDownload, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios, { AxiosResponse } from "axios";
import * as bootstrap from "bootstrap";
import { useCallback, useEffect, useRef, useState } from "react";
import { Accordion, OverlayTrigger, Spinner, Tooltip } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import Select from "react-select";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import EncabezadoTabla from "../EncabezadoTabla/EncabezadoTabla";
import { showAlert } from "../functions";
import "./Tareas.css";

const MySwal = withReactContent(Swal);

interface Tareas {
	id: number;
	name: string;
	description: string;
	version: string;
	fileExtension: string;
	file: string;
	base64: string;
	type: string;
	taskType: TaskType;
	checker: Checker;
}

interface TaskType {
	id: number;
	name: string;
	description: string;
	createDate?: string;
	updateDate?: string;
}

interface Checker {
	id: number;
	name: string;
	description: string;
	createDate: string;
	updateDate: string;
}

interface FileData {
	base64: string;
	type: string;
}

function Tareas() {
	const baseURL = import.meta.env.VITE_API_URL;
	const [tareas, setTareas] = useState<Tareas[]>([]);
	const [taskType, setTaskType] = useState<TaskType[]>([]);
	const [checker, setChecker] = useState<Checker[]>([]);
	const [isEditMode, setIsEditMode] = useState<boolean>(false);
	const modalRef = useRef<HTMLDivElement | null>(null);
	const [loading, setLoading] = useState<boolean>(false); 
  	const [pendingRequests, setPendingRequests] = useState<number>(0);
	const [id, setId] = useState<number>(0);
	const [name, setName] = useState<string>("");
	const [description, setDescription] = useState<string>("");
	const [version, setVersion] = useState<string>("");
	const [fileExtension, setFileExtension] = useState<string>("");
	const [file, setFile] = useState<FileData[]>([]);
	const [selectedTaskTypeId, setSelectedTaskTypeId] = useState<number>(0);
	const [selectedCheckerId, setSelectedCheckerId] = useState<number | null>(null);
	const [title, setTitle] = useState<string>("");
	const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
	const [uploadedFiles, setUploadedFiles] = useState<FileData[]>([]);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	useEffect(() => {
		getTareas();
		getTasksType();
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

	const getTareas = async () => {
		setPendingRequests(prev => prev + 1);
		try {
			const response: AxiosResponse<Tareas[]> = await axios.get(`${baseURL}/task/`);
			setTareas(response.data);
		} catch (error) {
			showAlert("Error al obtener Tareas", "error");
		} finally {
			setPendingRequests(prev => prev - 1);
		}
	};
	const getTasksType = async () => {
		setPendingRequests(prev => prev + 1);
		try {
			const response: AxiosResponse<TaskType[]> = await axios.get(`${baseURL}/task_type/`);
			setTaskType(response.data);
		} catch (error) {
			showAlert("Error al obtener la tarea", "error");
		} finally {
			setPendingRequests(prev => prev - 1);
		}
	};

	const getChecker = async () => {
		setPendingRequests(prev => prev + 1);
		try {
			const response: AxiosResponse<Checker[]> = await axios.get(`${baseURL}/checker/`);
			setChecker(response.data);
		} catch (error) {
			showAlert("Error al obtener las verificaciones", "error");
		} finally {
			setPendingRequests(prev => prev - 1); 
		}
	};

	const validarTamañoArchivo = (file: File): boolean => {
		const fileSizeInMB = file.size / (1024 * 1024);
		if (fileSizeInMB > 2) {
			showAlert("El archivo supera los 2 MB, por favor sube uno más pequeño", "warning");
			return false;
		}
		return true;
	};

	const enviarSolicitud = async (method: "POST" | "PUT", data: any) => {
		setLoading(true);
		try {
			const url = method === "PUT" && id ? `${baseURL}/task/${id}` : `${baseURL}/task/`;
			const response = await axios({
				method,
				url,
				data,
				headers: { "Content-Type": "application/json" },
			});

			showAlert("Operación realizada con éxito", "success");
			getTareas();
			if (modalRef.current) {
				const modal = bootstrap.Modal.getInstance(modalRef.current);
				modal?.hide();
			}
		} catch (error) {
			showAlert("Error al realizar la solicitud", "error");
		} finally {
			setLoading(false);
		}
	};

	const validar = (): void => {
		if (name.trim() === "") {
			showAlert("Escribe la tarea", "warning");
			return;
		}

		if (description.trim() === "") {
			showAlert("Escribe la descripción de la tarea", "warning");
			return;
		}

		if (version.trim() === "") {
			showAlert("Escribe la versión de la tarea", "warning");
			return;
		}

		if (!isEditMode && file.length === 0) {
			showAlert("Sube un archivo", "warning");
			return;
		}

		if (selectedTaskTypeId === 0) {
			showAlert("Selecciona un tipo de tarea", "warning");
			return;
		}
		if (!selectedCheckerId) {
			showAlert("Selecciona un verificador", "warning");
			return;
		}

		enviarSolicitud(isEditMode ? "PUT" : "POST", {
			id,
			name,
			description,
			version,
			file: file.length > 0 ? file[0].base64 : null,
			fileExtension,
			taskTypeId: selectedTaskTypeId.toString(),
			checkerId: selectedCheckerId,
		});
	};

	const deleteTarea = async (id: number) => {
		setLoading(true);
		try {
			await axios.delete(`${baseURL}/task/${id}`, {
				headers: { "Content-Type": "application/json" },
			});
			showAlert("Tarea eliminada correctamente", "success");
			setTareas((prevTareas) => prevTareas.filter((tarea) => tarea.id !== id));
		} catch (error) {
			if (axios.isAxiosError(error)) {
				// console.error("Servidor respondiendo:", error.response?.data);
			} else {
			}
			showAlert("Database error: could not execute statement; SQL [n/a]; constraint [null]; nested exception is org.hibernate.exception.ConstraintViolationException: could not execute statement", "error");
			
		} finally {
			setLoading(false);
		}
	};

	const openModal = (op: string, tarea?: Tareas) => {
		if (op === "1" ) {
		    setIsEditMode(true);
			setId(0);
			setName("");
			setDescription("");
			setVersion("");
			setSelectedTaskTypeId(0);
			setSelectedCheckerId(null);
			setFile([]);
			setUploadedImageUrl(null);
			setTitle("Registrar Tarea");
			setIsEditMode(false);
		} else if (op === "2" && tarea) {
			setId(tarea.id);
			setName(tarea.name);
			setDescription(tarea.description);
			setVersion(tarea.version);
			setSelectedTaskTypeId(tarea.taskType.id);
			setFile([{ base64: tarea.file, type: tarea.fileExtension }]);
			setUploadedImageUrl(`data:image/${tarea.fileExtension};base64,${tarea.file}`);
			setTitle("Editar Verificadores");
			setIsEditMode(true);
		}

		if (modalRef.current) {
			const modal = new bootstrap.Modal(modalRef.current);
			modal.show();
			setIsModalOpen(true);
		}
	};


	useEffect(() => {
		if (isModalOpen) {
		}
	}, [isModalOpen, isEditMode]);

	const handleModalHidden = () => {
		setIsModalOpen(false);
		const modals = document.querySelectorAll(".modal-backdrop");
		modals.forEach((modal) => modal.parentNode?.removeChild(modal));
	};



	const onDrop = useCallback((acceptedFiles: File[]) => {
		if (acceptedFiles.length > 0) {
			const file = acceptedFiles[0];
			if (!validarTamañoArchivo(file)) {
				return;
			}

			const reader = new FileReader();
			reader.onload = () => {
				const base64 = reader.result as string;
				const extension = extractFileExtension(base64);
				setFile([{ base64: removeBase64Prefix(base64), type: extension }]);
				setFileExtension(extension);
				setUploadedImageUrl(base64);
			};
			reader.readAsDataURL(file);
		}
	}, []);

	const eliminarImagen = () => {
		setFile([]);
		setUploadedImageUrl(null);
	};

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			"image/*": [".jpeg", ".jpg", ".png", ".gif"],
			"application/pdf": [".pdf"],
		},
	});

	const extractFileExtension = (base64: string): string => {
		const extensionMap: { [key: string]: string } = {
			"image/jpeg": "jpg",
			"image/png": "png",
			"application/pdf": "pdf",
		};
		const type = base64.split(";")[0].split(":")[1];
		return extensionMap[type] || "unknown";
	};

	const downloadFile = async (fileUrl: string, fileName: string, fileExtension: string) => {
		try {
			const response = await axios.get(fileUrl, {
				responseType: "json",
			});

			const base64Data = response.data.file;
			if (!base64Data) {
				Swal.fire({
					title: "Error",
					text: "No se pudo obtener el archivo para descargar.",
					icon: "error",
					confirmButtonText: "OK",
				});
				return;
			}

			const base64String = base64Data.split(",")[1] || base64Data;
			const byteCharacters = atob(base64String);
			const byteNumbers = new Array(byteCharacters.length);
			for (let i = 0; i < byteCharacters.length; i++) {
				byteNumbers[i] = byteCharacters.charCodeAt(i);
			}
			const byteArray = new Uint8Array(byteNumbers);
			const blob = new Blob([byteArray], { type: `application/${fileExtension}` });
			const link = document.createElement("a");
			link.href = window.URL.createObjectURL(blob);
			link.setAttribute("download", `${""}.${fileExtension}`);
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
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

	const removeBase64Prefix = (base64: string): string => {
		return base64
			.replace(/^data:image\/\w+;base64,/, "")
			.replace(/^data:application\/\w+;base64,/, "");
	};

	const opcionesVerificadores = checker
		? checker.map((sp) => ({
				value: sp.id,
				label: sp.name,
		  }))
		: [];


		const handleCheckerChange = (selectedOption: { value: number; label: string } | null) => {
			if (selectedOption) {
			  setSelectedCheckerId(selectedOption.value);
			} else {
			  setSelectedCheckerId(null); 
			}
		  };
		
		  const selectedOption = opcionesVerificadores.find(option => option.value === selectedCheckerId) || null;

	return (
		<div className="App">
			<div className="container-fluid">
				<div className="row mt-3">
					<div className="col-12">
						<div className="tabla-contenedor">
							<EncabezadoTabla title="Tareas" onClick={() => openModal("1")} />
						</div>
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
										<th>Tipo de Tarea</th>
										<th>Nombre</th>
										{/*<th>Descripción</th>*/}
										<th>Versión</th>
										<th>Verificadores</th>
										<th>Archivo</th>
										<th>Acciones</th>
									</tr>
								</thead>
								<tbody className="table-group-divider">
									{tareas && tareas.length > 0 ? (
										tareas.map((tr, i) => (
											<tr key={tr.id}>
												<td>{i + 1}</td>
												<td>{tr.taskType?.name || "N/A"}</td>
												<td>{tr.name}</td>
												{/*<td>{tr.description}</td>*/}
												<td>{tr.version}</td>
												<td>
													<Accordion>
														<Accordion.Item eventKey="0">
															<Accordion.Header>Verificadores</Accordion.Header>
															<Accordion.Body>
																<ul>{tr.checker ? tr.checker.name : "Sin Verificador"}</ul>
															</Accordion.Body>
														</Accordion.Item>
													</Accordion>
												</td>
												<td>
													<OverlayTrigger
														overlay={
															<Tooltip id={`tooltip-download-${tr.id}`}>Descargar Archivo</Tooltip>
														}
													>
														<button
															onClick={() =>
																downloadFile(
																	`${baseURL}/task/${tr.id}/download`,
																	tr.fileExtension,
																	tr.name
																)
															}
															className="btn btn-custom-descargar m-2"
														>
															<FontAwesomeIcon icon={faDownload} />
														</button>
													</OverlayTrigger>
												</td>
												<td>
													<OverlayTrigger placement="top" overlay={<Tooltip>Editar</Tooltip>}>
														<button
															className="btn btn-custom-editar m-2"
															onClick={() => openModal("2", tr)}
														>
															<FontAwesomeIcon icon={faPenToSquare} />
														</button>
													</OverlayTrigger>
													<OverlayTrigger placement="top" overlay={<Tooltip>Eliminar</Tooltip>}>
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
																		deleteTarea(tr.id);
																	}
																});
															}}
														>
															<FontAwesomeIcon icon={faCircleXmark} />
														</button>
													</OverlayTrigger>
												</td>
											</tr>
										))
									) : (
										<tr>
											<td colSpan={8}>No hay tareas disponibles</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
					)}
				</div>
			</div>

			<div
				className="modal fade"
				id="modalTarea"
				tabIndex={-1}
				aria-labelledby="modalTareaLabel"
				aria-hidden="true"
				ref={modalRef}
			>
				<div className="modal-dialog modal-lg">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title w-100" id="exampleModalLabel">
								{title}
							</h5>
							<button type="button" className="btn-close" data-bs-dismiss="modal"></button>
						</div>
						<div className="modal-body">
							<div className="input-group mb-3">
								<span className="input-group-text">
									<i className="fa-solid fa-bars-progress"></i>
								</span>
								<input
									type="text"
									id="name"
									className="form-control"
									placeholder="Escribe la Tarea"
									value={name}
									onChange={(e) => setName(e.target.value)}
									disabled={isEditMode}
								/>
							</div>
							<div className="input-group mb-3">
								<span className="input-group-text">
									<i className="fa-regular fa-solid fa-file-alt"></i>
								</span>
								<input
									type="text"
									id="description"
									className="form-control"
									placeholder="Escribe la descripción"
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									disabled={isEditMode}
								/>
							</div>
							<div className="input-group mb-3">
								<span className="input-group-text">
									<i className="fa-solid fa-mobile"></i>
								</span>
								<input
									type="text"
									id="version"
									className="form-control"
									placeholder="Escribe la versión"
									value={version}
									onChange={(e) => setVersion(e.target.value)}
									disabled={isEditMode}
								/>
							</div>
							<div className="mb-3">
								<label htmlFor="taskType" className="form-label">
									Tipo de Tarea
								</label>
								<select
									id="taskType"
									className="form-select"
									value={selectedTaskTypeId}
									onChange={(e) => setSelectedTaskTypeId(Number(e.target.value))}
									disabled={isEditMode}
								>
									<option value={0}>Selecciona...</option>
									{taskType.map((ts) => (
										<option key={ts.id} value={ts.id}>
											{ts.name} {/*- {ts.description*/} 
										</option>
									))}
								</select>
							</div>

							<div className="form-group mt-3">
								<label htmlFor="hazzard">Verificadores:</label>
								<Select
									id="verificador"
									options={opcionesVerificadores}
									value={selectedOption}
									onChange={handleCheckerChange}
									classNamePrefix="select"
									placeholder="Selecciona un verificador..."
								/>
							</div>
							<div className="modal-body">
								<div className="container">
									<div className="col-md-12">
										{!isEditMode && (
											<div className={`dropzone ${isEditMode ? "hidden" : ""}`} {...getRootProps()}>
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
										{!isEditMode && uploadedImageUrl && (
											<div className="uploaded-image-preview">
												<img src={uploadedImageUrl} alt="Vista previa" />
												<span className="delete-icon" onClick={eliminarImagen}>
													&#10006;
												</span>
											</div>
										)}
									</div>
								</div>
							</div>
						</div>
						<div className="modal-footer">
							<button
								type="button"
								className="btn btn-secondary"
								id="btnCerrar"
								data-bs-dismiss="modal"
							>
								Cerrar
							</button>
							<button
									type="button"
									className="btn btn-primary"
									onClick={validar}
									disabled={loading}>
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
	);
}

export default Tareas;


