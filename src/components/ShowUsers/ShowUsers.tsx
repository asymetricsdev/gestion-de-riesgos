  import React, { useEffect, useState } from "react";
  import axios from "axios";
  import Swal from "sweetalert2";
  import withReactContent from "sweetalert2-react-content";
  import { showAlert } from '../functions';
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
  import EncabezadoTabla from "../EncabezadoTabla/EncabezadoTabla";
  import * as bootstrap from 'bootstrap';


  const MySwal = withReactContent(Swal);

  interface User {
    id: string;
    name: string;
    email: string;
    priority: string;
  }

  const ShowUsers: React.FC = () => {
    const URL = "https://asymetricsbackend.uk.r.appspot.com/user/";
    const [users, setUsers] = useState<User[]>([]);
    const [id, setId] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [priority, setPriority] = useState<string>("");
    const [title, setTitle] = useState<string>("");

    useEffect(() => {
      getUsers();
    }, []);

    const getUsers = async () => {
      try {
        const response = await axios.get(URL);
        setUsers(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // Mostrar el mensaje de error desde Axios
          showAlert("Error al obtener los usuarios", "error", error.message);
        } else {
          // Mostrar un mensaje genérico de error
          showAlert("Error al obtener los usuarios", "error", "Ocurrió un error inesperado");
        }
      }
    };
    

    const openModal = (op: string, id: string, name: string, email: string, priority: string) => {
      setId(id);
      setName(name);
      setEmail(email);
      setPriority(priority);
      setTitle(op === "1" ? "Registrar Usuario" : "Editar Usuario");

      if (op === "2") {
        setId(id);
        setName(name);
        setEmail(email);
        setPriority(priority);
      }

       //Manually trigger the modal display
       const modal = new bootstrap.Modal(document.getElementById('modalUsers') as HTMLElement);
       modal.show();
     };

    return (
      <div className="App">
        <div className="container-fluid">
          <div className="row mt-3">
            <div className="col-12">
              <div className="tabla-contenedor">
                <EncabezadoTabla title='Usuarios' onNewUserClick={() => openModal("1", "", "", "", "")} />
              </div>
              <div className="table-responsive">
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
                      <tr key={user.id}>
                        <td>{i + 1}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.priority}</td>
                        <td className="text-center">
                          <button onClick={() => openModal("2", user.id, user.name, user.email, user.priority)}
                            className="btn btn-custom-editar m-2">
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
                                MySwal.fire(
                                  "Borrado",
                                  "El usuario se eliminó",
                                  "success"
                                );
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
            data-bs-backdrop="static"
            data-bs-keyboard="false"
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
                  <div className="d-grid col-6 mx-auto">
                    <button className="btn btn btn-guardar">
                      <i className="fa-solid fa-floppy-disk m-2"></i>Guardar
                    </button>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary m-2" data-bs-dismiss="modal">Cerrar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

export default ShowUsers;
