import React, { useEffect, useState, useRef } from "react";
import axios, { AxiosResponse } from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { showAlert } from '../functions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import EncabezadoTabla from "../EncabezadoTabla/EncabezadoTabla";
import * as bootstrap from 'bootstrap';

const MySwal = withReactContent(Swal);

interface Hazzard {
  id: string;
  name: string;
  description: string;
  createDate: string;
 
}

const Hazzard: React.FC = () => {
  const URL = "https://asymetricsbackend.uk.r.appspot.com/hazzard/";
  const [hazzard, setHazzard] = useState<Hazzard[]>([]);
  const [id, setId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [createDate, setCreateDate] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    getUsers();
    if (modalRef.current) {
      modalRef.current.addEventListener('hidden.bs.modal', handleModalHidden);
    }
    return () => {
      if (modalRef.current) {
        modalRef.current.removeEventListener('hidden.bs.modal', handleModalHidden);
      }
    };
  }, []);

  const getUsers = async () => {
    try {
      const response: AxiosResponse<Hazzard[]> = await axios.get(URL);
      const data = response.data.map(hazzard => ({
        ...hazzard,
       
      }));
      setHazzard(data);
    } catch (error) {
      showAlert("Error al obtener Peligro", "error");
    }
  };

  const openModal = (op: string, hazzard?: Hazzard) => {
    if (hazzard) {
      setId(hazzard.id);
      setName(hazzard.name);
      setDescription(hazzard.description);
      setCreateDate(hazzard.createDate);
      
    } else {
      setId("");
      setName("");
      setDescription("");
      setCreateDate("");
      
    }
    setTitle(op === "1" ? "Registrar Peligro" : "Editar Peligro");

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
    if (!name.trim()) {
      showAlert("Escribe el nombre", "warning", "nombre");
      return;
    }
    if (!description.trim()) {
      showAlert("Escribe la descripción", "warning", "descripción");
      return;
    }
    if (!createDate.trim()) {
      showAlert("Escribe la fecha", "warning", "fecha");
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
      console.log("Sending data:", data); // Debug log
      const url = method === "PUT" && id ? `${URL}${id}` : URL;
      const response = await axios({
        method,
        url,
        data,
        headers: { "Content-Type": "application/json" },
      });

      console.log("Response:", response); // Debug log

      const { tipo, msj } = response.data;
      showAlert(msj, tipo);
      getUsers();
      if (tipo === "success") {
        setTimeout(() => {
          const closeModalButton = document.getElementById("btnCerrar");
          if (closeModalButton) {
            closeModalButton.click();
          }
        }, 500);
      }
    } catch (error) {
      showAlert("Error al enviar la solicitud", "error");
      console.error("Error sending request:", error); // Debug log
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await axios.delete(`${URL}${id}`, {
        headers: { 'Content-Type': 'application/json' }
      });
      showAlert("Usuario eliminado correctamente", "success");
      getUsers();
    } catch (error) {
      showAlert("Error al eliminar el usuario", "error");
      console.error("Error deleting user:", error); // Debug log
    }
  };

  return (
    <div className="App">
      <div className="container-fluid">
        <div className="row mt-3">
          <div className="col-12">
            <div className="tabla-contenedor">
              <EncabezadoTabla title='Peligro' onClick={() => openModal("1")} />
            </div>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead className="text-center" 
                  style={{ background: 'linear-gradient(90deg, #009FE3 0%, #00CFFF 100%)', 
                  color: '#fff' }}>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                  {hazzard.map((haz, i) => (
                    <tr key={haz.id} className="text-center">
                      <td>{i + 1}</td>
                      <td>{haz.name}</td>
                      <td>{haz.description}</td>
                      <td>{haz.createDate}</td>

                      <td className="text-center">
                        <button
                          onClick={() => openModal("2", haz)}
                          className="btn btn-custom-editar m-2"
                          data-bs-toggle="modal"
                          data-bs-target="#modalUsers"
                        >
                          <i className="fa-solid fa-edit"></i>
                        </button>
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
                              deleteUser(haz.id);
                            }
                          });
                        }}
                        >
                          <FontAwesomeIcon icon={faCircleXmark} />
                        </button>
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
          id="modalUsers"
          ref={modalRef}
          data-bs-backdrop="true"
          data-bs-keyboard="false"
          tabIndex={-1}
          aria-labelledby="modalTitle"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="modalTitle">
                  {title}
                </h1>
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
                    <i className="fa-solid fa-user"></i>
                  </span>
                  <input
                    type="text"
                    id="name"
                    className="form-control"
                    placeholder="Nombre"
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
                    placeholder="Fecha"
                    value={createDate}
                    onChange={(e) => setCreateDate(e.target.value)}
                  />
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

export default Hazzard;
