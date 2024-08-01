import './CardActivitiesStyle.css';
import logo from '../../img/grafico-test.png';

export default function CardActivities() {
  return (
    <div>
        <div className="card-container">
        <div className="card">
          <div>
          <img
            src={logo}
            alt="ASYMETRICS"
            style={{ width: '100%', height: 'auto' }} 
          />
          </div>
          
        </div>
      </div>
    </div>
  )
}
