
import icon from '../../img/logo-login.png'; 
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'

interface LoginForm {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const [form, setForm] = useState<LoginForm>({ username: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
          const response = await axios.post('http://localhost:8080/auth/login', form);
          if (response.status === 200) {
              navigate('/dashboard');
          }
      } catch (error) {
          setError('Invalid credentials');
      }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 container-lg">
      <div>
        <div className="card custom-card-bg bg-red mb-3">
          <div className="text-center text-white fw-bold fs-5">LOGIN</div>
          <div className="card-body">
            <div className="text-center">
              <img src={icon} alt="Asymetrics Logo" style={{ width: '65px' }} /> 
            </div>
            <h5 className="card-title text-center text-white fw-bold mt-2">Asymetrics</h5>
            <div className="card-text">
              <form className="px-4 py-3" onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="exampleDropdownFormEmail1" className="form-label text-white fw-bold">Email</label>
                  <input type="text" className="form-control"  name="username" value={form.username} onChange={handleInputChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleDropdownFormPassword1" className="form-label text-white fw-bold">Password</label>
                  <input type="password" className="form-control"  name="password" value={form.password} onChange={handleInputChange} />
                </div>
                <button type="submit" className="btn btn-primary w-100">Iniciar Sesión</button>
              </form>
              <div className="mt-3">
                <a className="dropdown-item text-white" href="#">Registrarse</a>
                <a className="dropdown-item text-white" href="#">¿Has olvidado tu contraseña?</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
