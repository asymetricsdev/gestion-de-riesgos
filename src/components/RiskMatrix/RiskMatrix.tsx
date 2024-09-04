import React, { useEffect, useState, useRef } from "react";
import axios, { AxiosResponse } from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { showAlert } from '../functions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import EncabezadoTabla from "../EncabezadoTabla/EncabezadoTabla";
import * as bootstrap from 'bootstrap';

const MySwal = withReactContent(Swal);

interface Risk {
  id: number;
  name: string;
  description: string;
  createDate: string;
}

const Risks: React.FC = () => { 
  const baseURL = import.meta.env.VITE_API_URL;
  const [Risks, setRisks] = useState<Risk[]>([]); 
  const [id, setId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [createDate, setCreateDate] = useState<string>(""); 
  const [title, setTitle] = useState<string>("");
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    getRisks();
    if (modalRef.current) {
      modalRef.current.addEventListener('hidden.bs.modal', handleModalHidden);
    }
    return () => {
      if (modalRef.current) {
        modalRef.current.removeEventListener('hidden.bs.modal', handleModalHidden);
      }
    };
  }, []);

  const getRisks = async () => {
    try {
      const response: AxiosResponse<Risk[]> = await axios.get(`${baseURL}/risk/`);
      const formattedRisks = response.data.map((Risk) => ({
        ...Risk,
        createDate: new Date(Risk.createDate).toLocaleString(),
      }));
      setRisks(formattedRisks);
    } catch (error) {
      showAlert("Error al obtener los datos de Riesgos", "error");
    }
  };

  const openModal = (op: string, risk?: Risk) => { 
    if (risk) {
      setId("");
      setName(risk.name);
      setDescription(risk.description);
      setCreateDate(risk.createDate);
    } else {
      setId("");
      setName("");
      setDescription("");
      setCreateDate("");
    }
    setTitle(op === "1" ? "Registrar Riesgo" : "Editar Riesgo");

    setTimeout(() => {
      document.getElementById("nombre")?.focus();
    }, 500);

    if (modalRef.current) {
      const modal = new bootstrap.Modal(modalRef.current);
      modal.show();
      setIsModalOpen(true);
    }
  };

  const handleModalHidden = () => {
    setIsModalOpen(false);
    const modals = document.querySelectorAll(".modal-backdrop");
    modals.forEach((modal) => modal.parentNode?.removeChild(modal));
  };

  const validar = () => {
    if (name.trim() === "") {
      showAlert("Escribe el nombre", "warning", "nombre");
      return;
    }
    if (description.trim() === "") {
      showAlert("Escribe la descripción", "warning", "description");
      return;
    }
    if (createDate.trim() === "") {
      showAlert("Escribe la fecha de creación", "warning", "createDate");
      return;
    }

    const parametros = {
      id,
      name: name.trim(),
      description: description.trim(),
      createDate: createDate.trim(),
    };
    const metodo = id ? "PUT" : "POST";
    enviarSolicitud(metodo, parametros);
  };

  const enviarSolicitud = async (method: "POST" | "PUT", data: any) => {
    try {
      const url = method === "PUT" && id ? `${baseURL}/risk/${id}` : `${baseURL}/risk/`;
      const response = await axios({
        method,
        url,
        data,
        headers: { "Content-Type": "application/json" },
      });

      const { tipo, msj } = response.data;
      showAlert(msj, tipo);
      getRisks();
      if (tipo === "success") {
        setTimeout(() => {
          const closeModalButton = document.getElementById("btnCerrar");
          if (closeModalButton) {
            closeModalButton.click();
          }
          getRisks();
        }, 500);
      }
    } catch (error) {
      showAlert("Error al enviar la solicitud", "error");
    }
  };

  const deleteRisk = async (id: number) => {
    try {
      await axios.delete(`${baseURL}/risk/${id}`, {
        headers: { "Content-Type": "application/json" },
      });
      Swal.fire("Tipo de Peligro eliminado correctamente", "", "success");
      getRisks();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Error al eliminar el Tipo de Peligro.",
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

  return (
    <div className="App">
      <div className="container-fluid">
        <div className="row mt-3">
          <div className="col-12">
            <div className="tabla-contenedor">
              <EncabezadoTabla title='Riesgos' onClick={() => openModal("1")} />
            </div>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead className="text-center"
                  style={{ background: 'linear-gradient(90deg, #009FE3 0%, #00CFFF 100%)', color: '#fff' }}>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Fecha de Creación</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                  {Risks.map((risk, i) => (
                    <tr key={risk.id} className="text-center">
                      <td>{i + 1}</td>
                      <td>{risk.name}</td>
                      <td>{risk.description}</td>
                      <td>29/7/2024</td>
                      <td className="text-center">
                      <OverlayTrigger placement="top" overlay={renderEditTooltip}>
                        <button
                          onClick={() => openModal("2", risk)}
                          className="btn btn-custom-editar m-2"
                          data-bs-toggle="modal"
                          data-bs-target="#modalRisk"
                        >
                          <i className="fa-solid fa-edit"></i>
                        </button>
                      </OverlayTrigger>
                      <OverlayTrigger placement="top" overlay={renderDeleteTooltip}>
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
                              deleteRisk(risk.id);
                            }
                          });
                        }}>
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
          id="modalRisk"
          data-bs-backdrop="true"
          data-bs-keyboard="true"
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header text-white">
                <label className="h5">{title}</label>
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
                    <i className="fa-solid fa-user"></i>
                  </span>
                  <input
                    type="text"
                    id="nombre"
                    className="form-control"
                    placeholder="Nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="input-group mb-3">
                  <span className="input-group-text">
                    <i className="fa-regular fa-envelope"></i>
                  </span>
                  <input
                    type="text"
                    id="description"
                    className="form-control"
                    placeholder="Descripción"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="input-group mb-3">
                  <span className="input-group-text">
                    <i className="fa-solid fa-calendar"></i>
                  </span>
                  <input
                    type="text"
                    id="createDate"
                    className="form-control"
                    placeholder="Fecha de creación"
                    value={createDate}
                    onChange={(e) => setCreateDate(e.target.value)}
                  />
                </div>
                <div className="input-group mb-3">
                  <span className="input-group-text">
                    <i className="fa-solid fa-tasks"></i>
                  </span>
                </div>
                <div className="d-grid col-6 mx-auto">
                  <button onClick={validar} className="btn btn-success">
                    <i className="fa-solid fa-floppy-disk m-2"></i>Guardar
                  </button>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button"
                  className="btn btn-secondary m-2"
                  data-bs-dismiss="modal"
                  id="btnCerrar">Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Risks; 
