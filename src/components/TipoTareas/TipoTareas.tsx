import React, { useEffect, useState, useRef } from "react";
import axios, { AxiosResponse } from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { showAlert } from '../functions';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import EncabezadoTabla from "../EncabezadoTabla/EncabezadoTabla";
import * as bootstrap from 'bootstrap';

const MySwal = withReactContent(Swal);

interface TipoTareas {
  id: number;
  name: string;
  description: string;
  createDate: string;
}

const TipoTareas: React.FC = () => {

  const URL = "https://asymetricsbackend.uk.r.appspot.com/task_type/";
  const [tipoTareas, setTipoTareas] = useState<TipoTareas[]>([]);
  const [id, setId] = useState<number | null>(null);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    getTipoTareas();
    if (modalRef.current) {
      modalRef.current.addEventListener('hidden.bs.modal', handleModalHidden);
    }
    return () => {
      if (modalRef.current) {
        modalRef.current.removeEventListener('hidden.bs.modal', handleModalHidden);
      }
    };
  }, []);

  const getTipoTareas = async () => {
    try {
      const response: AxiosResponse<TipoTareas[]> = await axios.get(URL);
      setTipoTareas(response.data);
    } catch (error) {
      showAlert("Error al obtener el Tipo de Tareas", "error");
    }
  };

  
  const openModal = (op: string, TipoTareas?: TipoTareas) => {
    if (TipoTareas) {
      setId(TipoTareas.id);
      setName(TipoTareas.name);
      setDescription(TipoTareas.description);
    } else {
      setId(null);
      setName("");
      setDescription("");
    }
    setTitle(op === "1" ? "Registrar el Tipo de Tareas" : "Editar el Tipo de Tareas");

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

  const validar = () => {
    if (name.trim() === "") {
      showAlert("Escribe el nombre", "warning", "nombre del proceso");
      return;
    }
    if (description.trim() === "") {
      showAlert("Escribe la descripción", "warning", "descripción");
      return;
    }
    
    const parametros = { id, name: name.trim(), description: description.trim() };
    const metodo = id ? "PUT" : "POST";
    enviarSolicitud(metodo, parametros);
  };

const enviarSolicitud = async (method: "POST" | "PUT", data: any) => {
    try {
        const url = method === "PUT" && id ? `${URL}${id}` : URL;
        const response = await axios({
            method,
            url,
            data,
            headers: { "Content-Type": "application/json" },
        });

        const { tipo, msj } = response.data;
        showAlert(msj, tipo);
        getTipoTareas();
        if (tipo === "success") {
            setTimeout(() => {
                const closeModalButton = document.getElementById("btnCerrar");
                if (closeModalButton) {
                    closeModalButton.click();
                }
                getTipoTareas(); 
            }, 500);
        }
    } catch (error) {
        showAlert("Error al enviar la solicitud", "error");
        console.error(error);
    }
};


  const deleteTipoTareas = async (id: number) => {
    try {
      await axios.delete(`${URL}${id}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      showAlert("Tipo de Tareas eliminado correctamente", "success");
      getTipoTareas(); 
    } catch (error) {
      showAlert("Error al eliminar el Tipo de Tareas", "error");
      console.error(error);
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
              <EncabezadoTabla title='Tipo de Tareas' onClick={() => openModal("1")} />
            </div>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead className="text-center" 
                style={{ background: 'linear-gradient(90deg, #009FE3 0%, #00CFFF 100%)', 
                color: '#fff' }}>
                  <tr>
                    <th>N°</th>
                    <th>Nombre</th>
                    <th>Descripción </th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
									{tipoTareas.map((div, i) => (
										<tr key={JSON.stringify(div)} className="text-center">
											<td>{i + 1}</td>
											<td>{div.name}</td>
											<td>{div.description}</td>
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
																	deleteTipoTareas(div.id);
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
                {/* <tbody className="table-group-divider">
                  {tipoTareas.map((tiptar, i) => (
                    <tr key={tiptar.id} className="text-center">
                      <td>{i + 1}</td>
                      <td>{tiptar.name}</td>
                      <td>{tiptar.description}</td>
                      <td>{formatDate(tiptar.createDate)}</td>
                      <td className="text-center">
                        <OverlayTrigger placement="top" overlay={renderEditTooltip({})}>
                        <button
                        onClick={() => openModal("2", tiptar)}
                        className="btn btn-custom-editar m-2"
                        data-bs-toggle="modal"
                        data-bs-target="#modalUsers">
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
                            deleteTipoTareas(1);
                            }
                          });
                        }}>
                          <i className="fa-solid fa-circle-xmark"></i>
                        </button>
                      </OverlayTrigger>
                      </td>
                    </tr>
                  ))}
                </tbody> */}
              </table>
            </div>
          </div>
        </div>
        <div className="modal fade" id="modalUsers" tabIndex={-1} aria-hidden="true" ref={modalRef}>
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
                <input type="hidden" id="id" />
                <div className="input-group mb-3">
                  <span className="input-group-text">
                  <i className="fa-solid fa-list-check"></i>
                  </span>
                  <input
                    type="text"
                    id="nombre"
                    className="form-control"
                    placeholder="Nombre Tipo de Tareas"
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
                    id="descripcion"
                    className="form-control"
                    placeholder="Descripción"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="input-group mb-3">
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  id="btnCerrar">
                  Cerrar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={validar}>
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

export default TipoTareas;
