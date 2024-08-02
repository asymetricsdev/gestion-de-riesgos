import DangerHead from '../DangerHead/DangerHead'

export default function DangerTable() {
  return (
    
       
      <div className="container-fluid">
        <div className="row mt-3">
          <div className="col-12">
            <div className="tabla-contenedor">
              <DangerHead title="Matriz de riesgo"/>
            </div>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead className="text-center" 
                style={{ background: 'linear-gradient(90deg, #009FE3 0%, #00CFFF 100%)', 
                color: '#fff' }}>
                  <tr>
                    <th>Tipo de Actividad</th>
                    <th>Peligro</th>
                    <th>Riesgo</th>
                    <th>CR</th>
                    <th>Nivel de Criticidad</th>
                    <th>Medidas Preventivas</th>
                    <th>Verificador de Control</th>
                    <th>Jerarquia de Control</th>

                  </tr>
                </thead>
                <tbody className="table-group-divider">
                  
                    <tr className="text-center">
                      <td>Inspección de vehiculos</td>
                      <td>Golpes/Cortes por objetos/Herramientas</td>
                      <td>Heridas/Quemaduras/Muerte</td>
                      <td>4</td>
                      <td>Moderado</td>
                      <td>Tener Cuidado con lo que se toca o manipula con las manos</td>
                      <td>PTS AU 1</td>
                      <td className="text-center">Administrativa</td>
                    </tr>
                  
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    
  )
}
