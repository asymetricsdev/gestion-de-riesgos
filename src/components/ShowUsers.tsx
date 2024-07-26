import React, { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { showAlert } from "./functions";

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
      const response: AxiosResponse<User[]> = await axios.get(URL);
      setUsers(response.data);
    } catch (error) {
      showAlert("Error al obtener los usuarios", "error");
    }
  };

  const openModal = (op: string, user?: User) => {
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

    setTimeout(() => {
      document.getElementById("nombre")?.focus();
    }, 500);
    
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

  const enviarSolicitud = async (metodo: "POST" | "PUT", parametros: any) => {
    try {
      console.log(".....",`${URL}${id}`);
      const response: AxiosResponse = await axios({
        method: metodo,
        url: metodo === "PUT" ? `${URL}` : URL,
        data: parametros,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const { tipo, msj } = response.data;
      showAlert(msj, tipo);

      if (tipo === "success") {
        document.getElementById("btnCerrar")?.click();
        getUsers();
      }
    } catch (error) {
      showAlert("Error al enviar la solicitud", "error");
      console.log(error);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const response: AxiosResponse = await axios.delete(`${id}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const { tipo, msj } = response.data;
      showAlert(msj, tipo);

      if (tipo === "success") {
        getUsers();
      }
    } catch (error) {
      showAlert("Error al eliminar el usuario", "error");
      console.log(error);
    }
  };

  return (
    <div className="App">
      <div className="container-fluid">
        <div className="row mt-3">
          <div className="col-md-4 offset-4">
            <div className="d-grid mx-auto">
              <button
                onClick={() => openModal("1")}
                type="button"
                className="btn btn-dark"
                data-bs-toggle="modal"
                data-bs-target="#modalUsers"
              >
                <i className="fa-solid fa-circle-plus"></i> Nuevo Usuario
              </button>
            </div>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-12 col-lg-8 offset-2">
            <div className="table-responsive">
              <table className="table table-bordered table-head">
                <thead className="text-center">
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
                        <button
                          onClick={() => openModal("2", user)}
                          className="btn btn-primary m-2"
                          data-bs-toggle="modal"
                          data-bs-target="#modalUsers"
                        >
                          <i className="fa-solid fa-edit"></i> Editar
                        </button>
                        <button
                          className="btn btn-danger"
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
                                deleteUser(user.id);
                              }
                            });
                          }}
                        >
                          <i className="fa-solid fa-trash"></i> Eliminar
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
              <div className="modal-header">
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
                  <button onClick={validar} className="btn btn-success">
                    <i className="fa-solid fa-floppy-disk m-2"></i>Guardar
                  </button>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary m-2"
                  data-bs-dismiss="modal"
                  id="btnCerrar"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowUsers;
