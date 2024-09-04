// import React, { useEffect, useState, useRef } from "react";
// import axios, { AxiosResponse } from "axios";
// import Swal from "sweetalert2";
// import withReactContent from "sweetalert2-react-content";
// import { showAlert } from "../functions";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
// import EncabezadoTabla from "../EncabezadoTabla/EncabezadoTabla";
// import * as bootstrap from "bootstrap";

// const MySwal = withReactContent(Swal);

// interface Position {
// 	id: string;
// 	name: string;
// 	description: string;
// 	createDate: string;
// 	managerPosition: Position | null; 
// 	subordinatePositions: Position[]; 
// }

// interface subordinatePositions {
// 	id: string;
// 	name: string;
// 	description: string;
// }

// const PositionComponent: React.FC = () => {
// 	const baseURL = import.meta.env.VITE_API_URL;
// 	const [position, setPosition] = useState<Position[]>([]);
// 	const [id, setId] = useState<string>("");
// 	const [name, setName] = useState<string>("");
// 	const [description, setDescription] = useState<string>("");
// 	const [createDate, setCreateDate] = useState<string>("");
// 	const [managerPosition, setManagerPosition] = useState<string | null>(null);
// 	const [subordinatePositions, setSubordinatePositions] = useState<string[]>([]);
// 	const [title, setTitle] = useState<string>("");
// 	const modalRef = useRef<HTMLDivElement | null>(null);
// 	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

// 	useEffect(() => {
// 		getPosition();
// 		if (modalRef.current) {
// 			modalRef.current.addEventListener("hidden.bs.modal", handleModalHidden);
// 		}
// 		return () => {
// 			if (modalRef.current) {
// 				modalRef.current.removeEventListener("hidden.bs.modal", handleModalHidden);
// 			}
// 		};
// 	}, []);

// 	const getPosition = async () => {
// 		try {
// 			const response: AxiosResponse<Position[]> = await axios.get(`${baseURL}/position/`);
// 			setPosition(response.data);
// 		} catch (error) {
// 			showAlert("Error al obtener la Posición", "error");
// 		}
// 	};

// 	const openModal = (op: string, position?: Position) => {
// 		if (position) {
// 			setId(position.id);
// 			setName(position.name);
// 			setDescription(position.description);
// 			setManagerPosition(position.managerPosition ? position.managerPosition.id : null);
// 			setSubordinatePositions(position.subordinatePositions.map((sub) => sub.id));
// 		} else {
// 			setId("");
// 			setName("");
// 			setDescription("");
// 			setManagerPosition(null);
// 			setSubordinatePositions([]);
// 		}
// 		setTitle(op === "1" ? "Registrar Cargo" : "Editar Cargo");

// 		if (modalRef.current) {
// 			const modal = new bootstrap.Modal(modalRef.current);
// 			modal.show();
// 			setIsModalOpen(true);
// 		}
// 	};

// 	const handleModalHidden = () => {
// 		setIsModalOpen(false);
// 		const modals = document.querySelectorAll(".modal-backdrop");
// 		modals.forEach((modal) => modal.parentNode?.removeChild(modal));
// 	};

// 	const validar = () => {
// 		if (!name.trim()) {
// 			showAlert("Escribe el nombre", "warning", "nombre");
// 			return;
// 		}
// 		if (!description.trim()) {
// 			showAlert("Escribe la descripción", "warning", "descripción");
// 			return;
// 		}


// 		const parametros: Position = {
// 			id,
// 			name: name.trim(),
// 			description: description.trim(),
// 			createDate: createDate.trim(),
// 			managerPosition: position.find(pos => pos.id === managerPosition) || null,
// 			subordinatePositions: position.filter(pos => subordinatePositions.includes(pos.id)),
// 		};

// 		const metodo = id ? "PUT" : "POST";
// 		enviarSolicitud(metodo, parametros);


// 	};
	

// const enviarSolicitud = async (method: "POST" | "PUT", data: any) => {
// 	try {
// 	  const url = method === "PUT" && id ? `${baseURL}/position/${id}` : `${baseURL}/position/`;
// 	  const response = await axios({
// 		method,
// 		url,
// 		data,
// 		headers: { "Content-Type": "application/json" },
// 	  });
  
// 	  showAlert("Operación realizada con éxito", "success");
// 	  getPosition();
// 	  if (modalRef.current) {
// 		const modal = bootstrap.Modal.getInstance(modalRef.current);
// 		modal?.hide();
// 	  }
// 	} catch (error) {
// 	  if (axios.isAxiosError(error) && error.response) {
// 		showAlert(`Error: ${error.response.data.message || "No se pudo completar la solicitud."}`, "error");
// 	  } else {
// 		showAlert("Error al realizar la solicitud", "error");
// 	  }
// 	}
//   }; 

// 	const deleteCargo = async (id: string) => {
// 		try {
// 		  await axios.delete(`${baseURL}/position/${id}`, {
// 			headers: { "Content-Type": "application/json" },
// 		  });
// 		  Swal.fire("Cargo eliminado correctamente", "", "success");
// 		  getPosition();
// 		} catch (error) {
// 		  console.error(error);
// 		  Swal.fire({
// 			title: "Error",
// 			text: "Error al eliminar el Cargo.",
// 			icon: "error",
// 			confirmButtonText: "OK",
// 		  });
// 		}
// 	  };

//   const formatDate = (dateString: string) => {
// 		return dateString.split("T")[0];
// 	};

// 	return (
// 		<div className="App">
// 			<div className="container-fluid">
// 				<div className="row mt-3">
// 					<div className="col-12">
// 						<div className="tabla-contenedor">
// 							<EncabezadoTabla title="Cargos" onClick={() => openModal("1")} />
// 						</div>
// 						<div className="table-responsive">
// 							<table className="table table-bordered">
// 								<thead
// 									className="text-center"
// 									style={{
// 										background: "linear-gradient(90deg, #009FE3 0%, #00CFFF 100%)",
// 										color: "#fff",
// 									}}>
// 									<tr>
// 										<th>ID</th>
// 										<th>Cargo</th>
// 										<th>Jefatura</th>
// 										<th>Equipo</th>
// 										<th >Acciones</th>
// 									</tr>
// 								</thead>
// 								<tbody className="table-group-divider">
// 									{position.map((pos, i) => (
// 										<tr key={pos.id} className="text-center">
// 											<td>{i + 1}</td>
// 											<td>{pos.name}</td>
// 											<td>{pos.managerPosition?.name}</td>
// 											<td>{pos.subordinatePositions.map((subPos) => subPos.name).join(", ")}</td>
// 											<td className="text-center p-3">
// 												<button
// 													onClick={() => openModal("2", pos)}
// 													className="btn btn-custom-editar m-2"
// 													data-bs-toggle="modal"
// 													data-bs-target="#modalUsers"
// 												>
// 													<i className="fa-solid fa-edit"></i>
// 												</button>
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
// 																deleteCargo(pos.id);
// 															}
// 														});
// 													}}
// 												>
// 													<FontAwesomeIcon icon={faCircleXmark} />
// 												</button>
// 											</td>
// 										</tr>
// 									))}
// 								</tbody>
// 							</table>
// 						</div>
// 					</div>
// 				</div>
// 				<div
// 					className="modal fade"
// 					id="modalUsers"
// 					ref={modalRef}
// 					data-bs-backdrop="true"
// 					data-bs-keyboard="false"
// 					tabIndex={-1}
// 					aria-labelledby="modalTitle"
// 					aria-hidden="true"
// 				>
// 					<div className="modal-dialog">
// 						<div className="modal-content">
// 							<div className="modal-header">
// 								<h1 className="modal-title fs-5" id="modalTitle">
// 									{title}
// 								</h1>
// 								<button
// 									type="button"
// 									className="btn-close"
// 									data-bs-dismiss="modal"
// 									aria-label="Close"
// 								></button>
// 							</div>
// 							<div className="modal-body">
// 								<div className="input-group mb-3">
// 									<span className="input-group-text">
// 										<i className="fa-solid fa-user"></i>
// 									</span>
// 									<input
// 										type="text"
// 										id="name"
// 										className="form-control"
// 										placeholder="Nombre"
// 										value={name}
// 										onChange={(e) => setName(e.target.value)}
// 									/>
// 								</div>
// 								<div className="input-group mb-3">
// 									<span className="input-group-text">
// 										<i className="fa-solid fa-envelope"></i>
// 									</span>
// 									<input
// 										type="text"
// 										id="description"
// 										className="form-control"
// 										placeholder="Descripción"
// 										value={description}
// 										onChange={(e) => setDescription(e.target.value)}
// 									/>
// 								</div>

// 								<div className="input-group mb-3">
// 									<span className="input-group-text">
// 										<i className="fa-solid fa-user-tie"></i>
// 									</span>
// 									<select
// 										className="form-select"
// 										value={managerPosition ?? ""}
// 										onChange={(e) => setManagerPosition(e.target.value || null)}
// 									>
// 										<option value="">Seleccione una posición</option>
// 										{position.map((pos) => (
// 											<option key={pos.id} value={pos.id}>
// 												{pos.name}
// 											</option>
// 										))}
// 									</select>
// 								</div>
// 							</div>
// 							<div className="modal-footer">
// 								<button
// 									type="button"
// 									className="btn btn-secondary"
// 									data-bs-dismiss="modal"
// 									id="btnCerrar"
// 								>
// 									Close
// 								</button>
// 								<button type="button" className="btn btn-primary" onClick={() => validar()}>
// 									Guardar
// 								</button>
// 							</div>
// 						</div>
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

// export default PositionComponent;




// import React, { useEffect, useState, useRef } from "react";
// import axios, { AxiosResponse } from "axios";
// import Swal from "sweetalert2";
// import withReactContent from "sweetalert2-react-content";
// import { showAlert } from '../functions';
// import { OverlayTrigger, Tooltip } from 'react-bootstrap';
// import EncabezadoTabla from "../EncabezadoTabla/EncabezadoTabla";
// import Select from 'react-select';
// import { Accordion, AccordionItem, AccordionHeader, AccordionBody } from 'react-bootstrap';
// import * as bootstrap from 'bootstrap';


// const MySwal = withReactContent(Swal);


// interface Position {
//   id: number;
//   name: string;
//   description: string;
//   createDate: string;
//   updateDate: string;
//   managerPosition: managerPosition;
//   subordinatePositions: subordinatePositions[];
// }


// interface subordinatePositions {
//   id: number;
//   name: string;
//   description: string;
//   createDate: string;
//   updateDate: string;
// }

// interface managerPosition {
//   id: number;
//   name: string;
//   description: string;
//   createDate?: string;
//   updateDate?: string;
// }


// interface PositionData{
//   name: string;
//   description: string;
//   managerId: number;
//   divisionIds: number[];
// }

// const Position: React.FC = () => {

//   const baseURL = import.meta.env.VITE_API_URL;
//   const [position, setPosition] = useState<Position[]>([]);
//   const [description, setDescription] = useState<string>("");
//   const [managerPosition, setManagerPosition] = useState<managerPosition[]>([]);
//   const [subordinatePositions, setSubordinatePositions] = useState<subordinatePositions[]>([]);
//   const [id, setId] = useState<number | null>(null);
//   const [name, setName] = useState<string>("");
//   const [selectedActivityTypeId, setSelectedActivityTypeId] = useState<number>(0);
//   const [selectedManagerId, setSelectedManagerId] = useState<number>(0);
//   const [selectedDivisionIds, setSelectedDivisionIds] = useState<number[]>([]);
//   const [title, setTitle] = useState<string>("");
//   const modalRef = useRef<HTMLDivElement | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

//   useEffect(() => {
//     getPosition();
//     getManagerPosition(); 
//     getSubordinatePositions();
//     if (modalRef.current) {
//       modalRef.current.addEventListener('hidden.bs.modal', handleModalHidden);
//     }
//     return () => {
//       if (modalRef.current) {
//         modalRef.current.removeEventListener('hidden.bs.modal', handleModalHidden);
//       }
//     };
//   }, []);

//   const getPosition = async () => {
//     try {
//       const response: AxiosResponse<Position[]> = await axios.get(`${baseURL}/position/`);
//       setPosition(response.data);
//     } catch (error) {
//       showAlert("Error al obtener los Cargos", "error");
//     }
//   };
  
  
//   const getManagerPosition = async () => {
//     try {
//       const response: AxiosResponse<managerPosition[]> = await axios.get(`${baseURL}/division/`);
//       setManagerPosition(response.data);
//     } catch (error) {
//       showAlert("Error al obtener los procesos", "error");
//     }
//   }; 

//   const getSubordinatePositions = async () => {
//     try {
//     //   const response: AxiosResponse<subordinatePositions[]> = await axios.get(`${baseURL}/position/id/${selectedManagerId}`);
// 	  const response: AxiosResponse<subordinatePositions[]> = await axios.get(`${baseURL}/position/`);
//       setSubordinatePositions(response.data);
//     } catch (error) {
//       showAlert("Error al obtener las Subordinaciones", "error");
//     }
//   }; 

//   const openModal = (op: string, position?: Position) => {
//     if (op === "1") {
//       setId(null);
//       setName("");
//       setDescription("");
//       setSelectedDivisionIds([]);
//       setSelectedManagerId(0);
//       setTitle("Registrar Cargo");
//     } else if (op === "2" && position) {
//       setId(position?.id || null);
//       setName(position.name);
//       setDescription(position.description);
//       setSelectedDivisionIds(position.subordinatePositions.map(h => h.id));
//       setSelectedManagerId(position.managerPosition.id);
//       setTitle("Editar Perfil");
//     }

//     if (modalRef.current) {
//       const modal = new bootstrap.Modal(modalRef.current);
//       modal.show();
//       setIsModalOpen(true);
//     }
//   };

//   const handleModalHidden = () => {
//     setIsModalOpen(false);
//     const modals = document.querySelectorAll('.modal-backdrop');
//     modals.forEach(modal => modal.parentNode?.removeChild(modal));
//   };

//   const validar = (): void => {
//     if (name.trim() === "") {
//         showAlert("Escribe el nombre del Cargo", "warning");
//         return;
//     }
    
//     if (selectedManagerId === 0) {
//         showAlert("Selecciona Jefatura", "warning");
//         return;
//     }
//     if (selectedDivisionIds.length === 0) {
//         showAlert("Selecciona al menos una tarea", "warning");
//         return;
//     }

//     const parametros : PositionData = {
//       name: name.trim(),
//       description: description.trim(),
//       managerId: selectedManagerId,
//       divisionIds: selectedDivisionIds,  
//     };
    
//     const metodo: "PUT" | "POST" = id ? "PUT" : "POST";
//     enviarSolicitud(metodo, parametros);

//     console.log("Payload enviado:", parametros);
// };

// const enviarSolicitud = async (method: "POST" | "PUT", data: PositionData) => {
//   try {
//     const url = method === "PUT" && id ? `${baseURL}/position/${id}` : `${baseURL}/position/`;
//     const response = await axios({
//       method,
//       url,
//       data,
//       headers: { "Content-Type": "application/json" },
//     });

//     const newActividad = response.data; 

//     showAlert("Operación realizada con éxito", "success");

//     if (method === "POST") {
//       setPosition((prev) => [...prev, newActividad]);
//     } else if (method === "PUT") {
//       setPosition((prev) =>
//         prev.map((prof) => (prof.id === newActividad.id ? newActividad : prof))
//       );
//     }


//     if (modalRef.current) {
//       const modal = bootstrap.Modal.getInstance(modalRef.current);
//       modal?.hide();
//     }
//   } catch (error) {
//     if (axios.isAxiosError(error) && error.response) {
//       showAlert(`Error: ${error.response.data.message || "No se pudo completar la solicitud."}`, "error");
//     } else {
//       showAlert("Error al realizar la solicitud", "error");
//     }
//   }
// };



//   const deleteCargos = async (id: number) => {
//     try {
//       await axios.delete(`${baseURL}/position/${id}`, {
//         headers: { "Content-Type": "application/json" },
//       });
//       Swal.fire("Cargo eliminado correctamente", "", "success");
//       getPosition();
//     } catch (error) {
//       console.error(error);
//       Swal.fire({
//         title: "Error",
//         text: "Error al eliminar el Cargo.",
//         icon: "error",
//         confirmButtonText: "OK",
//       });
//     }
//   };

  

//   const renderEditTooltip = (props: React.HTMLAttributes<HTMLDivElement>) => (
//     <Tooltip id="button-tooltip-edit" {...props}>
//       Editar
//     </Tooltip>
//   );

//   const renderDeleteTooltip = (props: React.HTMLAttributes<HTMLDivElement>) => (
//     <Tooltip id="button-tooltip-delete" {...props}>
//       Eliminar
//     </Tooltip>
//   );

//   const handleHazzardSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     const selectedOptions = Array.from(event.target.selectedOptions, option => Number(option.value));
//     console.log(selectedOptions); 
//     setSelectedDivisionIds(selectedOptions);
//   };
  

//   const formatDate = (dateString: string) => {
//     return dateString.split('T')[0];
//   };

//   const opcionesEquipo = subordinatePositions.map(subordinatePositions => ({
//     value: subordinatePositions.id,
//     label: subordinatePositions.description,
//   }));

//   return (
// 		<div className="App">
// 			<div className="container-fluid">
// 				<div className="row mt-3">
// 					<div className="col-12">
// 						<div className="tabla-contenedor">
// 							<EncabezadoTabla title="Cargos" onClick={() => openModal("1")} />
// 						</div>
// 						<div className="table-responsive">
// 							<table className="table table-bordered">
// 								<thead
// 									className="text-center"
// 									style={{
// 										background: "linear-gradient(90deg, #009FE3 0%, #00CFFF 100%)",
// 										color: "#fff",
// 									}}
// 								>
// 									<tr>
// 										<th>ID</th>
// 										<th>Cargo</th>
// 										<th>Jefatura</th>
// 										<th>Equipo</th>
// 										<th>Acciones</th>
// 									</tr>
// 								</thead>
// 								<tbody className="table-group-divider">
// 									{position.length > 0 &&
// 										position.map((pos, i) => (
// 											<tr key={JSON.stringify(pos)} className="text-center">
// 												<td>{i + 1}</td>
// 												<td>{pos.name}</td>
// 												<td>{pos.managerPosition?.name || "N/A"}</td>
// 												<td>
// 													<Accordion>
// 														<Accordion.Item eventKey="0">
// 															<Accordion.Header>Equipo de Jefatura</Accordion.Header>
// 															<Accordion.Body>
// 																<ul>
// 																	{pos.subordinatePositions?.map((sub) => (
// 																		<li key={sub.id}>{sub.description}</li>
// 																	)) || "No hay datos"}
// 																</ul>
// 															</Accordion.Body>
// 														</Accordion.Item>
// 													</Accordion>
// 												</td>
// 												<td className="text-center">
// 													<OverlayTrigger placement="top" overlay={renderEditTooltip({})}>
// 														<button
// 															onClick={() => openModal("2", pos)}
// 															className="btn btn-custom-editar m-2"
// 														>
// 															<i className="fa-solid fa-edit"></i>
// 														</button>
// 													</OverlayTrigger>
// 													<OverlayTrigger placement="top" overlay={renderDeleteTooltip({})}>
// 														<button
// 															className="btn btn-custom-danger"
// 															onClick={() => deleteCargos(pos.id)}
// 														>
// 															<i className="fa-solid fa-circle-xmark"></i>
// 														</button>
// 													</OverlayTrigger>
// 												</td>
// 											</tr>
// 										))}
// 								</tbody>
// 							</table>
// 						</div>
// 					</div>
// 				</div>
// 				<div className="modal fade" id="modalHazzard" tabIndex={-1} ref={modalRef}>
// 					<div className="modal-dialog modal-dialog-top modal-md">
// 						<div className="modal-content">
// 							<div className="modal-header">
// 								<h5 className="modal-title w-100">{title}</h5>
// 								<button
// 									type="button"
// 									className="btn-close"
// 									data-bs-dismiss="modal"
// 									aria-label="Close"
// 								></button>
// 							</div>
// 							<div className="modal-body">
// 								<div className="input-group mb-3">
// 									<span className="input-group-text">
// 										<i className="fa-solid fa-address-card"></i>
// 									</span>
// 									<input
// 										type="text"
// 										className="form-control"
// 										placeholder="Nombre del Cargo"
// 										value={name}
// 										onChange={(e) => setName(e.target.value)}
// 									/>
// 								</div>
// 								<div className="mb-3">
// 									<label htmlFor="managerPosition" className="form-label">
// 										Jefatura:
// 									</label>
// 									<select
// 										id="managerPosition"
// 										className="form-select"
// 										value={selectedManagerId}
// 										onChange={(e) => setSelectedManagerId(Number(e.target.value))}
// 									>
// 										<option value={0}>Selecciona la Jefatura</option>
// 										{managerPosition.map((proc) => (
// 											<option key={JSON.stringify(proc)} value={proc.id}>
// 												{proc.name}
// 											</option>
// 										))}
// 									</select>
// 								</div>
// 								<div className="form-group mt-3">
// 									<label htmlFor="hazzard">Equipo:</label>
// 									<Select
// 										isMulti
// 										value={opcionesEquipo.filter((option) =>
// 											selectedDivisionIds.includes(option.value)
// 										)}
// 										onChange={(selectedOptions) => {
// 											const selectedIds = selectedOptions.map((option) => option.value);
// 											setSelectedDivisionIds(selectedIds);
// 										}}
// 										options={opcionesEquipo}
// 									/>
// 								</div>
// 							</div>
// 							<div className="modal-footer">
// 								<button
// 									type="button"
// 									className="btn btn-secondary"
// 									data-bs-dismiss="modal"
// 									id="btnCerrar"
// 								>
// 									Cerrar
// 								</button>
// 								<button type="button" className="btn btn-primary" onClick={validar}>
// 									Guardar
// 								</button>
// 							</div>
// 						</div>
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

// export default Position;





import React, { useEffect, useState, useRef } from "react";
import axios, { AxiosResponse } from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { showAlert } from '../functions';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import EncabezadoTabla from "../EncabezadoTabla/EncabezadoTabla";
import Select from 'react-select';
import { Accordion } from 'react-bootstrap';
import * as bootstrap from 'bootstrap';

const MySwal = withReactContent(Swal);

interface Position {
  id: number;
  name: string;
  description: string;
  createDate: string;
  updateDate: string;
  managerPosition: ManagerPosition;
  subordinatePositions: SubordinatePosition[];
}

interface SubordinatePosition {
  id: number;
  name: string;
  description: string;
  createDate: string;
  updateDate: string;
}

interface ManagerPosition {
  id: number;
  name: string;
  description: string;
  createDate?: string;
  updateDate?: string;
}

interface PositionData {
  name: string;
  description: string;
  managerId: number;
  divisionIds: number[];
}

const Position: React.FC = () => {
  const baseURL = import.meta.env.VITE_API_URL;
  const [positions, setPositions] = useState<Position[]>([]);
  const [description, setDescription] = useState<string>("");
  const [managerPosition, setManagerPosition] = useState<ManagerPosition[]>([]);
  const [subordinatePositions, setSubordinatePositions] = useState<SubordinatePosition[]>([]);
  const [id, setId] = useState<number | null>(null);
  const [name, setName] = useState<string>("");
  const [selectedManagerId, setSelectedManagerId] = useState<number>(0);
  const [selectedDivisionIds, setSelectedDivisionIds] = useState<number[]>([]);
  const [title, setTitle] = useState<string>("");
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    getPositions();
    getManagerPositions();
    getSubordinatePositions();
    if (modalRef.current) {
      modalRef.current.addEventListener('hidden.bs.modal', handleModalHidden);
    }
    return () => {
      if (modalRef.current) {
        modalRef.current.removeEventListener('hidden.bs.modal', handleModalHidden);
      }
    };
  }, []);

  const getPositions = async () => {
    try {
      const response: AxiosResponse<Position[]> = await axios.get(`${baseURL}/position/`);
      setPositions(response.data);
    } catch (error) {
      showAlert("Error al obtener los Cargos", "error");
    }
  };

  const getManagerPositions = async () => {
    try {
      const response: AxiosResponse<ManagerPosition[]> = await axios.get(`${baseURL}/division/`);
      setManagerPosition(response.data);
    } catch (error) {
      showAlert("Error al obtener las Jefaturas", "error");
    }
  };

  const getSubordinatePositions = async () => {
    try {
      const response: AxiosResponse<SubordinatePosition[]> = await axios.get(`${baseURL}/position/`);
      setSubordinatePositions(response.data);
    } catch (error) {
      showAlert("Error al obtener las Tareas", "error");
    }
  };

  const openModal = (op: string, position?: Position) => {
    if (op === "1") {

      setId(null);
      setName("");
      setDescription("");
      setSelectedDivisionIds([]);
      setSelectedManagerId(0);
      setTitle("Registrar Cargo");
    } else if (op === "2" && position) {

      setId(position.id || null);
      setName(position.name);
      setDescription(position.description);
      setSelectedDivisionIds(position.subordinatePositions.map(sp => sp.id));
      setSelectedManagerId(position.managerPosition.id);
      setTitle("Editar Cargo");
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

  const validar = (): void => {
    if (name.trim() === "") {
      showAlert("Escribe el nombre del Cargo", "warning");
      return;
    }
	if (description.trim() === "") {
        showAlert("Escribe la descripción del Cargo", "warning");
     }

    if (selectedManagerId === 0) {
      showAlert("Selecciona Jefatura", "warning");
      return;
    }

    if (selectedDivisionIds.length === 0) {
      showAlert("Selecciona al menos una tarea", "warning");
      return;
    }

    const parametros: PositionData = {
      name: name.trim(),
      description: description.trim(),
      managerId: selectedManagerId,
      divisionIds: selectedDivisionIds,
    };

    const metodo: "PUT" | "POST" = id ? "PUT" : "POST";
    enviarSolicitud(metodo, parametros);
  };

  const enviarSolicitud = async (method: "POST" | "PUT", data: PositionData) => {
    try {
      const url = method === "PUT" && id ? `${baseURL}/position/${id}` : `${baseURL}/position/`;
      const response = await axios({
        method,
        url,
        data,
        headers: { "Content-Type": "application/json" },
      });

      const newActividad = response.data;

      showAlert("Operación realizada con éxito", "success");

      if (method === "POST") {
        setPositions((prev) => [...prev, newActividad]);
      } else if (method === "PUT") {
        setPositions((prev) =>
          prev.map((pos) => (pos.id === newActividad.id ? newActividad : pos))
        );
      }

      if (modalRef.current) {
        const modal = bootstrap.Modal.getInstance(modalRef.current);
        modal?.hide();
      }
    } catch (error) {
      showAlert("Error al realizar la solicitud", "error");
    }
  };

  const deletePosition = async (id: number) => {
    try {
      await axios.delete(`${baseURL}/position/${id}`);
      Swal.fire("Cargo eliminado correctamente", "", "success");
      getPositions();
    } catch (error) {
      showAlert("Error al eliminar el Cargo", "error");
    }
  };

  const opcionesEquipo = subordinatePositions.map(sp => ({
    value: sp.id,
    label: sp.description,
  }));

  return (
    <div className="App">
      <div className="container-fluid">
        <div className="row mt-3">
          <div className="col-12">
            <div className="tabla-contenedor">
              <EncabezadoTabla title="Cargos" onClick={() => openModal("1")} />
            </div>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead
                  className="text-center"
                  style={{ background: 'linear-gradient(90deg, #009FE3 0%, #00CFFF 100%)', color: '#fff' }}>
                  <tr>
                    <th>ID</th>
                    <th>Cargo</th>
                    <th>Jefatura</th>
                    <th>Equipo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                  {positions.map((pos, i) => (
                    <tr key={pos.id} className="text-center">
                      <td>{i + 1}</td>
                      <td>{pos.name}</td>
                      <td>{pos.managerPosition?.name || 'N/A'}</td>
                      <td>
                        <Accordion>
                          <Accordion.Item eventKey="0">
                            <Accordion.Header>Equipo de Jefatura</Accordion.Header>
                            <Accordion.Body>
                              <ul>
                                {pos.subordinatePositions.map(sub => (
                                  <li key={sub.id}>{sub.description}</li>
                                ))}
                              </ul>
                            </Accordion.Body>
                          </Accordion.Item>
                        </Accordion>
                      </td>
                      <td>
                        <OverlayTrigger placement="top" overlay={<Tooltip id="edit-tooltip">Editar</Tooltip>}>
                          <button onClick={() => openModal("2", pos)} className="btn btn-custom-editar m-2">
                            <i className="fa-solid fa-edit"></i>
                          </button>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip id="delete-tooltip">Eliminar</Tooltip>}>
                          <button className="btn btn-custom-danger" onClick={() => deletePosition(pos.id)}>
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

        <div className="modal fade" id="modalHazzard" tabIndex={-1} ref={modalRef}>
          <div className="modal-dialog modal-dialog-top modal-md">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title w-100">{title}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body">
                <div className="input-group mb-3">
                  <span className="input-group-text">
                    <i className="fa-solid fa-address-card"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nombre del Cargo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="managerPosition">Jefatura:</label>
                  <select
                    id="managerPosition"
                    className="form-select"
                    value={selectedManagerId}
                    onChange={(e) => setSelectedManagerId(Number(e.target.value))}
                  >
                    <option value={0}>Selecciona la Jefatura</option>
                    {managerPosition.map((proc) => (
                      <option key={proc.id} value={proc.id}>
                        {proc.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group mt-3">
                  <label htmlFor="hazzard">Equipo:</label>
                  <Select
                    isMulti
                    value={opcionesEquipo.filter((option) => selectedDivisionIds.includes(option.value))}
                    onChange={(selectedOptions) => {
                      const selectedIds = selectedOptions.map((option) => option.value);
                      setSelectedDivisionIds(selectedIds);
                    }}
                    options={opcionesEquipo}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
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

export default Position;
