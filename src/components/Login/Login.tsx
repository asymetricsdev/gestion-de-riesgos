import React from 'react';
import './Login.css'
import icon from '../../img/logo-login.png'; 

export default function Login() {
  /* const cardStyle = {
    
    backgroundColor: '#0D6EFD',
  }; */

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
              <form className="px-4 py-3">
                <div className="mb-3">
                  <label htmlFor="exampleDropdownFormEmail1" className="form-label text-white fw-bold">Email</label>
                  <input type="email" className="form-control" id="exampleDropdownFormEmail1" placeholder="email@example.com" />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleDropdownFormPassword1" className="form-label text-white fw-bold">Password</label>
                  <input type="password" className="form-control" id="exampleDropdownFormPassword1" placeholder="Password" />
                </div>
                <div className="mb-3">
                  <div className="form-check">
                    <input type="checkbox" className="form-check-input" id="dropdownCheck" />
                    <label className="form-check-label text-white" htmlFor="dropdownCheck">
                      Recuérdame
                    </label>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary w-100">Iniciar Sesión</button>
              </form>
              <div className="mt-3">
                <a className="dropdown-item text-white" href="#">Registrarse</a>
                <a className="dropdown-item text-white" href="#">¿Has olvidado tu contraseña?</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
