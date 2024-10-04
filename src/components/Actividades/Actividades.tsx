import React, { useEffect, useState, useRef } from "react";
import axios, { AxiosResponse } from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { capitalizeFirstLetter, showAlert } from "../functions";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import EncabezadoTabla from "../EncabezadoTabla/EncabezadoTabla";
import * as bootstrap from "bootstrap";

const MySwal = withReactContent(Swal);

interface ActivityType {
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

interface Checker {
  id: number;
  name: string;
  description: string;
  createDate: string;
  updateDate: string;
  checkerType: CheckerType;
  task: any | null;
  checkpoints: any[];
  descriptionList: any | null;
}

interface Risk {
  id: number;
  name: string;
  description: string;
  createDate: string;
  updateDate: string;
}

interface Hazzard {
  id: number;
  name: string;
  description: string;
  createDate: string;
  updateDate: string;
  checker: Checker;
  risks: Risk[];
}

interface Criticity {
  id: number;
  name: string;
  description: string;
  createDate: string;
  updateDate: string;
}

interface HazzardWithCriticity {
  hazzard: Hazzard;
  criticity: Criticity;
}

interface Actividades {
  id: number;
  name: string;
  description: string;
  createDate: string;
  updateDate: string;
  activityType: ActivityType;
  process: Process;
  hazzards: HazzardWithCriticity[];
}

const Actividades: React.FC = () => {
  const baseURL = import.meta.env.VITE_API_URL;
  const [actividades, setActividades] = useState<Actividades[]>([]);
  const [activityType, setActivityType] = useState<ActivityType[]>([]);
  const [process, setProcess] = useState<Process[]>([]);
  const [hazzards, setHazzard] = useState<Hazzard[]>([]);
  const [criticities, setCriticity] = useState<Criticity[]>([]);
  const [id, setId] = useState<number | null>(null);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedActivityTypeId, setSelectedActivityTypeId] = useState<number>(0);
  const [selectedProcessId, setSelectedProcessId] = useState<number>(0);
  const [hazzardCriticityPairs, setHazzardCriticityPairs] = useState<
    { hazzardId: string; criticityId: string }[]
  >([]);
  const [title, setTitle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

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
      const response: AxiosResponse<Actividades[]> = await axios.get(`${baseURL}/activity/`);
      if (!response.data || response.data.length === 0) {
        showAlert("No se encontraron actividades", "warning");
        return;
      }
      console.log("Actividades recibidas:", response.data);
      setActividades(response.data);
    } catch (error) {
      console.error("Error al obtener las actividades:", error);
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


  const handleModalHidden = () => {
    setIsModalOpen(false);
    const modals = document.querySelectorAll(".modal-backdrop");
    modals.forEach((modal) => modal.parentNode?.removeChild(modal));
  };

  const openModal = (op: string, actividad?: Actividades) => {
    if (op === "1") {
      resetForm();
      setTitle("Registrar Actividad");
    } else if (op === "2" && actividad) {
      if (actividad && actividad.activityType && actividad.process) {
        setId(actividad.id);
        setName(actividad.name);
        setDescription(actividad.description);
        setSelectedActivityTypeId(actividad.activityType.id);
        setSelectedProcessId(actividad.process.id);
  
        if (Array.isArray(actividad.hazzards)) {
          setHazzardCriticityPairs(
            actividad.hazzards.map((hc) => ({
              hazzardId: hc.hazzard ? hc.hazzard.id.toString() : "",
              criticityId: hc.criticity ? hc.criticity.id.toString() : "",
            }))
          );
        } else {
          setHazzardCriticityPairs([]);
        }
        setTitle("Editar Actividad");
      } else {
        console.error("Error: Actividad, ActivityType o Process son indefinidos.");
        return;
      }
    }
  
    if (modalRef.current) {
      const modal = new bootstrap.Modal(modalRef.current);
      modal.show();
      setIsModalOpen(true);
    }
  };
  

  const resetForm = () => {
    setId(null);
    setName("");
    setDescription("");
    setSelectedActivityTypeId(0);
    setSelectedProcessId(0);
    setHazzardCriticityPairs([]);
  };


  const validar = (): void => {
    if (!name || !description || !selectedActivityTypeId || !selectedProcessId) {
      showAlert("Completa todos los campos antes de guardar.", "warning");
      return;
    }
  
    const hazzards = hazzardCriticityPairs.map((pair) => ({
      hazzardId: pair.hazzardId ? Number(pair.hazzardId) : null,
      criticityId: pair.criticityId ? Number(pair.criticityId) : null,
    }));
  
    const parametros = {
      name: name.trim(),
      description: description.trim(),
      activityTypeId: selectedActivityTypeId,
      processId: selectedProcessId,
      hazzards: hazzards,
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
      newActividad.hazzards = hazzardCriticityPairs;

      if (method === "POST") {
        setActividades((prev) => [...prev, newActividad]);
      } else if (method === "PUT") {
        setActividades((prev) => prev.map((act) => (act.id === newActividad.id ? newActividad : act)));
      }

      showAlert("Operación realizada con éxito", "success");
      getActivity();
      if (modalRef.current) {
        const modal = bootstrap.Modal.getInstance(modalRef.current);
        modal?.hide();
      }
    } catch (error: any) {
      console.error("Error en la solicitud:", error);
      showAlert("Error al realizar la solicitud", "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteActividad = async (id: number) => {
    try {
      await axios.delete(`${baseURL}/activity/${id}`, {
        headers: { "Content-Type": "application/json" },
      });
      Swal.fire("Actividad eliminada correctamente", "", "success");
      setActividades((prev) => prev.filter((act) => act.id !== id));
      getActivity();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Error al eliminar la actividad.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleHazzardChange = (index: number, hazzardId: string) => {
    const newPairs = [...hazzardCriticityPairs];
    newPairs[index].hazzardId = hazzardId;
    setHazzardCriticityPairs(newPairs);
  };

  const handleCriticityChange = (index: number, criticityId: string) => {
    const newPairs = [...hazzardCriticityPairs];
    newPairs[index].criticityId = criticityId;
    setHazzardCriticityPairs(newPairs);
  };

  const addHazzardCriticityPair = () => {
    setHazzardCriticityPairs([
      ...hazzardCriticityPairs,
      { hazzardId: "", criticityId: "" },
    ]);
  };

  const removeHazzardCriticityPair = (index: number) => {
    const newPairs = [...hazzardCriticityPairs];
    newPairs.splice(index, 1);
    setHazzardCriticityPairs(newPairs);
  };

  return (
		<div className="App">
			<div className="container-fluid">
				<div className="row mt-3">
					<div className="col-12">
						<div className="tabla-contenedor">
							<EncabezadoTabla title="Actividades" onClick={() => openModal("1")} />
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
									{actividades.length > 0 ? (
										actividades.map((act, i) => (
											<tr key={act.id} className="text-center">
												<td>{i + 1}</td>
												<td>{capitalizeFirstLetter(act.name)}</td>
												<td>{capitalizeFirstLetter(act.description)}</td>
												<td>{act.activityType?.name || "Sin tipo de actividad"}</td>
												<td>{act.process?.name || "Sin proceso"}</td>
												<td>
													{Array.isArray(act.hazzards) && act.hazzards.length > 0 ? (
														<ul>
															{act.hazzards.map((hz, index) => {
																const hazzard = hz.hazzard
																	? hazzards.find((h) => h.id === hz.hazzard?.id)?.name
																	: "No disponible";
																const criticity = hz.criticity
																	? criticities.find((c) => c.id === hz.criticity?.id)
																	: null;
																const criticityText = criticity
																	? `${criticity.name} - ${criticity.description}`
																	: "Información de criticidad no disponible";

																return (
																	<li key={`${hz.hazzard?.id}-${hz.criticity?.id}-${index}`}>
																		{`${hazzard} / ${criticityText}`}
																	</li>
																);
															})}
														</ul>
													) : (
														"No hay peligro y criticidad."
													)}
												</td>
												<td className="text-center">
													<OverlayTrigger placement="top" overlay={<Tooltip>Editar</Tooltip>}>
														<button
															onClick={() => openModal("2", act)}
															className="btn btn-custom-editar m-2"
														>
															<i className="fa-solid fa-edit"></i>
														</button>
													</OverlayTrigger>
													<OverlayTrigger placement="top" overlay={<Tooltip>Eliminar</Tooltip>}>
														<button
															className="btn btn-custom-danger"
															onClick={() => deleteActividad(act.id)}
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
												{actv.name}
											</option>
										))}
									</select>
								</div>

								{hazzardCriticityPairs.length > 0 ? (
									hazzardCriticityPairs.map((pair, index) => (
										<div key={index} className="row mb-3">
											<div className="col">
												<label htmlFor={`hazzard-${index}`} className="form-label">
													Peligro:
												</label>
												<select
													id={`hazzard-${index}`}
													className="form-select"
													value={pair.hazzardId}
													onChange={(e) => handleHazzardChange(index, e.target.value)}
												>
													<option value="">Selecciona...</option>
													{hazzards.map((h) => (
														<option key={h.id} value={h.id.toString()}>
															{h.name}
														</option>
													))}
												</select>
											</div>

											<div className="col">
												<label htmlFor={`criticity-${index}`} className="form-label">
													Criticidad:
												</label>
												<select
													id={`criticity-${index}`}
													className="form-select"
													value={pair.criticityId}
													onChange={(e) => handleCriticityChange(index, e.target.value)}
												>
													<option value="">Selecciona...</option>
													{criticities.map((c) => (
														<option key={c.id} value={c.id.toString()}>
															{`${c.name} - ${c.description}`}{" "}
														</option>
													))}
												</select>
											</div>

											<div className="col-auto">
												<button
													type="button"
													className="btn btn-danger mt-4"
													onClick={() => removeHazzardCriticityPair(index)}
												>
													Eliminar
												</button>
											</div>
										</div>
									))
								) : (
									<p>Agregar todos los Peligros y sus Criticidades.</p>
								)}

								<button
									type="button"
									className="btn btn-success mt-3"
									onClick={addHazzardCriticityPair}
								>
									Agregar Peligro / Criticidad
								</button>
							</div>
							<div className="modal-footer">
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

export default Actividades;
