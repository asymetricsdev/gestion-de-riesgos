// ///////// ultima version develop///////////////////////////////////

// import React, { useEffect, useState, useRef, useCallback } from "react";
// import axios, { AxiosResponse } from "axios";
// import { AxiosError } from 'axios';
// import Swal from "sweetalert2";
// import withReactContent from "sweetalert2-react-content";
// import { showAlert } from '../functions';
// import { OverlayTrigger, Tooltip } from 'react-bootstrap';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faDownload, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
// import EncabezadoTabla from "../EncabezadoTabla/EncabezadoTabla";
// import * as bootstrap from 'bootstrap';
// import { useDropzone } from 'react-dropzone';
// import '../CargaImagenes/CargaImagenes.css';

// const MySwal = withReactContent(Swal);

// interface Tareas {
//   id: string;
//   name: string;
//   description: string;
//   version: string;
//   fileExtension: string;
//   file: string;
//   base64: string;
//   type: string;
//   taskType: null;
// }

// interface FileData {
//   base64: string;
//   type: string;
// }

// interface TaskType {
// 	id: number;
// 	name: string;
// 	description: string;
// 	createDate?: string;
// 	updateDate?: string;
// }

// function Tareas() {
// 	const baseURL = import.meta.env.VITE_API_URL;
// 	const [tareas, setTareas] = useState<Tareas[]>([]);
// 	const [id, setId] = useState<string>("");
// 	const [name, setName] = useState<string>("");
// 	const [description, setDescription] = useState<string>("");
// 	const [version, setVersion] = useState<string>("");
// 	const [fileExtension, setFileExtension] = useState<string>("");
// 	const [file, setFile] = useState<{ base64: string; type: string }[]>([]);
// 	const [taskType, setTaskType] = useState<TaskType[]>([]);
// 	const [selectedTaskTypeId, setselectedTaskTypeId] = useState<number>(0);
// 	const [title, setTitle] = useState<string>("");
// 	const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
// 	const [dataGuardada, setDataGuardada] = useState(false);
// 	const [uploadedFiles, setUploadedFiles] = useState<{ base64: string; type: string }[]>([]);
// 	const [selectedFile, setSelectedFile] = useState<File | null>(null);
// 	const modalRef = useRef<HTMLDivElement | null>(null);

// 	useEffect(() => {
// 		getTasksType();
// 		fetchTareas();

// 		if (modalRef.current) {
// 			modalRef.current.addEventListener("hidden.bs.modal", handleModalHidden);
// 		}

// 		return () => {
// 			if (modalRef.current) {
// 				modalRef.current.removeEventListener("hidden.bs.modal", handleModalHidden);
// 			}
// 		};
// 	}, []);

// 	const handleModalHidden = () => {
// 		resetForm();
// 		const modals = document.querySelectorAll(".modal-backdrop");
// 		modals.forEach((modal) => modal.parentNode?.removeChild(modal));
// 	};

// 	const resetForm = () => {
// 		setId("");
// 		setName("");
// 		setDescription("");
// 		setVersion("");
// 		setFileExtension("");
// 		setFile([]);
// 		setTaskType([]);
// 		setUploadedImageUrl(null);
// 		setDataGuardada(false);
// 		setUploadedFiles([]);
// 		setSelectedFile(null);
// 	};

// 	const getTasksType = async () => {
// 		try {
// 		  const response: AxiosResponse<TaskType[]> = await axios.get(`${baseURL}/task_type/`);
// 		  setTaskType(response.data);
// 		} catch (error) {
// 		  showAlert("Error al obtener la tarea", "error");
// 		}
// 	  };

// 	const fetchTareas = async () => {
// 		try {
// 			const response = await axios.get<Tareas[]>(`${baseURL}/task/`);
// 			setTareas(response.data);
// 		} catch (error) {
// 			showAlert("Error al obtener Tareas", "error");
// 			console.error(error);
// 		}
// 	};

//   const enviarSolicitud = async (method: "POST" | "PUT", data: {
//     id: string;
//     name: string;
//     description: string;
//     version: string;
//     file: string | null;
//     fileExtension: string;
// 	taskType: string | null;
//   }) => {
//     try {
//     //   const url = method === "PUT" && data.id ? `${URL}${data.id}` : URL;
// 	const url = method === "PUT" && id ? `${baseURL}/task/${id}` : `${baseURL}/task/`;

//       const requestData = {
//         id: data.id,
//         name: data.name,
//         description: data.description,
//         version: data.version,
//         file: data.file,
//         fileExtension: data.fileExtension,
// 		taskType: data.taskType,
//       };

//       const response = await axios({
//         method,
//         url,
//         data: requestData,
//         headers: { "Content-Type": "application/json" },
//       });

//       const { tipo, msj } = response.data;
//       Swal.fire(msj, tipo);
//       fetchTareas();
//     } catch (error) {
//       console.error(error);
//       Swal.fire({
//         title: "Error",
//         text: "Error al enviar la solicitud.",
//         icon: "error",
//         confirmButtonText: "OK",
//       });
//     }
//   };

// //   const validar = () => {
// //     if (!name || !description || !description || file.length === 0 || selectedTaskTypeId === 0) {
// //       Swal.fire({
// //         title: "Datos Incompletos",
// //         text: "Por favor, completa todos los campos antes de guardar.",
// //         icon: "warning",
// //         confirmButtonText: "OK",
// //       });
// //       return;
// //     }

// // const validar = (): void => {
// //     if (name.trim() === "") {
// //         showAlert("Escribe la tarea", "warning");
// //         return;
// //     }

// //     if (description.trim() === "") {
// //         showAlert("Escribe la descripcion de la tarea", "warning");
// //         return;
// //     }

// //     if (file.length === 0) {
// //         showAlert("Escribe el archivo", "warning");
// //         return;
// //     }

// // 	// if (selectedTaskTypeId === 0) {
// //     //     showAlert("Agrega la tarea", "warning");
// //     //     return;
// //     // }

// //     enviarSolicitud("POST", {
// //       id,
// //       name,
// //       description,
// //       version,
// //       file: file.length > 0 ? file[0].base64 : null,
// //       fileExtension,
// // 	  taskType: selectedTaskTypeId.toString(),

// //     });
// //   };

// const validar = (): void => {
// 	if (name.trim() === "") {
// 	  showAlert("Escribe la tarea", "warning");
// 	  return;
// 	}

// 	if (description.trim() === "") {
// 	  showAlert("Escribe la descripcion de la tarea", "warning");
// 	  return;
// 	}

// 	if (file.length === 0) {
// 	  showAlert("Escribe el archivo", "warning");
// 	  return;
// 	}

// 	if (selectedTaskTypeId === 0) {
// 		showAlert("Selecciona un tipo de tarea", "warning");
// 		return;
// 	}

// 	if (version.trim() === "") {
// 		showAlert("Escribe la versión de la tarea", "warning");
// 		return;
// 	}

// 	enviarSolicitud("POST", {
// 	  id,
// 	  name,
// 	  description,
// 	  version,
// 	  file: file.length > 0 ? file[0].base64 : null,
// 	  fileExtension,
// 	  taskType: selectedTaskTypeId.toString(),
// 	});
//   };

//   const deleteTarea = async (id: string) => {
// 	try {
// 	  const response = await axios.delete(`${URL}/${id}`, {
// 		headers: { "Content-Type": "application/json" },
// 	  });
// 	  if (response.status >= 200 && response.status < 300) {
// 		showAlert("Tarea eliminada correctamente", "success");
// 	  } else {
// 		showAlert("No se pudo eliminar la tarea", "warning");
// 	  }
// 	  fetchTareas();
// 	} catch (error: AxiosError | any) {
// 	  if (error.response && error.response.data) {
// 		showAlert(`Error al eliminar la tarea: ${error.response.data.message}`, "error");
// 	  } else {
// 		showAlert("Error al eliminar la tarea", "error");
// 	  }
// 	}
//   };

// 	// const deleteUser = async (id: string) => {
// 	// 	try {
// 	// 		await axios.delete(`${URL}${id}`, {
// 	// 			headers: { "Content-Type": "application/json" },
// 	// 		});
// 	// 		showAlert("Tarea eliminada correctamente", "success");
// 	// 		fetchTareas();
// 	// 	} catch (error) {
// 	// 		showAlert("Error al eliminar la tarea", "error");
// 	// 		console.error(error);
// 	// 	}
// 	// };

// 	const openModal = (op: string, tarea?: Tareas) => {
// 		resetForm();
// 		if (tarea) {
// 			setId(tarea.id);
// 			setName(tarea.name);
// 			setDescription(tarea.description);
// 			setVersion(tarea.version);
// 			setFileExtension(tarea.fileExtension);
// 			setFile([{ base64: tarea.file || "", type: tarea.fileExtension }]);

// 		}
// 		setTitle(op === "1" ? "Registrar Tarea" : "Editar Tarea");

// 		if (modalRef.current) {
// 			const modal = new bootstrap.Modal(modalRef.current);
// 			modal.show();
// 		}
// 	};

// 	const onDrop = useCallback((acceptedFiles: File[]) => {
// 		if (acceptedFiles.length > 0) {
// 		  const file = acceptedFiles[0];

// 		  const reader = new FileReader();
// 		  reader.onload = () => {
// 			const base64 = reader.result as string;
// 			const extension = extractFileExtension(base64);

// 			setFile([{ base64: removeBase64Prefix(base64), type: extension }]);
// 			setFileExtension(extension);
// 			setUploadedImageUrl(base64);
// 		  };
// 		  reader.readAsDataURL(file);
// 		}
// 	  }, []);

// 	const { getRootProps, getInputProps, isDragActive } = useDropzone({
// 		onDrop,
// 		accept: {
// 			"image/*": [".jpeg", ".jpg", ".png", ".gif"],
// 			"application/pdf": [".pdf"],
// 		},
// 	});

// 	const extractFileExtension = (base64: string): string => {
// 		const extensionMap: { [key: string]: string } = {
// 			"image/jpeg": "jpg",
// 			"image/png": "png",
// 			"application/pdf": "pdf",
// 		};
// 		const type = base64.split(";")[0].split(":")[1];
// 		return extensionMap[type] || "unknown";
// 	};

//   const handleImageUpload = async (base64: string) => {
//     try {
//       const fileExists = file.some(f => f.base64 === base64);

//       if (fileExists) {
//         Swal.fire({
//           title: "Imagen Duplicada",
//           text: "La imagen ya está cargada.",
//           icon: "warning",
//           confirmButtonText: "OK",
//         });
//         return;
//       }

//       const cleanedBase64 = removeBase64Prefix(base64);
//       setFile([...file, { base64: cleanedBase64, type: fileExtension }]);
//       setUploadedImageUrl(base64);

//       Swal.fire({
//         title: "Imagen subida correctamente",
//         icon: "success",
//         confirmButtonText: "OK",
//       });

//     } catch (error) {
//       console.error(error);
//       Swal.fire({
//         title: "Error",
//         text: "Hubo un error al subir la imagen.",
//         icon: "error",
//         confirmButtonText: "OK",
//       });
//     }
//   };

// 	const removeBase64Prefix = (base64: string): string => {
// 		return base64
// 			.replace(/^data:image\/\w+;base64,/, "")
// 			.replace(/^data:application\/\w+;base64,/, "");
// 	};

// 	return (
// 		<div className="App">
// 			<div className="container-fluid">
// 				<div className="row mt-3">
// 					<div className="col-12">
// 						<div className="tabla-contenedor">
// 							<EncabezadoTabla title="Tareas" onClick={() => openModal("1")} />
// 						</div>
// 					</div>
// 					<div className="table-responsive">
// 						<table className="table table-bordered">
// 							<thead
// 								className="text-center"
// 								style={{
// 									background: "linear-gradient(90deg, #009FE3 0%, #00CFFF 100%)",
// 									color: "#fff",
// 								}}
// 							>
// 								<tr>
// 									<th>ID</th>
// 									<th>Nombre</th>
// 									<th>Descripción</th>
// 									<th>Versión</th>
// 									<th>Archivo</th>
// 									<th>Acciones</th>
// 								</tr>
// 							</thead>
// 							<tbody className="table-group-divider">
// 								{tareas.map((tarea) => (
// 									<tr key={tarea.id}>
// 										<td>{tarea.id}</td>
// 										<td>{tarea.name}</td>
// 										<td>{tarea.description}</td>
// 										<td>{tarea.version}</td>
// 										<td>
// 											{" "}
// 											<OverlayTrigger
// 												overlay={
// 													<Tooltip id={`tooltip-download-${tarea.id}`}>Descargar Archivo</Tooltip>
// 												}
// 											>
// 												<a
// 													href={`data:${tarea.fileExtension};base64,${tarea.file}`}
// 													download={`tarea_${tarea.id}.${tarea.fileExtension}`}
// 													className="btn btn-custom-editar m-2"
// 												>
// 													<FontAwesomeIcon icon={faDownload} /> Descargar
// 												</a>
// 											</OverlayTrigger>
// 										</td>
// 										<td>
// 											<OverlayTrigger placement="top" overlay={<Tooltip>Editar</Tooltip>}>
// 												<button
// 													onClick={() => openModal("2", tarea)}
// 													className="btn btn-custom-editar m-2"
// 												>
// 													<i className="fa-solid fa-edit"></i>
// 												</button>
// 											</OverlayTrigger>
// 											<OverlayTrigger placement="top" overlay={<Tooltip>Eliminar</Tooltip>}>
// 												<button
// 													className="btn btn-custom-danger"
// 													onClick={() => {
// 														MySwal.fire({
// 															title: "¿Estás seguro?",
// 															text: "No podrás revertir esto",
// 															icon: "warning",
// 															showCancelButton: true,
// 															confirmButtonText: "Sí, bórralo",
// 															cancelButtonText: "Cancelar",
// 														}).then((result) => {
// 															if (result.isConfirmed) {
// 																deleteTarea(tarea.id);
// 															}
// 														});
// 													}}
// 												>
// 													<FontAwesomeIcon icon={faCircleXmark} />
// 												</button>
// 											</OverlayTrigger>
// 										</td>
// 									</tr>
// 								))}
// 							</tbody>
// 						</table>
// 					</div>
// 				</div>
// 			</div>

// 			<div
// 				className="modal fade"
// 				id="modalTarea"
// 				tabIndex={-1}
// 				aria-labelledby="modalTareaLabel"
// 				aria-hidden="true"
// 				ref={modalRef}
// 			>
// 				<div className="modal-dialog modal-lg">
// 					<div className="modal-content">
// 						<div className="modal-header">
// 							<h5 className="modal-title" id="exampleModalLabel">
// 								{title}
// 							</h5>
// 							<button
// 								type="button"
// 								className="btn-close"
// 								data-bs-dismiss="modal"
// 							></button>
// 						</div>
// 						<div className="modal-body">
// 							<div className="input-group mb-3">
// 								<span className="input-group-text">
// 									<i className="fa-solid fa-user"></i>
// 								</span>
// 								<input
// 									type="text"
// 									id="name"
// 									className="form-control"
// 									placeholder="Escribe el nombre"
// 									value={name}
// 									onChange={(e) => setName(e.target.value)}
// 								/>
// 							</div>
// 							<div className="input-group mb-3">
// 								<span className="input-group-text">
// 									<i className="fa-solid fa-envelope"></i>
// 								</span>
// 								<input
// 									type="text"
// 									id="description"
// 									className="form-control"
// 									placeholder="Escribe la descripción"
// 									value={description}
// 									onChange={(e) => setDescription(e.target.value)}
// 								/>
// 							</div>
// 							<div className="input-group mb-3">
// 								<span className="input-group-text">
// 									<i className="fa-solid fa-mobile"></i>
// 								</span>
// 								<input
// 									type="text"
// 									id="version"
// 									className="form-control"
// 									placeholder="Escribe la versión"
// 									value={version}
// 									onChange={(e) => setVersion(e.target.value)}
// 								/>
// 							</div>
// 							<div className="mb-3">
//  								<label htmlFor="selectedTaskTypeId" className="form-label text-primary">
//  									<strong>Tareas</strong>
// 								</label>
//  								<select
//  									id="selectedTaskTypeId"
//  									className="form-select"
//  									value={selectedTaskTypeId}
//  									onChange={(e) => setselectedTaskTypeId(Number(e.target.value))}>
//  									{taskType.map((task: TaskType) => (
//  										<option key={task.id} value={task.id.toString()}>
// 											{" "}
// 											{task.description + " - " + task.name}
//  										</option>
//  									))}
//  								</select>
//  							</div>
// 							<div className="modal-body">
// 								<div className="container">
// 									<div className="col-md-12">
// 										<div {...getRootProps()} className="dropzone">
// 											<input {...getInputProps()} />
// 											{isDragActive ? (
// 												<p>Carga los archivos acá ...</p>
// 											) : (
// 												<p>Puede arrastrar y soltar archivos aquí para añadirlos</p>
// 											)}
// 										</div>
// 										<p className="text-parrafo-dropzone mt-1">
// 											Tamaño máximo de archivo: 500kb, número máximo de archivos: 2
// 										</p>
// 									</div>
// 									{uploadedImageUrl && (
// 										<div className="uploaded-image-preview">
// 											<h6>Archivo subido:</h6>
// 											{uploadedImageUrl.startsWith("data:image/") && (
// 												<img src={uploadedImageUrl} alt="Vista previa" />
// 											)}
// 										</div>
// 									)}
// 									<div className="mb-3">
// 										{uploadedFiles.length > 0 && (
// 											<div>
// 												<h6>Archivos subidos:</h6>
// 												<ul>
// 													{uploadedFiles.map((file, index) => (
// 														<li key={index}>{`Archivo ${index + 1}: ${file.type}`}</li>
// 													))}
// 												</ul>
// 											</div>
// 										)}
// 									</div>
// 								</div>
// 							</div>
// 						</div>
// 						<div className="modal-footer">
// 							<button
// 								type="button"
// 								className="btn btn-secondary"
// 								id="btnCerrar"
// 								data-bs-dismiss="modal"
// 							>
// 								Cerrar
// 							</button>
// 							<button type="button" className="btn btn-primary" onClick={validar}>
// 								Guardar
// 							</button>
// 						</div>
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }

// export default Tareas;










// import React, { useEffect, useState, useRef, useCallback } from "react";
// import axios, { AxiosResponse } from "axios";
// import { AxiosError } from "axios";
// import Swal from "sweetalert2";
// import withReactContent from "sweetalert2-react-content";
// import { showAlert } from "../functions";
// import { OverlayTrigger, Tooltip } from "react-bootstrap";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faDownload, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
// import EncabezadoTabla from "../EncabezadoTabla/EncabezadoTabla";
// import * as bootstrap from "bootstrap";
// import { useDropzone } from "react-dropzone";
// import './Tareas.css';

// const MySwal = withReactContent(Swal);

// interface Tareas {
// 	id: string;
// 	name: string;
// 	description: string;
// 	version: string;
// 	fileExtension: string;
// 	file: string;
// 	base64: string;
// 	type: string;
// 	taskType: TaskType;
// }

// interface FileData {
// 	base64: string;
// 	type: string;
// }

// interface TaskType {
// 	id: number;
// 	name: string;
// 	description: string;
// 	createDate?: string;
// 	updateDate?: string;
// }

// function Tareas() {
// 	// const URL = "https://asymetricsbackend.uk.r.appspot.com/task";
// 	const baseURL = import.meta.env.VITE_API_URL;
// 	const [tareas, setTareas] = useState<Tareas[]>([]);
// 	const [id, setId] = useState<string>("");
// 	const [name, setName] = useState<string>("");
// 	const [description, setDescription] = useState<string>("");
// 	const [version, setVersion] = useState<string>("");
// 	const [fileExtension, setFileExtension] = useState<string>("");
// 	const [file, setFile] = useState<{ base64: string; type: string }[]>([]);
// 	const [taskType, setTaskType] = useState<TaskType[]>([]);
// 	const [selectedTaskTypeId, setselectedTaskTypeId] = useState<number>(0);
// 	const [title, setTitle] = useState<string>("");
// 	const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
// 	const [dataGuardada, setDataGuardada] = useState(false);
// 	const [uploadedFiles, setUploadedFiles] = useState<{ base64: string; type: string }[]>([]);
// 	const [selectedFile, setSelectedFile] = useState<File | null>(null);
// 	const modalRef = useRef<HTMLDivElement | null>(null);

// 	useEffect(() => {
// 		fetchTareas();
// 		getTasksType();

// 		if (modalRef.current) {
// 			modalRef.current.addEventListener("hidden.bs.modal", handleModalHidden);
// 		}

// 		return () => {
// 			if (modalRef.current) {
// 				modalRef.current.removeEventListener("hidden.bs.modal", handleModalHidden);
// 			}
// 		};
// 	}, []);

// 	const handleModalHidden = () => {
// 		resetForm();
// 		const modals = document.querySelectorAll(".modal-backdrop");
// 		modals.forEach((modal) => modal.parentNode?.removeChild(modal));
// 	};

// 	const resetForm = () => {
// 		setId("");
// 		setName("");
// 		setDescription("");
// 		setVersion("");
// 		setFileExtension("");
// 		setFile([]);
// 		setUploadedImageUrl(null);
// 		setDataGuardada(false);
// 		setUploadedFiles([]);
// 		setSelectedFile(null);
// 	};

// 	const fetchTareas = async () => {
// 		try {
// 			const response: AxiosResponse<Tareas[]> = await axios.get(`${baseURL}/task/`);
// 			setTareas(response.data);
// 		} catch (error) {
// 			showAlert("Error al obtener Tareas", "error");
// 			console.error(error);
// 		}
// 	};
// 	const getTasksType = async () => {
// 		try {
// 			const response: AxiosResponse<TaskType[]> = await axios.get(`${baseURL}/task_type/`);
// 			console.log(response.data); 
// 			setTaskType(response.data);
// 		} catch (error) {
// 			console.error(error); 
// 			showAlert("Error al obtener la tarea", "error");
// 		}
// 	};

// 	const enviarSolicitud = async (
// 		method: "POST" | "PUT",
// 		data: {
// 			id: string;
// 			name: string;
// 			description: string;
// 			version: string;
// 			file: string | null;
// 			fileExtension: string;
// 			taskTypeId: string | null;
// 		}
// 	) => {
// 		try {
// 			const url = method === "PUT" && id ? `${baseURL}/task/${id}` : `${baseURL}/task/`;

// 			const requestData = {
// 				id: data.id,
// 				name: data.name,
// 				description: data.description,
// 				version: data.version,
// 				file: data.file,
// 				fileExtension: data.fileExtension,
// 				taskTypeId: data.taskTypeId,
// 			};

// 			const response = await axios({
// 				method,
// 				url,
// 				data: requestData,
// 				headers: { "Content-Type": "application/json" },
// 			});

// 			const { tipo, msj } = response.data;
// 			Swal.fire(msj, tipo);
// 			fetchTareas();
// 		} catch (error) {
// 			console.error(error);
// 			Swal.fire({
// 				title: "Error",
// 				text: "Error al enviar la solicitud.",
// 				icon: "error",
// 				confirmButtonText: "OK",
// 			});
// 		}
// 	};

// 	const validar = (): void => {
// 		if (name.trim() === "") {
// 			showAlert("Escribe la tarea", "warning");
// 			return;
// 		}

// 		if (description.trim() === "") {
// 			showAlert("Escribe la descripcion de la tarea", "warning");
// 			return;
// 		}

// 		if (file.length === 0) {
// 			showAlert("Escribe el archivo", "warning");
// 			return;
// 		}
// 		if (selectedTaskTypeId === 0) {
// 			showAlert("Selecciona un tipo de tarea", "warning");
// 			return;
// 		}

// 		enviarSolicitud("POST", {
// 			id,
// 			name,
// 			description,
// 			version,
// 			file: file.length > 0 ? file[0].base64 : null,
// 			fileExtension,
// 			taskTypeId: selectedTaskTypeId.toString(),
// 		});
// 	};

// 	const deleteTarea = async (id: string) => {
// 		try {
// 				await axios.delete(`${baseURL}/task/${id}`, {
// 				headers: { "Content-Type": "application/json" },
// 			});
// 			showAlert("Tarea eliminada correctamente", "success");
// 			fetchTareas();
// 		} catch (error) {
// 			showAlert("Error al eliminar la tarea", "error");
// 			console.error(error);
// 		}
// 	};

// 	const openModal = (op: string, tarea?: Tareas) => {
// 		resetForm();
// 		if (tarea) {
// 			setId(tarea.id);
// 			setName(tarea.name);
// 			setDescription(tarea.description);
// 			setVersion(tarea.version);
// 			setFileExtension(tarea.fileExtension);
// 			setFile([{ base64: tarea.file || "", type: tarea.fileExtension }]);
// 		}
// 		setTitle(op === "1" ? "Registrar Tarea" : "Editar Tarea");

// 		if (modalRef.current) {
// 			const modal = new bootstrap.Modal(modalRef.current);
// 			modal.show();
// 		}
// 	};

// 	const onDrop = useCallback((acceptedFiles: File[]) => {
// 		if (acceptedFiles.length > 0) {
// 			const file = acceptedFiles[0];

// 			const reader = new FileReader();
// 			reader.onload = () => {
// 				const base64 = reader.result as string;
// 				const extension = extractFileExtension(base64);

// 				setFile([{ base64: removeBase64Prefix(base64), type: extension }]);
// 				setFileExtension(extension);
// 				setUploadedImageUrl(base64);
// 			};
// 			reader.readAsDataURL(file);
// 		}
// 	}, []);

// 	const { getRootProps, getInputProps, isDragActive } = useDropzone({
// 		onDrop,
// 		accept: {
// 			"image/*": [".jpeg", ".jpg", ".png", ".gif"],
// 			"application/pdf": [".pdf"],
// 		},
// 	});

// 	const extractFileExtension = (base64: string): string => {
// 		const extensionMap: { [key: string]: string } = {
// 			"image/jpeg": "jpg",
// 			"image/png": "png",
// 			"application/pdf": "pdf",
// 		};
// 		const type = base64.split(";")[0].split(":")[1];
// 		return extensionMap[type] || "unknown";
// 	};

// 	const handleImageUpload = async (base64: string) => {
// 		try {
// 			const fileExists = file.some((f) => f.base64 === base64);

// 			if (fileExists) {
// 				Swal.fire({
// 					title: "Imagen Duplicada",
// 					text: "La imagen ya está cargada.",
// 					icon: "warning",
// 					confirmButtonText: "OK",
// 				});
// 				return;
// 			}

// 			const cleanedBase64 = removeBase64Prefix(base64);
// 			setFile([...file, { base64: cleanedBase64, type: fileExtension }]);
// 			setUploadedImageUrl(base64);

// 			Swal.fire({
// 				title: "Imagen subida correctamente",
// 				icon: "success",
// 				confirmButtonText: "OK",
// 			});
// 		} catch (error) {
// 			console.error(error);
// 			Swal.fire({
// 				title: "Error",
// 				text: "Hubo un error al subir la imagen.",
// 				icon: "error",
// 				confirmButtonText: "OK",
// 			});
// 		}
// 	};

// 	const removeBase64Prefix = (base64: string): string => {
// 		return base64
// 			.replace(/^data:image\/\w+;base64,/, "")
// 			.replace(/^data:application\/\w+;base64,/, "");
// 	};
	

// 	return (
// 		<div className="App">
// 			<div className="container-fluid">
// 				<div className="row mt-3">
// 					<div className="col-12">
// 						<div className="tabla-contenedor">
// 							<EncabezadoTabla title="Tareas" onClick={() => openModal("1")} />
// 						</div>
// 					</div>
// 					<div className="table-responsive">
// 						<table className="table table-bordered">
// 							<thead
// 								className="text-center"
// 								style={{
// 									background: "linear-gradient(90deg, #009FE3 0%, #00CFFF 100%)",
// 									color: "#fff",
// 								}}
// 							>
// 								<tr>
// 									<th>Tipo de Tarea</th>
// 									<th>Nombre</th>
// 									<th>Descripción</th>
// 									<th>Versión</th>
// 									<th>Archivo</th>

// 									<th>Acciones</th>
// 								</tr>
// 							</thead>
// 							<tbody className="table-group-divider">
// 								{tareas.map((tr) => (
// 									<tr key={tr.id}>
// 										<td>{tr.taskType.name}</td>
// 										<td>{tr.name}</td>
// 										<td>{tr.description}</td>
// 										<td>{tr.version}</td>

// 										<td>
// 											{" "}
// 											<OverlayTrigger
// 												overlay={
// 													<Tooltip id={`tooltip-download-${tr.id}`}>Descargar Archivo</Tooltip>
// 												}
// 											>
// 												<a
// 													href={`data:${tr.fileExtension};base64,${tr.file}`}
// 													download={`tarea_${tr.id}.${tr.fileExtension}`}
// 													className="btn btn-custom-editar m-2"
// 												>
// 													<FontAwesomeIcon icon={faDownload} /> Descargar
// 												</a>
// 											</OverlayTrigger>
// 										</td>
// 										<td>
// 											<OverlayTrigger placement="top" overlay={<Tooltip>Editar</Tooltip>}>
// 												<button
// 													onClick={() => openModal("2", tr)}
// 													className="btn btn-custom-editar m-2"
// 												>
// 													<i className="fa-solid fa-edit"></i>
// 												</button>
// 											</OverlayTrigger>
// 											<OverlayTrigger placement="top" overlay={<Tooltip>Eliminar</Tooltip>}>
// 												<button
// 													className="btn btn-custom-danger"
// 													onClick={() => {
// 														MySwal.fire({
// 															title: "¿Estás seguro?",
// 															text: "No podrás revertir esto",
// 															icon: "warning",
// 															showCancelButton: true,
// 															confirmButtonText: "Sí, bórralo",
// 															cancelButtonText: "Cancelar",
// 														}).then((result) => {
// 															if (result.isConfirmed) {
// 																deleteTarea(tr.id);
// 															}
// 														});
// 													}}
// 												>
// 													<FontAwesomeIcon icon={faCircleXmark} />
// 												</button>
// 											</OverlayTrigger>
// 										</td>
// 									</tr>
// 								))}
// 							</tbody>
// 						</table>
// 					</div>
// 				</div>
// 			</div>

// 			<div
// 				className="modal fade"
// 				id="modalTarea"
// 				tabIndex={-1}
// 				aria-labelledby="modalTareaLabel"
// 				aria-hidden="true"
// 				ref={modalRef}
// 			>
// 				<div className="modal-dialog modal-lg">
// 					<div className="modal-content">
// 						<div className="modal-header">
// 							<h5 className="modal-title" id="exampleModalLabel">
// 								{title}
// 							</h5>
// 							<button type="button" className="btn-close" data-bs-dismiss="modal"></button>
// 						</div>
// 						<div className="modal-body">
// 							<div className="input-group mb-3">
// 								<span className="input-group-text">
// 									<i className="fa-solid fa-user"></i>
// 								</span>
// 								<input
// 									type="text"
// 									id="name"
// 									className="form-control"
// 									placeholder="Escribe el nombre"
// 									value={name}
// 									onChange={(e) => setName(e.target.value)}
// 								/>
// 							</div>
// 							<div className="input-group mb-3">
// 								<span className="input-group-text">
// 									<i className="fa-solid fa-envelope"></i>
// 								</span>
// 								<input
// 									type="text"
// 									id="description"
// 									className="form-control"
// 									placeholder="Escribe la descripción"
// 									value={description}
// 									onChange={(e) => setDescription(e.target.value)}
// 								/>
// 							</div>
// 							<div className="input-group mb-3">
// 								<span className="input-group-text">
// 									<i className="fa-solid fa-mobile"></i>
// 								</span>
// 								<input
// 									type="text"
// 									id="version"
// 									className="form-control"
// 									placeholder="Escribe la versión"
// 									value={version}
// 									onChange={(e) => setVersion(e.target.value)}
// 								/>
// 							</div>
// 							<div className="mb-3">
// 								<label htmlFor="tastType" className="form-label">
// 									Tipo de Tarea
// 								</label>
// 								<select
// 									id="criticityType"
// 									className="form-select"
// 									value={selectedTaskTypeId}
// 									onChange={(e) => setselectedTaskTypeId(Number(e.target.value))}
// 								>
// 									<option value={0}>Selecciona tipo de tarea</option>
// 									{taskType.map((ts) => (
// 										<option key={ts.id} value={ts.id}>
// 											{ts.description + " - " + ts.name}
// 										</option>
// 									))}
// 								</select>
// 							</div>
// 							<div className="modal-body">
// 								<div className="container">
// 									<div className="col-md-12">
// 										<div {...getRootProps()} className="dropzone">
// 											<input {...getInputProps()} />
// 											{isDragActive ? (
// 												<p>Carga los archivos acá ...</p>
// 											) : (
// 												<p>Puede arrastrar y soltar archivos aquí para añadirlos</p>
// 											)}
// 										</div>
// 										<p className="text-parrafo-dropzone mt-1">
// 											Tamaño máximo de archivo: 500kb, número máximo de archivos: 2
// 										</p>
// 									</div>
// 									{uploadedImageUrl && (
// 										<div className="uploaded-image-preview">
// 											<h6>Archivo subido:</h6>
// 											{uploadedImageUrl.startsWith("data:image/") && (
// 												<img src={uploadedImageUrl} alt="Vista previa" />
// 											)}
// 										</div>
// 									)}
// 									<div className="mb-3">
// 										{uploadedFiles.length > 0 && (
// 											<div>
// 												<h6>Archivos subidos:</h6>
// 												<ul>
// 													{uploadedFiles.map((file, index) => (
// 														<li key={index}>{`Archivo ${index + 1}: ${file.type}`}</li>
// 													))}
// 												</ul>
// 											</div>
// 										)}
// 									</div>
// 								</div>
// 							</div>
// 						</div>
// 						<div className="modal-footer">
// 							<button
// 								type="button"
// 								className="btn btn-secondary"
// 								id="btnCerrar"
// 								data-bs-dismiss="modal"
// 							>
// 								Cerrar
// 							</button>
// 							<button type="button" className="btn btn-primary" onClick={validar}>
// 								Guardar
// 							</button>
// 						</div>
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }

// export default Tareas;





import React, { useEffect, useState, useRef, useCallback } from "react";
import axios, { AxiosResponse } from "axios";
import { AxiosError } from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { showAlert } from "../functions";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import EncabezadoTabla from "../EncabezadoTabla/EncabezadoTabla";
import * as bootstrap from "bootstrap";
import { useDropzone } from "react-dropzone";
import './Tareas.css';

const MySwal = withReactContent(Swal);

interface Tareas {
	id: string;
	name: string;
	description: string;
	version: string;
	fileExtension: string;
	file: string;
	base64: string;
	type: string;
	taskType: TaskType;
}

interface FileData {
	base64: string;
	type: string;
}

interface TaskType {
	id: number;
	name: string;
	description: string;
	createDate?: string;
	updateDate?: string;
}

function Tareas() {
	// const URL = "https://asymetricsbackend.uk.r.appspot.com/task";
	const baseURL = import.meta.env.VITE_API_URL;
	const [tareas, setTareas] = useState<Tareas[]>([]);
	const [id, setId] = useState<string>("");
	const [name, setName] = useState<string>("");
	const [description, setDescription] = useState<string>("");
	const [version, setVersion] = useState<string>("");
	const [fileExtension, setFileExtension] = useState<string>("");
	const [file, setFile] = useState<{ base64: string; type: string }[]>([]);
	const [taskType, setTaskType] = useState<TaskType[]>([]);
	const [selectedTaskTypeId, setselectedTaskTypeId] = useState<number>(0);
	const [title, setTitle] = useState<string>("");
	const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
	const [dataGuardada, setDataGuardada] = useState(false);
	const [uploadedFiles, setUploadedFiles] = useState<{ base64: string; type: string }[]>([]);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const modalRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		fetchTareas();
		getTasksType();

		if (modalRef.current) {
			modalRef.current.addEventListener("hidden.bs.modal", handleModalHidden);
		}

		return () => {
			if (modalRef.current) {
				modalRef.current.removeEventListener("hidden.bs.modal", handleModalHidden);
			}
		};
	}, []);

	const handleModalHidden = () => {
		resetForm();
		const modals = document.querySelectorAll(".modal-backdrop");
		modals.forEach((modal) => modal.parentNode?.removeChild(modal));
	};

	const resetForm = () => {
		setId("");
		setName("");
		setDescription("");
		setVersion("");
		setFileExtension("");
		setFile([]);
		setUploadedImageUrl(null);
		setDataGuardada(false);
		setUploadedFiles([]);
		setSelectedFile(null);
	};

	const fetchTareas = async () => {
		try {
			const response: AxiosResponse<Tareas[]> = await axios.get(`${baseURL}/task/`);
			setTareas(response.data);
		} catch (error) {
			showAlert("Error al obtener Tareas", "error");
			console.error(error);
		}
	};
	const getTasksType = async () => {
		try {
			const response: AxiosResponse<TaskType[]> = await axios.get(`${baseURL}/task_type/`);
			console.log(response.data); 
			setTaskType(response.data);
		} catch (error) {
			console.error(error); 
			showAlert("Error al obtener la tarea", "error");
		}
	};

	const enviarSolicitud = async (
		method: "POST" | "PUT",
		data: {
			id: string;
			name: string;
			description: string;
			version: string;
			file: string | null;
			fileExtension: string;
			taskTypeId: string | null;
		}
	) => {
		try {
			const url = method === "PUT" && id ? `${baseURL}/task/${id}` : `${baseURL}/task/`;

			const requestData = {
				id: data.id,
				name: data.name,
				description: data.description,
				version: data.version,
				file: data.file,
				fileExtension: data.fileExtension,
				taskTypeId: data.taskTypeId,
			};

			const response = await axios({
				method,
				url,
				data: requestData,
				headers: { "Content-Type": "application/json" },
			});

			const { tipo, msj } = response.data;
			Swal.fire(msj, tipo);
			fetchTareas();
		} catch (error) {
			console.error(error);
			Swal.fire({
				title: "Error",
				text: "Error al enviar la solicitud.",
				icon: "error",
				confirmButtonText: "OK",
			});
		}
	};

	const validar = (): void => {
		if (name.trim() === "") {
			showAlert("Escribe la tarea", "warning");
			return;
		}

		if (description.trim() === "") {
			showAlert("Escribe la descripcion de la tarea", "warning");
			return;
		}

		if (file.length === 0) {
			showAlert("Escribe el archivo", "warning");
			return;
		}
		if (selectedTaskTypeId === 0) {
			showAlert("Selecciona un tipo de tarea", "warning");
			return;
		}

		enviarSolicitud("POST", {
			id,
			name,
			description,
			version,
			file: file.length > 0 ? file[0].base64 : null,
			fileExtension,
			taskTypeId: selectedTaskTypeId.toString(),
		});
	};

	const deleteTarea = async (id: string) => {
		try {
				await axios.delete(`${baseURL}/task/${id}`, {
				headers: { "Content-Type": "application/json" },
			});
			showAlert("Tarea eliminada correctamente", "success");
			fetchTareas();
		} catch (error) {
			showAlert("Error al eliminar la tarea", "error");
			console.error(error);
		}
	};

	const openModal = (op: string, tarea?: Tareas) => {
		resetForm();
		if (tarea) {
			setId(tarea.id);
			setName(tarea.name);
			setDescription(tarea.description);
			setVersion(tarea.version);
			setFileExtension(tarea.fileExtension);
			setFile([{ base64: tarea.file || "", type: tarea.fileExtension }]);
		}
		setTitle(op === "1" ? "Registrar Tarea" : "Editar Tarea");

		if (modalRef.current) {
			const modal = new bootstrap.Modal(modalRef.current);
			modal.show();
		}
	};

	// const onDrop = useCallback((acceptedFiles: File[]) => {
	// 	if (acceptedFiles.length > 0) {
	// 		const file = acceptedFiles[0];

	// 		const reader = new FileReader();
	// 		reader.onload = () => {
	// 			const base64 = reader.result as string;
	// 			const extension = extractFileExtension(base64);

	// 			setFile([{ base64: removeBase64Prefix(base64), type: extension }]);
	// 			setFileExtension(extension);
	// 			setUploadedImageUrl(base64);
	// 		};
	// 		reader.readAsDataURL(file);
	// 	}
	// }, []);

	// const { getRootProps, getInputProps, isDragActive } = useDropzone({
	// 	onDrop,
	// 	accept: {
	// 		"image/*": [".jpeg", ".jpg", ".png", ".gif"],
	// 		"application/pdf": [".pdf"],
	// 	},
	// });

	const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result as string;
                const extension = extractFileExtension(base64);

                // Guardar el base64 sin el prefijo en el estado
                setUploadedImageUrl(removeBase64Prefix(base64));
                setFileExtension(extension);
            };
            reader.readAsDataURL(file);
        }
    }, []);

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

	const removeBase64Prefix = (base64: string): string => {
		return base64
			.replace(/^data:image\/\w+;base64,/, "")
			.replace(/^data:application\/\w+;base64,/, "");
	};


	const downloadFile = async () => {
        try {
            const response = await axios.get("https://testbackend-433922.uk.r.appspot.com/task/1/download", {
                responseType: "blob",
            });

            // Crear una URL para descargar el archivo
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `tarea.${fileExtension}`);
            document.body.appendChild(link);
            link.click();

            // Liberar la URL creada
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error al descargar el archivo", error);
            Swal.fire({
                title: "Error",
                text: "Hubo un error al descargar el archivo.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };

	

	// const handleImageUpload = async (base64: string) => {
	// 	try {
	// 		const fileExists = file.some((f) => f.base64 === base64);

	// 		if (fileExists) {
	// 			Swal.fire({
	// 				title: "Imagen Duplicada",
	// 				text: "La imagen ya está cargada.",
	// 				icon: "warning",
	// 				confirmButtonText: "OK",
	// 			});
	// 			return;
	// 		}

	// 		const cleanedBase64 = removeBase64Prefix(base64);
	// 		setFile([...file, { base64: cleanedBase64, type: fileExtension }]);
	// 		setUploadedImageUrl(base64);

	// 		Swal.fire({
	// 			title: "Imagen subida correctamente",
	// 			icon: "success",
	// 			confirmButtonText: "OK",
	// 		});
	// 	} catch (error) {
	// 		console.error(error);
	// 		Swal.fire({
	// 			title: "Error",
	// 			text: "Hubo un error al subir la imagen.",
	// 			icon: "error",
	// 			confirmButtonText: "OK",
	// 		});
	// 	}
	// };


	

	return (
		<div className="App">
			<div className="container-fluid">
				<div className="row mt-3">
					<div className="col-12">
						<div className="tabla-contenedor">
							<EncabezadoTabla title="Tareas" onClick={() => openModal("1")} />
						</div>
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
									<th>Tipo de Tarea</th>
									<th>Nombre</th>
									<th>Descripción</th>
									<th>Versión</th>
									<th>Archivo</th>

									<th>Acciones</th>
								</tr>
							</thead>
							<tbody className="table-group-divider">
								{tareas.map((tr) => (
									<tr key={tr.id}>
										<td>{tr.taskType.name}</td>
										<td>{tr.name}</td>
										<td>{tr.description}</td>
										<td>{tr.version}</td>

										<td>
											{" "}
											<OverlayTrigger
												overlay={
													<Tooltip id={`tooltip-download-${tr.id}`}>Descargar Archivo</Tooltip>
												}
											>
												<a
													href={`data:${tr.fileExtension};base64,${tr.file}`}
													// download={`tarea_${tr.id}.${tr.fileExtension}`}
													onClick={downloadFile}
													className="btn btn-custom-editar m-2"
												>
													<FontAwesomeIcon icon={faDownload} /> Descargar
												</a>
											</OverlayTrigger>
										</td>
										<td>
											<OverlayTrigger placement="top" overlay={<Tooltip>Editar</Tooltip>}>
												<button
													onClick={() => openModal("2", tr)}
													className="btn btn-custom-editar m-2"
												>
													<i className="fa-solid fa-edit"></i>
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
								))}
							</tbody>
						</table>
					</div>
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
							<h5 className="modal-title" id="exampleModalLabel">
								{title}
							</h5>
							<button type="button" className="btn-close" data-bs-dismiss="modal"></button>
						</div>
						<div className="modal-body">
							<div className="input-group mb-3">
								<span className="input-group-text">
									<i className="fa-solid fa-user"></i>
								</span>
								<input
									type="text"
									id="name"
									className="form-control"
									placeholder="Escribe el nombre"
									value={name}
									onChange={(e) => setName(e.target.value)}
								/>
							</div>
							<div className="input-group mb-3">
								<span className="input-group-text">
									<i className="fa-solid fa-envelope"></i>
								</span>
								<input
									type="text"
									id="description"
									className="form-control"
									placeholder="Escribe la descripción"
									value={description}
									onChange={(e) => setDescription(e.target.value)}
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
								/>
							</div>
							<div className="mb-3">
								<label htmlFor="tastType" className="form-label">
									Tipo de Tarea
								</label>
								<select
									id="criticityType"
									className="form-select"
									value={selectedTaskTypeId}
									onChange={(e) => setselectedTaskTypeId(Number(e.target.value))}
								>
									<option value={0}>Selecciona tipo de tarea</option>
									{taskType.map((ts) => (
										<option key={ts.id} value={ts.id}>
											{ts.description + " - " + ts.name}
										</option>
									))}
								</select>
							</div>
							<div className="modal-body">
								<div className="container">
									<div className="col-md-12">
										<div {...getRootProps()} className="dropzone">
											<input {...getInputProps()} />
											{isDragActive ? (
												<p>Carga los archivos acá ...</p>
											) : (
												<p>Puede arrastrar y soltar archivos aquí para añadirlos</p>
											)}
										</div>
										<p className="text-parrafo-dropzone mt-1">
											Tamaño máximo de archivo: 500kb, número máximo de archivos: 2
										</p>
									</div>
									{uploadedImageUrl && (
										<div className="uploaded-image-preview">
											<h6>Archivo subido:</h6>
											{uploadedImageUrl.startsWith("data:image/") && (
												// <img src={uploadedImageUrl} alt="Vista previa" />
												<img
												src={`data:image/${fileExtension};base64,${uploadedImageUrl}`}
												alt="Vista previa"
											/>
											)}
										</div>
									)}
									<div className="mb-3">
										{uploadedFiles.length > 0 && (
											<div>
												<h6>Archivos subidos:</h6>
												<ul>
													{uploadedFiles.map((file, index) => (
														<li key={index}>{`Archivo ${index + 1}: ${file.type}`}</li>
													))}
												</ul>
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
							<button type="button" className="btn btn-primary" onClick={validar}>
								Guardar
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Tareas;

