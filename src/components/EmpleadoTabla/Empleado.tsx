import React, { useEffect, useState, useRef } from "react";
import axios, { AxiosResponse } from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { showAlert } from '../functions';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import EncabezadoTabla from "../EncabezadoTabla/EncabezadoTabla";
import * as bootstrap from 'bootstrap';


const MySwal = withReactContent(Swal);
interface Empleado {
  id: number;
  name: string;
  description: string;
  rut: string;
  firstName: string;
  lastName: string;
  createDate?: string;
  updateDate?: string;
  position: Position;
  tasks: Tasks[];
}

interface Position {
  id: number;
  name: string;
  description: string;
  createDate?: string;
  updateDate?: string;
}

interface Tasks {
  id: number;
  name: string;
  description: string;
  createDate?: string;
  updateDate?: string;
  version: number;
  extension: string;
  taskType: TaskType;
}

interface TaskType {
  id: number;
  name: string;
  description: string;
  createDate?: string;
  updateDate?: string;
}


const Empleado: React.FC = () => {
  const URL = "https://asymetricsbackend.uk.r.appspot.com/employee/";
  const [empleado, setEmpleado] = useState<Empleado[]>([]);
  const [id, setId] = useState<number | null>(null);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>(""); 
  const [rut, setRut] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [position, setPosition] = useState<Position[]>([]);
  const [selectedPositionId, setSelectedPositionId] = useState<number>(0);
  const [title, setTitle] = useState<string>("");
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    getEmpleado();
    getPosition();
    if (modalRef.current) {
      modalRef.current.addEventListener('hidden.bs.modal', handleModalHidden);
    }
    return () => {
      if (modalRef.current) {
        modalRef.current.removeEventListener('hidden.bs.modal', handleModalHidden);
      }
    };
  }, []);

  const getEmpleado = async () => {
    try {
      const response: AxiosResponse<Empleado[]> = await axios.get(URL);
      setEmpleado(response.data);
    } catch (error) {
      showAlert("Error al obtener los peligros", "error");
    }
  };
  
  const getPosition = async () => {
    try {
      const response = await axios.get<Position[]>('https://asymetricsbackend.uk.r.appspot.com/position/');
      setPosition(response.data);
    } catch (error) {
      showAlert("Error al obtener el cargo del empleado", "error");
    }
  };
  
  const openModal = (op: string, empleado?: Empleado) => {
    if (op === "1") {
      setId(null);
      setName("");
      setDescription(""); 
      setRut("");
      setFirstName("");
      setLastName("");
      setSelectedPositionId(0);
      setTitle("Registrar Empleado");
    } else if (op === "2" && empleado) {
      setId(empleado.id);
      setName(empleado.name);
      setDescription(empleado.description); 
      setRut(empleado.rut);
      setFirstName(empleado.firstName);
      setLastName(empleado.lastName);
      setSelectedPositionId(empleado.position.id);

      setTitle("Editar Empleado");
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
    if (firstName.trim() === "") {
        showAlert("Escribe el nombre del empleado", "warning");
        return;
    }

    if (lastName.trim() === "") {
        showAlert("Escribe el apellido del empleado", "warning");
        return;
    }

    if (rut.trim() === "") {
        showAlert("Escribe el rut del empleado", "warning");
        return;
    }

    if (selectedPositionId === 0) {
        showAlert("Escribe el cargo del empleado", "warning");
        return;
    }
    
    // Tipado explícito para los parámetros a enviar
      const parametros: Tasks = {
        rut: rut.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        positionId:  selectedPositionId               
    };  


    const metodo: "PUT" | "POST" = id ? "PUT" : "POST";
    enviarSolicitud(metodo, parametros); 
};

   const enviarSolicitud = async (method: "POST" | "PUT", data: Tasks) => {
    try {
      const url = method === "PUT" && id ? `${URL}${id}/` : URL;
      const response = await axios({
        method,
        url,
        data,
        headers: { "Content-Type": "application/json" },
      });
  
      showAlert("Operación realizada con éxito", "success");
      getEmpleado();
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
    }
  }; 

  //BORRAMOS EL DATO DE LA TABLA
   const deleteEmpleado = async (id: number) => {
    try {
      await axios.delete(`${URL}${id}/`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      showAlert("Empleado eliminado correctamente", "success");
      getEmpleado();
    } catch (error) {
      showAlert("Error al eliminar empleado", "error");
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
              <EncabezadoTabla title='Empleados' onClick={() => openModal("1")} />
            </div>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead className="text-center"
                  style={{ background: 'linear-gradient(90deg, #009FE3 0%, #00CFFF 100%)', color: '#fff' }}>
                  <tr>
                    <th>N°</th>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Rut</th>
                    <th>Descripción</th>  
                    <th>Cargo</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                  {empleado.map((emp, i) => (
                    <tr key={JSON.stringify(emp)} className="text-center">
                      <td>{i + 1}</td>
                      <td>{emp.firstName}</td>
                      <td>{emp.lastName}</td>
                      <td>{emp.rut}</td>
                      <td>{emp.description}</td>  
                      <td>{emp.position.name}</td> 
                      <td>{emp.createDate ? formatDate(emp.createDate) : ''}</td>
                      <td className="text-center">
                        <OverlayTrigger placement="top" overlay={renderEditTooltip({})}>
                          <button
                            onClick={() => openModal("2", emp)}
                            className="btn btn-custom-editar m-2"
                          >
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
                                deleteEmpleado(emp.id);
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
                <div className="input-group mb-3">
                  <span className="input-group-text">
                  <i className="fa-solid fa-id-card-clip"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nombre"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="input-group mb-3">
                  <span className="input-group-text">
                  <i className="fa-solid fa-id-card-clip"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Apellidos"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div className="input-group mb-3">
                  <span className="input-group-text">
                  <i className="fa-solid fa-id-card-clip"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Rut ej. 12345678-9"
                    value={rut}
                    onChange={(e) => setRut(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="position" className="form-label">Cargo</label>
                  <select
                    id="position"
                    className="form-select"
                    value={selectedPositionId}
                    onChange={(e) => setSelectedPositionId(Number(e.target.value))}
                  >
                    <option value={0}>Seleccione el cargo</option>
                    {position.map(pos => (
                      <option key={JSON.stringify(pos)} value={pos.id}>{pos.name}</option>
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

export default Empleado;
