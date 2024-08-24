// import React, { useEffect, useState, useRef } from "react";
// import axios, { AxiosResponse } from "axios";
// import Swal from "sweetalert2";
// import withReactContent from "sweetalert2-react-content";
// import { showAlert } from "../functions";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
// import { OverlayTrigger, Tooltip } from 'react-bootstrap';
// import EncabezadoTabla from "../EncabezadoTabla/EncabezadoTabla";
// import * as bootstrap from "bootstrap";

// const MySwal = withReactContent(Swal);

// interface Profile {
// 	id: string;
// 	name: string;
// 	description: string;
// 	createDate: string;
// 	// createDate: Date;
// 	tasks: string;
// }

// const Profiles: React.FC = () => {
// 	const URL = "https://asymetricsbackend.uk.r.appspot.com/profile/";
// 	const [profiles, setProfiles] = useState<Profile[]>([]);
// 	const [id, setId] = useState<string>("");
// 	const [name, setName] = useState<string>("");
// 	const [description, setDescription] = useState<string>("");
// 	const [createDate, setCreateDate] = useState<string>("");
// 	// const [createDate, setCreateDate] = useState<Date | null>(null);
// 	const [tasks, setTasks] = useState<string>("");
// 	const [title, setTitle] = useState<string>("");
// 	const modalRef = useRef<HTMLDivElement | null>(null);
// 	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

// 	useEffect(() => {
// 		getProfiles();
// 		if (modalRef.current) {
// 			modalRef.current.addEventListener("hidden.bs.modal", handleModalHidden);
// 		}
// 		return () => {
// 			if (modalRef.current) {
// 				modalRef.current.removeEventListener("hidden.bs.modal", handleModalHidden);
// 			}
// 		};
// 	}, []);

// 	const getProfiles = async () => {
// 		try {
// 			const response: AxiosResponse<Profile[]> = await axios.get(URL);
// 			/*CODIGO EN CRUDO BORRAR CUANDO SE NECESITE EL DATO DE FECHA**/
// 			const formattedProfiles = response.data.map((profile) => ({
// 				...profile,
// 				createDate: new Date(profile.createDate).toLocaleString(),
// 			}));
// 			/*CODIGO EN CRUDO BORRAR CUANDO SE NECESITE EL DATO DE FECHA**/
// 			setProfiles(response.data);
// 		} catch (error) {
// 			showAlert("Error al obtener los perfiles", "error");
// 		}
// 	};

// 	const openModal = (op: string, profile?: Profile) => {
// 		if (profile) {
// 			setId(profile.id);
// 			setName(profile.name);
// 			setDescription(profile.description);
// 			// setCreateDate(new Date(profile.createDate));
// 			setCreateDate(profile.createDate);
// 			setTasks(profile.tasks);
// 		} else {
// 			setId("");
// 			setName("");
// 			setDescription("");
// 			// setCreateDate(null);
// 			setCreateDate("");
// 			setTasks("");
// 		}
// 		setTitle(op === "1" ? "Registrar Perfil" : "Editar Perfil");

// 		setTimeout(() => {
// 			document.getElementById("nombre")?.focus();
// 		}, 500);

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
// 		if (name.trim() === "") {
// 			showAlert("Escribe el nombre del proceso", "warning", "nombre");
// 			return;
// 		}
// 		if (description.trim() === "") {
// 			showAlert("Escribe la descripción", "warning", "description");
// 			return;
// 		}
// 		// if (!createDate || isNaN(createDate.getTime())) {
// 		//   showAlert("Escribe la fecha de creación", "warning", "createDate");
// 		//   return;
// 		// }
// 		if (createDate.trim() === "") {
// 			showAlert("Escribe la fecha de creación", "warning", "createDate");
// 			return;
// 		}
// 		if (tasks.trim() === "") {
// 			showAlert("Escribe las procesos", "warning", "tasks");
// 			return;
// 		}

// 		const parametros = {
// 			id,
// 			name: name.trim(),
// 			description: description.trim(),
// 			// createDate: createDate || new Date(),
// 			createDate: createDate.trim(),
// 			tasks: tasks.trim(),
// 		};
// 		const metodo = id ? "PUT" : "POST";
// 		enviarSolicitud(metodo, parametros);
// 	};

// 	const enviarSolicitud = async (method: "POST" | "PUT", data: any) => {
// 		try {
// 			const url = method === "PUT" && id ? `${URL}${id}` : URL;
// 			const response = await axios({
// 				method,
// 				url,
// 				data,
// 				headers: { "Content-Type": "application/json" },
// 			});

// 			const { tipo, msj } = response.data;
// 			showAlert(msj, tipo);
// 			getProfiles();
// 			if (tipo === "success") {
// 				setTimeout(() => {
// 					const closeModalButton = document.getElementById("btnCerrar");
// 					if (closeModalButton) {
// 						closeModalButton.click();
// 					}
// 					getProfiles();
// 				}, 500);
// 			}
// 		} catch (error) {
// 			showAlert("Error al enviar la solicitud", "error");
// 			console.error(error);
// 		}
// 	};

// 	const deleteProfile = async (id: string) => {
// 		try {
// 			await axios.delete(`${URL}${id}`, {
// 				headers: {
// 					"Content-Type": "application/json",
// 				},
// 			});
// 			showAlert("Perfil eliminado correctamente", "success");
// 			getProfiles();
// 		} catch (error) {
// 			showAlert("Error al eliminar el perfil", "error");
// 			console.error(error);
// 		}
// 	};

// 	const renderEditTooltip = (props: React.HTMLAttributes<HTMLDivElement>) => (
// 		<Tooltip id="button-tooltip-edit" {...props}>
// 		  Editar
// 		</Tooltip>
// 	  );
	  
// 	  const renderDeleteTooltip = (props: React.HTMLAttributes<HTMLDivElement>) => (
// 		<Tooltip id="button-tooltip-delete" {...props}>
// 		  Eliminar
// 		</Tooltip>
// 	  );

// 	return (
// 		<div className="App">
// 			<div className="container-fluid">
// 				<div className="row mt-3">
// 					<div className="col-12">
// 						<div className="tabla-contenedor">
// 							<EncabezadoTabla title='Perfiles' onClick={() => openModal("1")} />
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
// 										<th>Nombre</th>
// 										<th>Descripción</th>
// 										<th>Fecha de Creación</th>
// 										<th>Tareas</th>
// 										<th>Acciones</th>
// 									</tr>
// 								</thead>
// 								<tbody className="table-group-divider">
// 									{profiles.map((profile, i) => (
// 										<tr key={profile.id} className="text-center">
// 											<td>{i + 1}</td>
// 											<td>{profile.name}</td>
// 											<td>{profile.description}</td>
// 											{/* <td>{new Date(profile.createDate).toLocaleString()}</td> */}
// 											<td>{profile.createDate}</td>
// 											<td>{profile.tasks}</td>
// 											<td className="text-center">
// 												<OverlayTrigger placement="top" overlay={renderEditTooltip}>
// 												<button
// 													onClick={() => openModal("2", profile)}
// 													className="btn btn-custom-editar m-2"
// 													data-bs-toggle="modal"
// 													data-bs-target="#modalProfiles"
// 												>
// 													<i className="fa-solid fa-edit"></i>
// 												</button>
// 												</OverlayTrigger>
// 												<OverlayTrigger placement="top" overlay={renderDeleteTooltip}>
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
// 																deleteProfile(profile.id);
// 															}
// 														});
// 													}}
// 												>
// 													<FontAwesomeIcon icon={faCircleXmark} />
// 												</button>
// 												</OverlayTrigger>
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
// 					id="modalProfiles"
// 					data-bs-backdrop="true"
// 					data-bs-keyboard="true"
// 					aria-labelledby="staticBackdropLabel"
// 					aria-hidden="true"
// 				>
// 					<div className="modal-dialog">
// 						<div className="modal-content">
// 							<div className="modal-header text-white">
// 								<label className="h5">{title}</label>
// 								<button
// 									type="button"
// 									className="btn-close"
// 									data-bs-dismiss="modal"
// 									aria-label="Close"
// 								></button>
// 							</div>
// 							<div className="modal-body">
// 								<input type="hidden" id="id" />
// 								<div className="input-group mb-3">
// 									<span className="input-group-text">
// 										<i className="fa-solid fa-user"></i>
// 									</span>
// 									<input
// 										type="text"
// 										id="nombre"
// 										className="form-control"
// 										placeholder="Nombre"
// 										value={name}
// 										onChange={(e) => setName(e.target.value)}
// 									/>
// 								</div>
// 								<div className="input-group mb-3">
// 									<span className="input-group-text">
// 										<i className="fa-regular fa-envelope"></i>
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
// 										<i className="fa-solid fa-calendar"></i>
// 									</span>
// 									<input
// 										type="text"
// 										id="createDate"
// 										className="form-control"
// 										placeholder="Fecha de creación"
// 										value={createDate}
// 										onChange={(e) => setCreateDate(e.target.value)}
// 									/>
// 									{/* <input
//                     type="datetime-local"
//                     id="createDate"
//                     className="form-control"
//                     value={createDate ? createDate.toISOString().substring(0, 16) : ""}
//                     onChange={(e) => setCreateDate(e.target.value ? new Date(e.target.value) : null)}
//                   /> */}
// 								</div>
// 								<div className="input-group mb-3">
// 									<span className="input-group-text">
// 										<i className="fa-solid fa-tasks"></i>
// 									</span>
// 									<input
// 										type="text"
// 										id="tasks"
// 										className="form-control"
// 										placeholder="Tareas"
// 										value={tasks}
// 										onChange={(e) => setTasks(e.target.value)}
// 									/>
// 								</div>
// 								<div className="d-grid col-6 mx-auto">
// 									<button onClick={validar} className="btn btn-success">
// 										<i className="fa-solid fa-floppy-disk m-2"></i>Guardar
// 									</button>
// 								</div>
// 							</div>
// 							<div className="modal-footer">
// 								<button
// 									type="button"
// 									className="btn btn-secondary m-2"
// 									data-bs-dismiss="modal"
// 									id="btnCerrar"
// 								>
// 									Cerrar
// 								</button>
// 							</div>
// 						</div>
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

// export default Profiles;


import React, { useEffect, useState, useRef } from "react";
import axios, { AxiosResponse } from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { showAlert } from '../functions';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import EncabezadoTabla from "../EncabezadoTabla/EncabezadoTabla";
import * as bootstrap from 'bootstrap';


const MySwal = withReactContent(Swal);
interface Perfiles {
  id: number;
  name: string;
  description: string;
  createDate?: string;
  updateDate?: string;
  process: Process;
}

interface Process {
  id: number;
  name: string;
  description: string;
  createDate?: string;
  updateDate?: string;
}

interface Tasks {
  id: number;
  name: string;
  description: string;
  createDate?: string;
  updateDate?: string;
  version: number;
  taskType: TaskType;
}

interface TaskType {
  id: number;
  name: string;
  description: string;
  createDate?: string;
  updateDate?: string;
}


const Perfiles: React.FC = () => {
  const URL = "https://asymetricsbackend.uk.r.appspot.com/profile/";
  const [Perfiles, setPerfiles] = useState<Perfiles[]>([]);
  const [id, setId] = useState<number | null>(null);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>(""); 
  const [process, setProcess] = useState<Process[]>([]);
  const [tasks, setTasks] = useState<Process[]>([]);
  const [selectedProcessId, setSelectedProcessId] = useState<number>(0);
  const [selectedTasksId, setSelectedTasksId] = useState<number>(0);
  const [title, setTitle] = useState<string>("");
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    getPerfiles();
    getProcess();
    getTasks();
    if (modalRef.current) {
      modalRef.current.addEventListener('hidden.bs.modal', handleModalHidden);
    }
    return () => {
      if (modalRef.current) {
        modalRef.current.removeEventListener('hidden.bs.modal', handleModalHidden);
      }
    };
  }, []);

  const getPerfiles = async () => {
    try {
      const response: AxiosResponse<Perfiles[]> = await axios.get(URL);
      setPerfiles(response.data);
    } catch (error) {
      showAlert("Error al obtener los peligros", "error");
    }
  };
  
  const getProcess = async () => {
    try {
      const response = await axios.get<Process[]>('https://asymetricsbackend.uk.r.appspot.com/process/');
      setProcess(response.data);
    } catch (error) {
      showAlert("Error al obtener el cargo del Perfiles", "error");
    }
  };

  const getTasks = async () => {
    try {
      const response = await axios.get<Tasks[]>('https://asymetricsbackend.uk.r.appspot.com/task/');
      setTasks(response.data);
    } catch (error) {
      showAlert("Error al obtener Tareas", "error");
    }
  };
  
  const openModal = (op: string, Perfiles?: Perfiles) => {
    if (op === "1") {
      setId(null);
      setName("");
      setDescription(""); 
      setSelectedProcessId(0);
      setTitle("Registrar Perfiles");
    } else if (op === "2" && Perfiles) {
      setId(Perfiles.id);
      setName(Perfiles.name);
      setDescription(Perfiles.description); 
      setSelectedProcessId(Perfiles.process.id);

      setTitle("Editar Perfiles");
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
        showAlert("Escribe el nombre del Perfiles", "warning");
        return;
    }

    if (description.trim() === "") {
        showAlert("Escribe la descripcion", "warning");
        return;
    }

    if (selectedProcessId === 0) {
        showAlert("Escribe el cargo del Perfiles", "warning");
        return;
    }
    
    // Tipado explícito para los parámetros a enviar
      const parametros: Process = {
        id: 0,
        name: name.trim(),
        description: description.trim(),
        createDate: "",
        updateDate: "",
             
    };  


    const metodo: "PUT" | "POST" = id ? "PUT" : "POST";
    enviarSolicitud(metodo, parametros); 
};

   const enviarSolicitud = async (method: "POST" | "PUT", data: Process) => {
    try {
      const url = method === "PUT" && id ? `${URL}${id}/` : URL;
      const response = await axios({
        method,
        url,
        data,
        headers: { "Content-Type": "application/json" },
      });
  
      showAlert("Operación realizada con éxito", "success");
      getPerfiles();
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

  //BORRAMOS EL DATO DE LA TABLA
   const deletePerfiles = async (id: number) => {
    try {
      await axios.delete(`${URL}${id}/`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      showAlert("Perfiles eliminado correctamente", "success");
      getPerfiles();
    } catch (error) {
      showAlert("Error al eliminar Perfiles", "error");
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

  const formatDate = (dateString: string) => {
    return dateString.split('T')[0];
  };

  return (
    <div className="App">
      <div className="container-fluid">
        <div className="row mt-3">
          <div className="col-12">
            <div className="tabla-contenedor">
              <EncabezadoTabla title='Perfiles' onClick={() => openModal("1")} />
            </div>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead className="text-center"
                  style={{ background: 'linear-gradient(90deg, #009FE3 0%, #00CFFF 100%)', color: '#fff' }}>
                  <tr>
                    <th>N°</th>
                    <th>Nombre</th>
                    <th>Descripción</th>  
                    <th>Fecha</th>
                    <th>Proceso</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                  {Perfiles.map((per, i) => (
                    <tr key={JSON.stringify(per)} className="text-center">
                      <td>{i + 1}</td>
                      <td>{per.name}</td>
                      <td>{per.description}</td>
                      <td>{per.createDate ? formatDate(per.createDate) : ''}</td>
                      <td>{per.process.name}</td> 
                      <td className="text-center">
                        <OverlayTrigger placement="top" overlay={renderEditTooltip({})}>
                          <button
                            onClick={() => openModal("2", per)}
                            className="btn btn-custom-editar m-2"
                          >
                            <i className="fa-solid fa-edit"></i>
                          </button>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={renderDeleteTooltip({})}>
                          <button className="btn btn-custom-danger" onClick={() => {
                            MySwal.fire({
                              title: "¿Estás seguro?",
                              text: "No podrás revertir esto",
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonText: "Sí, bórralo",
                              cancelButtonText: "Cancelar",
                            }).then((result) => {
                              if (result.isConfirmed) {
                                deletePerfiles(per.id);
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
                  <i className="fa-solid fa-id-card-clip"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="input-group mb-3">
                  <span className="input-group-text">
                  <i className="fa-solid fa-id-card-clip"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="descripción"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="Process" className="form-label">Proceso</label>
                  <select
                    id="Process"
                    className="form-select"
                    value={selectedProcessId}
                    onChange={(e) => setSelectedProcessId(Number(e.target.value))}
                  >
                    <option value={0}>Seleccione el proceso</option>
                    {process.map(pro => (
                      <option key={JSON.stringify(pro)} value={pro.id}>{pro.name}</option>
                    ))}
                  </select>
                </div> 
                <div className="mb-3">
                  <label htmlFor="Tasks" className="form-label">Tareas</label>
                  <select
                    id="Tasks"
                    className="form-select"
                    value={selectedTasksId}
                    onChange={(e) => setSelectedTasksId(Number(e.target.value))}
                  >
                    <option value={0}>Seleccione la Tarea</option>
                    {tasks.map(tas => (
                      <option key={JSON.stringify(tas)} value={tas.id}>{tas.name}</option>
                    ))}
                  </select>
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
                >
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

export default Perfiles;

