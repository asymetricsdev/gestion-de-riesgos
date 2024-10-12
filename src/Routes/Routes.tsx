
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute'; 
import Home from '../Pages/HomePage';
import MatrizPeligro from '../Pages/MatrizPeligroPage';
import PlanificadorActividad from '../Pages/PlanificadorActividadPage';
import Planificacion from '../Pages/PlanificacionPage';
import Perfiles from '../Pages/PerfilesPage';
import Compañia from '../Pages/CompañiaPage';
import TipoActividad from '../Pages/TipoActividadesPage';
import Criticidad from '../Pages/CriticidadPage';
import Area from '../Pages/AreaPage';
import Peligro from '../Pages/PeligroPage';
import Riesgo from '../Pages/RiesgoPage';
import Ciudad from '../Pages/CiudadPage';
import Cargo from '../Pages/CargoPage';
import Proceso from '../Pages/ProcesoPage';
import Actividad from '../Pages/ActividadPage';
import Tareas from '../Pages/TareasPage';
import TipoTareas from '../Pages/TipoTareasPage';
import Colaboradores from '../Pages/ColaboradoresPage';
import Items from '../Pages/ItemsPage';
import VerificadorControl from '../Pages/VerificadorControlPage';
import JerarquiaControl from '../Pages/JerarquiaControlPage';
import TareaColaborador from '../Pages/TareaColaboradorPage';
import ColaboradorEjecutarTarea from '../Pages/ColaboradorEjecutarTareaPage';
import Estados from '../Pages/EstadosPage';
import LoginPage from '../Pages/LoginPage';

type RoutesProps = {
  isAuthenticated: boolean;
  onLogin: (token: string) => void;
};

export const AppRoutes = ({ isAuthenticated, onLogin }: { isAuthenticated: boolean, onLogin: (token: string) => void }) => {

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<LoginPage onLogin={onLogin} />} />

      {/* Rutas privadas, accesibles solo si el usuario está autenticado */}
      <Route
        path="/home"
        element={<PrivateRoute isAuthenticated={isAuthenticated} component={<Home />} />}
      />
      <Route
        path="/planificacion"
        element={<PrivateRoute isAuthenticated={isAuthenticated} component={<PlanificadorActividad />} />}
      />
      <Route
        path="/planificacion/planificacion"
        element={<PrivateRoute isAuthenticated={isAuthenticated} component={<Planificacion />} />}
      />
      <Route
        path="/planificacion/planificador-de-actividad"
        element={<PrivateRoute isAuthenticated={isAuthenticated} component={<PlanificadorActividad />} />}
      />
      <Route
        path="/planificacion/actividades"
        element={<PrivateRoute isAuthenticated={isAuthenticated} component={<Actividad />} />}
      />
      <Route
        path="/planificacion/perfiles"
        element={<PrivateRoute isAuthenticated={isAuthenticated} component={<Perfiles />} />}
      />

      {/* Verificación */}
      <Route
        path="/verificacion/verificadores-de-control"
        element={<PrivateRoute isAuthenticated={isAuthenticated} component={<VerificadorControl />} />}
      />
      <Route
        path="/verificacion/items"
        element={<PrivateRoute isAuthenticated={isAuthenticated} component={<Items />} />}
      />

      {/* Matriz de Peligro */}
      <Route
        path="/matriz-de-peligro"
        element={<PrivateRoute isAuthenticated={isAuthenticated} component={<MatrizPeligro />} />}
      />
      <Route
        path="/matriz-de-peligro/matriz-peligro"
        element={<PrivateRoute isAuthenticated={isAuthenticated} component={<MatrizPeligro />} />}
      />
      <Route
        path="/matriz-de-peligro/configuracion/tareas"
        element={<PrivateRoute isAuthenticated={isAuthenticated} component={<Tareas />} />}
      />
      <Route
        path="/matriz-de-peligro/configuracion/tipo-de-tareas"
        element={<PrivateRoute isAuthenticated={isAuthenticated} component={<TipoTareas />} />}
      />
      <Route
        path="/matriz-de-peligro/configuracion/criticidad-de-peligro"
        element={<PrivateRoute isAuthenticated={isAuthenticated} component={<Criticidad />} />}
      />
      <Route
        path="/matriz-de-peligro/configuracion/jerarquia-de-control"
        element={<PrivateRoute isAuthenticated={isAuthenticated} component={<JerarquiaControl />} />}
      />
      <Route
        path="/matriz-de-peligro/configuracion/peligro"
        element={<PrivateRoute isAuthenticated={isAuthenticated} component={<Peligro />} />}
      />
      <Route
        path="/matriz-de-peligro/configuracion/riesgos"
        element={<PrivateRoute isAuthenticated={isAuthenticated} component={<Riesgo />} />}
      />
       <Route
        path="/matriz-de-peligro/configuracion/estados"
        element={<PrivateRoute isAuthenticated={isAuthenticated} component={<Estados />} />}
      />

      {/* Tipos de Actividad */}
      <Route
        path="/tipo-de-actividad/tipo-de-actividad"
        element={<PrivateRoute isAuthenticated={isAuthenticated} component={<TipoActividad />} />}
      />

      {/* Organización */}
      <Route
        path="/organizacion/ciudad"
        element={<PrivateRoute isAuthenticated={isAuthenticated} component={<Ciudad />} />}
      />
      <Route
        path="/organizacion/compañias"
        element={<PrivateRoute isAuthenticated={isAuthenticated} component={<Compañia />} />}
      />
      <Route
        path="/organizacion/areas"
        element={<PrivateRoute isAuthenticated={isAuthenticated} component={<Area />} />}
      />
      <Route
        path="/organizacion/colaboradores"
        element={<PrivateRoute isAuthenticated={isAuthenticated} component={<Colaboradores />} />}
      />
      <Route
        path="/organizacion/cargos"
        element={<PrivateRoute isAuthenticated={isAuthenticated} component={<Cargo />} />}
      />
      <Route
        path="/organizacion/procesos"
        element={<PrivateRoute isAuthenticated={isAuthenticated} component={<Proceso />} />}
      />

      {/* Tarea Colaborador */}
      <Route
        path="/tarea-colaborador/:id"
        element={<PrivateRoute isAuthenticated={isAuthenticated} component={<TareaColaborador />} />}
      />
      <Route
        path="/colaborador-ejecutar-tarea/:empId/tarea/:taskId"
        element={<PrivateRoute isAuthenticated={isAuthenticated} component={<ColaboradorEjecutarTarea />} />}
      />
      
      {/* Redirigir a login si no se encuentra la ruta */}
      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
  );
};
