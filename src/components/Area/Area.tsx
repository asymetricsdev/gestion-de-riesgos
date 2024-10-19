import axios, { AxiosResponse } from "axios";
import * as bootstrap from 'bootstrap';
import React, { useEffect, useRef, useState } from "react";
import { OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import EncabezadoTabla from "../EncabezadoTabla/EncabezadoTabla";
import { showAlert } from '../functions';


const MySwal = withReactContent(Swal);

interface Area {
	id: number;
	name: string;
	description: string;
	createDate: string;
	updateDate: string;
	company: Company; 
	city: City;
  }

interface Company {
  id: number;
  name: string;
  description: string;
  createDate?: string;
  updateDate?: string;
}

interface City {
  id: number;
  name: string;
  description: string;
  createDate?: string;
  updateDate?: string;
}

interface AreaData {
  name: string;
  description: string | undefined;
  companyId: number;
  cityId: number;
  positionIds: number[];
}

 interface AreaProps {
	isNewRecord: boolean;
  }
 
const Area: React.FC<AreaProps> = ({ isNewRecord }: AreaProps ) => {

  const baseURL = import.meta.env.VITE_API_URL;
  const [division, setDivision] = useState<Area[]>([]);
  const [company, setCompanyType] = useState<Company[]>([]);
  const [city, setCity] = useState<City[]>([]);
  const [id, setId] = useState<number | null>(null);
  const [name, setName] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [cityName, setCityName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedCompanyTypeId, setSelectedCompanyTypeId] = useState<number>(0);
  const [selectedCityId, setSelectedCityId] = useState<number>(0);
  const [title, setTitle] = useState<string>("");
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false); 
  const [pendingRequests, setPendingRequests] = useState<number>(0);


  useEffect(() => {
    getDivision();
    getCompanyType();
    getCity();
    if (modalRef.current) {
      modalRef.current.addEventListener('hidden.bs.modal', handleModalHidden);
    }
    return () => {
      if (modalRef.current) {
        modalRef.current.removeEventListener('hidden.bs.modal', handleModalHidden);
      }
    };
  }, []);

  const getDivision = async () => {
	setPendingRequests(prev => prev + 1);
    try {
	  const response: AxiosResponse<Area[]> = await axios.get(`${baseURL}/division/`);
      setDivision(response.data);
    } catch (error) {
      showAlert("Error al obtener los peligros", "error");
    } finally {
		setPendingRequests(prev => prev - 1);
	}
  };
  

  const getCompanyType = async () => {
	setPendingRequests(prev => prev + 1);
    try {
	  const response: AxiosResponse<Company[]> = await axios.get(`${baseURL}/company/`);
      setCompanyType(response.data);
    } catch (error) {
      showAlert("Error al obtener las compañias", "error");
    } finally {
		setPendingRequests(prev => prev - 1); 
	}
  };

  const getCity = async () => {
	setPendingRequests(prev => prev + 1);
    try {
	  const response: AxiosResponse<City[]> = await axios.get(`${baseURL}/city/`);
      setCity(response.data);
    } catch (error) {
      showAlert("Error al obtener los tipos de verificación", "error");
    } finally {
		setPendingRequests(prev => prev - 1); 
	}
  };

  const openModal = (op: string, division?: Area) => {
    if (op === "1") {
      setId(null);
      setName("");
	  setCompanyName("");
	  setCityName("");
      setDescription("");
      setSelectedCompanyTypeId(0);
      setSelectedCityId(0);
      setTitle("Registrar Área");
    } else if (op === "2" && division) {
      setId(division.id);
      setName(division.name);
	  setCompanyName(division.company.name);
	  setCityName(division.city.name);
      setDescription(division.description || "");
     setSelectedCompanyTypeId(division.company.id);
      setSelectedCompanyTypeId(division.company.id); 
      setSelectedCityId(division.city.id);
      setTitle("Editar Área");

    }

    if (modalRef.current) {
      const modal = new bootstrap.Modal(modalRef.current);
      modal.show();
      setIsModalOpen(true);
    }
  };


  useEffect(() => {
	if (id && !isNewRecord) {
	  setDescription(name);
	} else if (isNewRecord && description === "") {
	  setDescription(name);
	}
  }, [name, isNewRecord, id]);
  
  
  const handleModalHidden = () => {
    setIsModalOpen(false);
    const modals = document.querySelectorAll('.modal-backdrop');
    modals.forEach(modal => modal.parentNode?.removeChild(modal));
  };

  const validar = (): void => {
    if (name.trim() === "") {
        showAlert("Escribe el nombre del área", "warning");
        return;
    }
    if (selectedCompanyTypeId === 0 ) {
        showAlert("Selecciona una Compañía", "warning");
        return;
    }
    if (selectedCityId === 0 ) {
        showAlert("Selecciona una Ciudad", "warning");
        return;
    }

	setLoading(true);

	const positionIds = id ? [2] : [];
	const parametros: AreaData = {
	  name: name.trim(),
	  description: description ? description.trim() : name.trim(),
	  companyId: selectedCompanyTypeId,
	  cityId: selectedCityId,
	  positionIds: positionIds?.length > 0 ? positionIds : [],  
	};
	

    const metodo: "PUT" | "POST" = id ? "PUT" : "POST";
    enviarSolicitud(metodo, parametros);
};

const enviarSolicitud = async (method: "POST" | "PUT", data: AreaData) => {
	setLoading(true);
	try {
	  const url = method === "PUT" && id ? `${baseURL}/division/${id}` : `${baseURL}/division/`;
	  const response = await axios({
		method,
		url,
		data,
		headers: { "Content-Type": "application/json" },
	  });
  
	  showAlert("Operación realizada con éxito", "success");
	  getDivision();
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
  

const deleteDivision = async (id: number) => {
	setLoading(true);
    try {
      await axios.delete(`${baseURL}/division/${id}`, {
        headers: { "Content-Type": "application/json" },
      });
      Swal.fire("Área eliminada correctamente", "", "success");
      getDivision();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Error al eliminar el Área.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
		setLoading(false);
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
							<EncabezadoTabla title="Áreas" onClick={() => openModal("1")} />
						</div>
						{pendingRequests > 0 ? (
							<div className="d-flex justify-content-center align-items-center" style={{ height: '100vh', marginTop: '-200px' }}>
							<Spinner animation="border" role="status" style={{ color: '#A17BB6' }}>
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
									}}>
									<tr>
										<th>N°</th>
										<th>Nombre</th>
										{/*<th>Descripción</th>*/}
										<th>Compañía</th>
										<th>Sitio/Sucursal</th>
										<th>Fecha</th>
										<th>Acciones</th>
									</tr>
								</thead>
								<tbody className="table-group-divider">
									{division.map((div, i) => (
										<tr key={JSON.stringify(div)} className="text-center">
											<td>{i + 1}</td>
											<td>{div.name}</td>
											{/*<td>{div.description}</td>*/}
											<td>{div.company.name}</td>
											<td>{div.city.name}</td> 
											<td>{div.createDate ? formatDate(div.createDate) : ''}</td>
											<td className="text-center">
												<OverlayTrigger placement="top" overlay={renderEditTooltip({})}>
													<button
														onClick={() => openModal("2", div)}
														className="btn btn-custom-editar m-2">
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
																	deleteDivision(div.id);
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
						)}
					</div>
				</div>
				<div
					className="modal fade"
					id="modalDivision"
					tabIndex={-1}
					aria-hidden="true"
					ref={modalRef}>
					<div className="modal-dialog modal-dialog-top modal-md">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title w-100">{title}</h5>
								<button type="button" className="btn-close" data-bs-dismiss="modal"></button>
							</div>
							<div className="modal-body">
								<div className="mb-3">
									<div className="input-group">
										<span className="input-group-text">
										<i className="fa-solid fa-sitemap"></i>
										</span>
										<input
											type="text"
											id="nombre"
											className="form-control"
											placeholder="Nombre del Área"
											value={name}
											onChange={(e) => setName(e.target.value)}
										/>
									</div>
								</div>
								<div className="mb-3">
									<label htmlFor="Company" className="form-label">
										Compañias:
									</label>
									<select
										id="Company"
										className="form-select"
										value={selectedCompanyTypeId}
										onChange={(e) => setSelectedCompanyTypeId(Number(e.target.value))}
									>
										<option value={0}>Selecciona...</option>
										{company.map((com) => (
											<option key={com.id} value={com.id}>
												{com.description + " - " + com.name}
											</option>
										))}
									</select>
								</div>
								<div className="mb-3">
									<label htmlFor="City" className="form-label">
										Ciudad:
									</label>
									<select
										id="City"
										className="form-select"
										value={selectedCityId}
										onChange={(e) => setSelectedCityId(Number(e.target.value))}>
										<option value={0}>Selecciona...</option>
										{city.map((cit) => (
											<option key={cit.id} value={cit.id}>
												{cit.name}
											</option>
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

export default Area;




