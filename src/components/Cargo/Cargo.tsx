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

interface Cargo {
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

interface CargoData {
  id?: number;
  name: string;
  description: string;
  managerPositionId: number;
  divisionIds: number[];
}

const Cargo: React.FC = () => {
  const baseURL = import.meta.env.VITE_API_URL;
  const [positions, setPositions] = useState<Cargo[]>([]);
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
  const [loading, setLoading] = useState<boolean>(false);

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
      const response: AxiosResponse<Cargo[]> = await axios.get(`${baseURL}/position/`);
      setPositions(response.data);
    } catch (error) {
      showAlert("Error al obtener los Cargos", "error");
    }
  };

  const getManagerPositions = async () => {
    try {
      const response: AxiosResponse<ManagerPosition[]> = await axios.get(`${baseURL}/position/`);
      setManagerPosition(response.data);
    } catch (error) {
      showAlert("Error al obtener las Jefaturas", "error");
    }
  };

  const getSubordinatePositions = async () => {
    try {
      const response: AxiosResponse<SubordinatePosition[]> = await axios.get(`${baseURL}/division/`);
      setSubordinatePositions(response.data);
    } catch (error) {
      showAlert("Error al obtener las Tareas", "error");
    }
  };

  const openModal = (op: string, position?: Cargo) => {
    if (op === "1") {
      setId(null);
      setName("");
      setDescription("");
      setSelectedDivisionIds([]);
      setSelectedManagerId(0);
      setTitle("Registrar Cargo");
    } else if (op === "2" && position) {
      setId(position.id);
      setName(position.name);
      setDescription(position.description);
      setSelectedDivisionIds(position.subordinatePositions.map(sp => sp.id));
      setSelectedManagerId(position.managerPosition?.id || 0);
      setTitle("Editar Área");
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

    if (selectedManagerId === 0) {
      showAlert("Selecciona Jefatura", "warning");
      return;
    }

    if (selectedDivisionIds.length === 0) {
      showAlert("Selecciona al menos una Division", "warning");
      return;
    }
    setLoading(true);

    const parametros: CargoData = {
      name: name.trim(),
      description: description.trim(),
      managerPositionId: selectedManagerId,
      divisionIds: selectedDivisionIds,
    };

    const metodo: "PUT" | "POST" = id ? "PUT" : "POST";
    enviarSolicitud(metodo, parametros);

    const openModal = (position: CargoData | null) => {
      if (position && position.id) {
      } else {
        console.error("Position is null or does not have an id");
      }
    };
    
  };

  const enviarSolicitud = async (method: "POST" | "PUT", data: CargoData) => {
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
      if (axios.isAxiosError(error) && error.response) {
        showAlert(`Error: ${error.response.data.message || "No se pudo completar la solicitud."}`, "error");
      } else {
        showAlert("Error al realizar la solicitud", "error");
      }
    } finally {
      setLoading(false);
    }
  };
  

  const deletePosition = async (id: number | null) => {
    try {
      if (id === null) {
        Swal.fire({
          title: "Error",
          text: "El ID del cargo es inválido.",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }
  
      const position = positions.find(pos => pos.id === id);
  
      if (!position) {
        Swal.fire({
          title: "Error",
          text: "No se encontró el cargo a eliminar.",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }
  

      if (position.subordinatePositions.length > 0) {
        for (let subordinate of position.subordinatePositions) {
          await axios.delete(`${baseURL}/position/${id}`, {
            headers: { "Content-Type": "application/json" },
          });
        }
      }
  
      await axios.delete(`${baseURL}/position/${id}`, {
        headers: { "Content-Type": "application/json" },
      });
  
      setPositions(prevPositions => prevPositions.filter(pos => pos.id !== id));
  
      Swal.fire({
        title: "Cargo y subordinados eliminados correctamente",
        icon: "success",
        confirmButtonText: "OK",
      });


      getPositions(); 
    } catch (error) {
      console.error("Error al eliminar el cargo:", error);
      Swal.fire({
        title: "Error",
        text: "Ocurrió un error al intentar eliminar el cargo y sus subordinados.",
        icon: "error",
        confirmButtonText: "OK",
      });
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
										<th>ID</th>
										<th>Cargo</th>
										<th>Jefatura</th>
										<th>Equipo</th>
										<th>Acciones</th>
									</tr>
								</thead>
								<tbody className="table-group-divider">
									{positions &&
										positions.length > 0 &&
										positions.map((pos, i) => (
											<tr key={pos.id} className="text-center">
												<td>{i + 1}</td>
												<td>{pos.name}</td>
												<td>{pos.managerPosition?.name || "N/A"}</td>
												<td>
													<Accordion>
														<Accordion.Item eventKey="0">
															<Accordion.Header>Equipo de Jefatura</Accordion.Header>
															<Accordion.Body>
																<ul>
																	{pos.subordinatePositions &&
																	pos.subordinatePositions.length > 0 ? (
																		pos.subordinatePositions.map((sub) => (
																			<li key={sub.id}>{sub.description}</li>
																		))
																	) : (
																		<li>No hay subordinados</li>
																	)}
																</ul>
															</Accordion.Body>
														</Accordion.Item>
													</Accordion>
												</td>
												<td className="text-center">
													<OverlayTrigger placement="top" overlay={renderEditTooltip({})}>
														<button
															onClick={() => openModal("2", pos)}
															className="btn btn-custom-editar m-2"
														>
															<i className="fa-solid fa-edit"></i>
														</button>
													</OverlayTrigger>
													<OverlayTrigger placement="top" overlay={renderDeleteTooltip({})}>
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
																		deletePosition(pos.id);
																	}
																});
															}}
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
					</div>
				</div>

				<div className="modal fade" id="modalEquipo" tabIndex={-1} ref={modalRef}>
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
										<option value={0}>Selecciona...</option>
										{managerPosition.map((proc) => (
											<option key={proc.id} value={proc.id}>
												{proc.name}
											</option>
										))}
									</select>
								</div>
								<div className="form-group mt-3">
									<label htmlFor="equipo">Área:</label>
									<Select
										isMulti
										value={opcionesEquipo.filter((option) =>
											selectedDivisionIds.includes(option.value)
										)}
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
		</div>
	);
};

export default Cargo;

