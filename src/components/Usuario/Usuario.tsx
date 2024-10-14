import React, { useEffect, useState, useRef } from "react";
import axios, { AxiosResponse } from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { showAlert } from '../functions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import EncabezadoTabla from "../EncabezadoTabla/EncabezadoTabla";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import * as bootstrap from 'bootstrap';

const MySwal = withReactContent(Swal);

interface Usuario {
  id: string;
  name: string;
  email: string;
  priority: string;
  
}

const ShowUsers: React.FC = () => {
  const URL = "https://asymetricsbackend.uk.r.appspot.com/user/";
  const [users, setUsers] = useState<Usuario[]>([]);
  const [id, setId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [priority, setPriority] = useState<string>("");
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
      const response: AxiosResponse<Usuario[]> = await axios.get(URL);
      setUsers(response.data);
    } catch (error) {
      showAlert("Error al obtener los usuarios", "error");
    }
  };

  const openModal = (op: string, user?: Usuario) => {
    if (user) {
      setId(user.id);
      setName(user.name);
      setEmail(user.email);
      setPriority(user.priority.toString());
    } else {
      setId("");
      setName("");
      setEmail("");
      setPriority("");
    }
    setTitle(op === "1" ? "Registrar Usuario" : "Editar Usuario");

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
      showAlert("Escribe el nombre", "warning", "nombre");
      return;
    }
    if (email.trim() === "") {
      showAlert("Escribe el email", "warning", "email");
      return;
    }
    if (priority.trim() === "") {
      showAlert("Escribe la prioridad", "warning", "priority");
      return;
    }

    const parametros = { id, name: name.trim(), email: email.trim(), priority: priority.trim() };
    const metodo = id ? "PUT" : "POST";
    enviarSolicitud(metodo, parametros);
  };

  const enviarSolicitud = async (method: "POST" | "PUT", data: any) => {
    try {
      const url = method === "PUT" && id ? `${URL}` : URL;
      const response = await axios({
        method,
        url,
        data,
        headers: { "Content-Type": "application/json" },
      });

      const { tipo, msj } = response.data;
      showAlert(msj, tipo);
      getUsers();
      if (tipo === "success") {
        setTimeout(() => {
          const closeModalButton = document.getElementById("btnCerrar");
          if (closeModalButton) {
            closeModalButton.click();
          }
          getUsers();
        }, 500);
      }
    } catch (error) {
      showAlert("Error al enviar la solicitud", "error");
      console.error(error);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await axios.delete(`${URL}${id}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      showAlert("Usuario eliminado correctamente", "success");
      getUsers(); 
    } catch (error) {
      showAlert("Error al eliminar el usuario", "error");
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

  return (
    <div className="App">
      <div className="container-fluid">
        <div className="row mt-3">
          <div className="col-12">
            <div className="tabla-contenedor">
              <EncabezadoTabla title='Usuarios' onClick={() => openModal("1")} />
            </div>
            <div className="table-responsive tabla-scroll">
              <table className="table table-bordered">
                <thead className="text-center" 
                style={{ background: 'linear-gradient(90deg, #009FE3 0%, #00CFFF 100%)', 
                color: '#fff' }}>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Prioridad</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                  {users.map((user, i) => (
                    <tr key={user.id} className="text-center">
                      <td>{i + 1}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.priority}</td>
                      <td className="text-center">
                        <OverlayTrigger placement="top" overlay={renderEditTooltip}>
                          <button
                            onClick={() => openModal("2", user)}
                            className="btn btn-custom-editar m-2"
                            data-bs-toggle="modal"
                            data-bs-target="#modalUsers"
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
                                deleteUser(user.id);
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
          id="modalUsers"
          ref={modalRef}
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
                    type="email"
                    id="email"
                    className="form-control"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="input-group mb-3">
                  <span className="input-group-text">
                    <i className="fa-solid fa-thumbtack"></i>
                  </span>
                  <input
                    type="text"
                    id="priority"
                    className="form-control"
                    placeholder="Prioridad"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
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

export default Usuario;
