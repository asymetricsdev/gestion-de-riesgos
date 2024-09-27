import icon from '../../img/logo-login.png';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Registro.css';

interface RegisterForm {
  firstName: string;
  lastName: string;
  birthDate: string;
  username: string;
  year: number;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const [form, setForm] = useState<RegisterForm>({
    firstName: '',
    lastName: '',
    birthDate: '',
    username: '',
    year: new Date().getFullYear(),
    password: '',
    confirmPassword: ''
  });

  const [step, setStep] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/auth/register', {
        firstName: form.firstName,
        lastName: form.lastName,
        birthDate: form.birthDate,
        username: form.username,
        year: form.year,
        password: form.password
      });

      if (response.status === 200) {
        setSuccess('Usuario registrado exitosamente');
        navigate('/login');
      }
    } catch (error) {
      setError('Error en el registro. Por favor, intente nuevamente.');
    }
  };


  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const previousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 container-lg">
      <div>
        <div className="card custom-card-bg bg-red mb-3">
          <div className="text-center text-white fw-bold fs-5">REGISTRO</div>
          <div className="card-body">
            <div className="text-center">
              <img src={icon} alt="Asymetrics Logo" style={{ width: '65px' }} />
            </div>
            <h5 className="card-title text-center text-white fw-bold mt-2">Asymetrics</h5>
            <div className="card-text">
              <form className="px-4 py-3" onSubmit={handleSubmit}>
                {/* Primer Paso: Información Personal */}
                {step === 1 && (
                  <>
                    <div className="mb-3">
                      <label className="form-label text-white fw-bold">Nombres</label>
                      <input
                        type="text"
                        className="form-control"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-white fw-bold">Apellidos</label>
                      <input
                        type="text"
                        className="form-control"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-white fw-bold">Fecha de Nacimiento</label>
                      <input
                        type="date"
                        className="form-control"
                        name="birthDate"
                        value={form.birthDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </>
                )}

                {/* Segundo Paso: Información de Cuenta */}
                {step === 2 && (
                  <>
                    <div className="mb-3">
                      <label className="form-label text-white fw-bold">Nombre de Usuario</label>
                      <input
                        type="text"
                        className="form-control"
                        name="username"
                        value={form.username}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-white fw-bold">Año de Registro</label>
                      <input
                        type="number"
                        className="form-control"
                        name="year"
                        value={form.year}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </>
                )}

                {/* Tercer Paso: Contraseña */}
                {step === 3 && (
                  <>
                    <div className="mb-3">
                      <label className="form-label text-white fw-bold">Contraseña</label>
                      <input
                        type="password"
                        className="form-control"
                        name="password"
                        value={form.password}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-white fw-bold">Confirmar Contraseña</label>
                      <input
                        type="password"
                        className="form-control"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </>
                )}

                {error && <div className="alert alert-danger mt-3">{error}</div>}
                {success && <div className="alert alert-success mt-3">{success}</div>}

                {/* Botones de navegación entre pasos */}
                <div className="d-flex justify-content-between mt-4">
                  {step > 1 && (
                    <button type="button" className="btn btn-secondary" onClick={previousStep}>
                      Anterior
                    </button>
                  )}
                  {step < 3 && (
                    <button type="button" className="btn btn-primary" onClick={nextStep}>
                      Siguiente
                    </button>
                  )}
                  {step === 3 && (
                    <button type="submit" className="btn btn-primary">
                      Registrarse
                    </button>
                  )}
                </div>
              </form>

              <div className="mt-3">
                <a className="dropdown-item text-white" href="/login">
                  ¿Ya tienes cuenta? Iniciar sesión
                </a>
                <a className="dropdown-item text-white" href="#">
                  ¿Has olvidado tu contraseña?
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
