// import './DangerHeadStyle.css';

interface DangerHeadProps {
    title: string;
}
  
export default function DangerHead({ title }: DangerHeadProps) {
  return (
    <div className="encabezado-tabla">
        <h2 className="encabezado-titulo">{title}</h2>

    </div>
  )
}
