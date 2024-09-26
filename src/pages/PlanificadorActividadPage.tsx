import { PlanificadorActividad }from '../components/PlanificadorActividad/PlanificadorActividad'
import ActivityPlanner from "../components/ActivityPlanner/ActivityPlanner";
import InfoCard from '../components/InfoCard/InfoCard';

export default function PlanificadorActividadPage() {
  return (
    <div>
       <ActivityPlanner /> 
       <InfoCard name="John Doe" rut="123456789" program="Program A" numberOfPeople={5} />
       <PlanificadorActividad title="Actividades" /> 
      
      
    </div>
  )  
  
}
