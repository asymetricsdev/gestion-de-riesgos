import React, { useState } from 'react';
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import axios from 'axios';
import { showAlert } from '../components/functions';
import '../components/Login/Login.css'; 
import { useNavigate } from 'react-router-dom';
import icon from "../img/logo-login.png";

type LoginFormsInputs = {
  userName: string;
  password: string;
};

const validationSchema = Yup.object().shape({
  userName: Yup.string().required("Username es requerido"),
  password: Yup.string().required("Password es requerido"),
});

const baseURL = import.meta.env.VITE_API_URL;

const LoginPage = ({ onLogin }: { onLogin: (token: string) => void }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormsInputs>({ resolver: yupResolver(validationSchema) });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleLogin = async (formData: LoginFormsInputs) => {
    setLoading(true);
    try {
      const data = {
        username: formData.userName,
        password: formData.password
      };
  
      const response = await axios.post(`${baseURL}/auth/login`, data);
  
      const token = response.data.token;
      setLoading(false);
      if (token) {
        await showAlert("Bienvenido a la sesión", "success");
        setIsLoggedIn(true);
        onLogin(token); 
        setErrorMessage(null);
        sessionStorage.setItem('authToken', token); 
        navigate("/home");
      } else {
        setErrorMessage("Credenciales erróneas");
      }
    } catch (error: any) {
      console.error("Error durante el inicio de sesión", error);
      setLoading(false);
  
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Fallo al iniciar sesión.");
      }
    }
  };

  if (isLoggedIn) {
    return null; 
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="text-center text-white fw-bold fs-5">LOGIN</div>
        <div className="card-body">
          <div className="text-center">
            <img src={icon} alt="Asymetrics Logo" style={{ width: '65px' }} /> 
          </div>
          <h5 className="card-title text-center text-white fw-bold mt-2">Asymetrics</h5>
          <div className="card-text">
            {errorMessage && <p className="text-danger">{errorMessage}</p>}
            <form className="login-form" onSubmit={handleSubmit(handleLogin)}>
              <div className="mb-3">
                <label htmlFor="userName" className="form-label text-white fw-bold">Email</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="userName"
                  {...register("userName")}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                />
                {errors.userName && <p className="text-danger">{errors.userName.message}</p>}
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label text-white fw-bold">Password</label>
                <input 
                  type="password" 
                  className="form-control" 
                  id="password"
                  {...register("password")}
                  autoComplete="off" 
                  autoCorrect="off"
                  spellCheck="false" 
                />
                {errors.password && <p className="text-danger">{errors.password.message}</p>}
              </div>
              <button
									type="submit"
									className="btn btn-primary"
									disabled={loading}>
									{loading ? (
										<span
											className="spinner-border spinner-border-sm"
											role="status"
											aria-hidden="true"
										></span>
									) : (
										"Iniciar Sesión"
									)}
								</button>
            </form>
            <div className="mt-3">
              <a className="dropdown-item text-white" href="#">Registrarse</a>
              <a className="dropdown-item text-white" href="#">¿Has olvidado tu contraseña?</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
