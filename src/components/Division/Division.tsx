import React, { useEffect, useState, useRef } from "react";
import axios, { AxiosResponse } from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { showAlert } from '../functions';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import EncabezadoTabla from "../EncabezadoTabla/EncabezadoTabla";
import * as bootstrap from 'bootstrap';


const MySwal = withReactContent(Swal);

interface Division {
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

interface DivisionData {
  name: string;
  description: string | undefined;
  companyId: number;
  cityId: number;
  positionIds: number[];
}

interface Props {
	isNewRecord: boolean;
  }

const Division: React.FC<Props> = ({ isNewRecord }) => {
  const URL = "https://asymetricsbackend.uk.r.appspot.com/division/";
  const [division, setDivision] = useState<Division[]>([]);
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
    try {
      const response: AxiosResponse<Division[]> = await axios.get(URL);
      setDivision(response.data);
      console.log("Datos de Division:", response.data);
    } catch (error) {
      showAlert("Error al obtener los peligros", "error");
    }
  };
  

  const getCompanyType = async () => {
    try {
      const response = await axios.get<Company[]>('https://asymetricsbackend.uk.r.appspot.com/company/');
      setCompanyType(response.data);
    } catch (error) {
      showAlert("Error al obtener las compañias", "error");
    }
  };

  const getCity = async () => {
    try {
      const response = await axios.get<City[]>('https://asymetricsbackend.uk.r.appspot.com/city/');
      setCity(response.data);
    } catch (error) {
      showAlert("Error al obtener los tipos de verificación", "error");
    }
  };

  const openModal = (op: string, division?: Division) => {
    if (op === "1") {
      setId(null);
      setName("");
	  setCompanyName("");
	  setCityName("");
      setDescription("");
      setSelectedCompanyTypeId(0);
      setSelectedCityId(0);
      setTitle("Registrar Division");
    } else if (op === "2" && division) {
      setId(division.id);
      setName(division.name);
	  setCompanyName(division.company.name);
	  setCityName(division.city.name);
      setDescription(division.description || "");
     setSelectedCompanyTypeId(division.company.id);
      setSelectedCompanyTypeId(division.company.id); 
      setSelectedCityId(division.city.id);
      setTitle("Editar Division");

	  console.log("Nombre en el modal:", name);
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

	console.log("Valor de description al validar:", description);

	const positionIds = id ? [2] : [];
	const parametros: DivisionData = {
	  name: name.trim(),
	  description: description ? description.trim() : name.trim(),
	  companyId: selectedCompanyTypeId,
	  cityId: selectedCityId,
	  positionIds: positionIds?.length > 0 ? positionIds : [],  
	};
	

    const metodo: "PUT" | "POST" = id ? "PUT" : "POST";
    enviarSolicitud(metodo, parametros);
};


const enviarSolicitud = async (method: "POST" | "PUT", data: DivisionData) => {
	try {
	  const url = method === "PUT" && id ? `${URL}${id}/` : URL;
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
		console.log('Detalles del error:', error.response.data);  // Para obtener más detalles sobre el error
		showAlert(`Error: ${error.response.data.message || "No se pudo completar la solicitud."}`, "error");
	  } else {
		showAlert("Error al realizar la solicitud", "error");
	  }
	}
  };
  


  const deleteDivision = async (id: number) => {
    try {
      await axios.delete(`${URL}${id}/`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      showAlert("Division eliminada correctamente", "success");
      getDivision();
    } catch (error) {
      showAlert("Error al eliminar la Division", "error");
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
							<EncabezadoTabla title="Division" onClick={() => openModal("1")} />
						</div>
						<div className="table-responsive">
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
										<th>Descripción</th>
										<th>Compañia</th>
										<th>Ciudad</th>
										<th>Fecha</th>
										<th>Acciones</th>
									</tr>
								</thead>
								<tbody className="table-group-divider">
									{division.map((div, i) => (
										<tr key={JSON.stringify(div)} className="text-center">
											<td>{i + 1}</td>
											<td>{div.name}</td>
											<td>{div.description}</td>
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
											<i className="fa-solid fa-list-check"></i>
										</span>
										<input
											type="text"
											id="nombre"
											className="form-control"
											placeholder="Nombre de la División"
											value={name}
											onChange={(e) => setName(e.target.value)}
										/>
									</div>
								</div>
								<div className="mb-3">
									<label htmlFor="Company" className="form-label">
										Compañias
									</label>
									<select
										id="Company"
										className="form-select"
										value={selectedCompanyTypeId}
										onChange={(e) => setSelectedCompanyTypeId(Number(e.target.value))}
									>
										<option value={0}>Selecciona la Compañia</option>
										{company.map((com) => (
											<option key={com.id} value={com.id}>
												{com.description + " - " + com.name}
											</option>
										))}
									</select>
								</div>
								<div className="mb-3">
									<label htmlFor="City" className="form-label">
										Ciudad
									</label>
									<select
										id="City"
										className="form-select"
										value={selectedCityId}
										onChange={(e) => setSelectedCityId(Number(e.target.value))}>
										<option value={0}>Selecciona la Ciudad</option>
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

export default Division;




