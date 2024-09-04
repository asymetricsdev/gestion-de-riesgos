
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
import Select from 'react-select';
import { Accordion, AccordionItem, AccordionHeader, AccordionBody } from 'react-bootstrap';
import './Tareas.css';

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
	checkers: Checkers[];
}


interface TaskType {
	id: number;
	name: string;
	description: string;
	createDate?: string;
	updateDate?: string;
}

interface Checkers {
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
	const [id, setId] = useState<number>(0);
	const [name, setName] = useState<string>("");
	const [description, setDescription] = useState<string>("");
	const [version, setVersion] = useState<string>("");
	const [fileExtension, setFileExtension] = useState<string>("");
	const [file, setFile] = useState<{ base64: string; type: string }[]>([]);
	const [selectedCheckerIds, setSelectedCheckerIds] = useState<number[]>([]);
	const [taskType, setTaskType] = useState<TaskType[]>([]);
	const [checkers, setCheckers] = useState<Checkers[]>([]);
	const [selectedTaskTypeId, setselectedTaskTypeId] = useState<number>(0);
	const [title, setTitle] = useState<string>("");
	const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
	const [dataGuardada, setDataGuardada] = useState(false);
	const [uploadedFiles, setUploadedFiles] = useState<{ base64: string; type: string }[]>([]);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const modalRef = useRef<HTMLDivElement | null>(null);
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

	const getChecker = async () => {
		try {
		  const response: AxiosResponse<Checkers[]> = await axios.get(`${baseURL}/checker/`);
		  setCheckers(response.data);
		} catch (error) {
		  showAlert("Error al obtener las verificaciones", "error");
		}
	  };

	const enviarSolicitud = async (method: "POST" | "PUT", data: any) => {
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
		  if (axios.isAxiosError(error) && error.response) {
			showAlert(`Error: ${error.response.data.message || "No se pudo completar la solicitud."}`, "error");
		  } else {
			showAlert("Error al realizar la solicitud", "error");
		  }
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
		if (selectedCheckerIds.length === 0) {
			showAlert("Selecciona al menos un verificador", "warning");
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
			checkers,
		});
	};

	const deleteTarea = async (id: number) => {
		try {
				await axios.delete(`${baseURL}/task/${id}`, {
				headers: { "Content-Type": "application/json" },
			});
			showAlert("Tarea eliminada correctamente", "success");
			getTareas();
		} catch (error) {
			showAlert("Error al eliminar la tarea", "error");
			console.error(error);
		}
	};


	const openModal = (op: string, tarea?: Tareas) =>  {
		if (op === "1") {
		  setId(0);
		  setName("");
		  setDescription("");
		  setSelectedCheckerIds([]);
		  setTitle("Registrar Tareas");
		} else if (op === "2" && tarea) {
		  setId(tarea.id);
		  setName(tarea.name);
		  setDescription(tarea.description);
		  setSelectedCheckerIds(tarea.checkers.map(h => h.id));
		  setTitle("Editar Tareas");
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

	const onDrop = useCallback((acceptedFiles: File[]) => {
		if (acceptedFiles.length > 0) {
			const file = acceptedFiles[0];

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
		  link.setAttribute("download", `${fileName}.${fileExtension}`);
		  document.body.appendChild(link);
		  link.click();
		  document.body.removeChild(link);

		  window.URL.revokeObjectURL(link.href);
		} catch (error) {
		  console.error("Error al descargar el archivo:", error);
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

	const opcionesVerificadores = checkers.map(sp => ({
		value: sp.id,
		label: sp.description,
	  }));
	  
	

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
									<th>Verificadores</th>
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
											<Accordion>
												<Accordion.Item eventKey="0">
													<Accordion.Header>Verificadores</Accordion.Header>
													<Accordion.Body>
														<ul>
															{tr.checkers.map((check) => (
																<li key={check.id}>{check.description}</li>
															))}
														</ul>
													</Accordion.Body>
												</Accordion.Item>
											</Accordion>
										</td>
										<td>
											{" "}
											<OverlayTrigger
												overlay={
													<Tooltip id={`tooltip-download-${tr.id}`}>Descargar Archivo</Tooltip>
												}>
												<button
                                                  onClick={() => downloadFile
													// (`${baseURL}/task/${id}/download/`, 
													// 	tr.fileExtension, tr.name)}
							                    (`https://testbackend-433922.uk.r.appspot.com/task/${tr.id}/download`, 
							                     tr.fileExtension, tr.name)}
                                                className="btn btn-custom-editar m-2">
                                               <FontAwesomeIcon icon={faDownload} /> Descargar
                                               </button>
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
									<option value={0}>Selecciona...</option>
									{taskType.map((ts) => (
										<option key={ts.id} value={ts.id}>
											{ts.description + " - " + ts.name}
										</option>
									))}
								</select>
							</div>
							<div className="form-group mt-3">
								<label htmlFor="hazzard">Verificadores:</label>
								<Select
									isMulti
									value={opcionesVerificadores.filter((option) =>selectedCheckerIds.includes(option.value)
									)}
									onChange={(selectedOptions) => {
										const selectedIds = selectedOptions.map((option) => option.value);
										setSelectedCheckerIds(selectedIds);
									}}
									options={opcionesVerificadores}
								/>
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
												<img src={uploadedImageUrl} alt="Vista previa" />
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



