import React, { useState } from "react";
import { Nav, OverlayTrigger, Tooltip } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "./MenuStyle.css";

interface SidebarProps {
	isOpen: boolean;
	toggleSidebar: () => void;
}

const Menu: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
	const [isOrgOpen, setIsOrgOpen] = useState(false);
	const [isPlanOpen, setIsPlanOpen] = useState(false);
	const [isMatrizOpen, setIsMatrizOpen] = useState(false);
	const [isVerificacionOpen, setIsVerificacionOpen] = useState(false);
    const [isActividadesOpen, setIsActividadesOpen] = useState(false);

	const toggleOrgSubmenu = () => {
		setIsOrgOpen(!isOrgOpen);
	};

	const togglePlanSubmenu = () => {
		setIsPlanOpen(!isPlanOpen);
	};

	const toggleMatrizSubmenu = () => {
		setIsMatrizOpen(!isMatrizOpen);
	};

	const toggleVerificacionSubmenu = () => {
		setIsVerificacionOpen(!isVerificacionOpen);
	};

	const renderTooltip = (text: string) => <Tooltip id="button-tooltip">{text}</Tooltip>;

	const [isConfiguracionMatrizOpen, setIsConfiguracionMatrizOpen] = useState(false);

	const toggleConfiguracionMatrizSubmenu = () => {
		setIsConfiguracionMatrizOpen(!isConfiguracionMatrizOpen);
	};

    const toggleActividadesSubmenu = () => {
        setIsActividadesOpen(!isActividadesOpen);
    };


	return (
		<div className={`sidebar bg-dark text-white vh-100 ${isOpen ? "open" : ""}`}>
			<Nav defaultActiveKey="/home" className="flex-column">
				{/* Home */}
				{isOpen ? (
					<NavLink to="/home" id="home" className="nav-link text-custom-color d-flex align-items-center">
						<i className="fa-solid fa-home"></i>
						<span>Home</span>
					</NavLink>
				) : (
					<OverlayTrigger placement="right" overlay={renderTooltip("Home")}>
						<NavLink to="/home" className="nav-link text-white text-custom-color d-flex align-items-center">
							<i className="fa-solid fa-home"></i>
						</NavLink>
					</OverlayTrigger>
				)}
				{isOpen ? (
					<NavLink to="/login" id="login" className="nav-link text-custom-color d-flex align-items-center">
						<i className="fa-solid fa-arrow-right-to-bracket"></i>
						<span>Login</span>
					</NavLink>
				) : (
					<OverlayTrigger placement="right" overlay={renderTooltip("Login")}>
						<NavLink to="/login" className="nav-link text-white text-custom-color d-flex align-items-center">
						<i className="fa-solid fa-arrow-right-to-bracket"></i>
						</NavLink>
					</OverlayTrigger>
				)}

				{/* Planificación Submenu */}
				{isOpen ? (
					<div
						className="nav-link text-white fw-bold text-custom-color d-flex align-items-center"
						onClick={togglePlanSubmenu}
					>
						<i className="fa-solid fa-business-time"></i>
						<span>Planificación</span>
						<i
							className={`ms-auto ${
								isPlanOpen ? "fa-solid fa-chevron-up" : "fa-solid fa-chevron-down"
							}`}
						></i>
					</div>
				) : (
					<OverlayTrigger placement="right" overlay={renderTooltip("Planificación")}>
						<div
							className="nav-link text-white text-custom-color d-flex align-items-center"
							onClick={togglePlanSubmenu}
						>
							<i className="fa-solid fa-business-time"></i>
						</div>
					</OverlayTrigger>
				)}
				{isPlanOpen && (
					<div className="submenu">
						{isOpen ? (
						<NavLink
							to="/planificacion/planificacion"
							className="nav-link text-white d-flex align-items-center"
						>
							<i className="fa-solid fa-calendar-week"></i>
							<span>Planificación</span>
						</NavLink>
						) : (
							<OverlayTrigger placement="right" overlay={renderTooltip("Planificacion")}>
								<NavLink
									to="/planificacion/planificacion"
									className="nav-link text-white d-flex align-items-center">
									<i className="fa-solid fa-calendar-week"></i>
								</NavLink>
							</OverlayTrigger>
						)}	
						{isOpen ? (
						<NavLink
							to="/planificacion/planificador-de-actividad"
							className="nav-link text-white d-flex align-items-center"
						>
							<i className="fa-solid fa-calendar-alt"></i>
							<span>Planificador de Actividad</span>
						</NavLink>
						) : (
							<OverlayTrigger placement="right" overlay={renderTooltip("Planificador de Actividad")}>
								<NavLink
									to="/planificacion/planificador-de-actividad"
									className="nav-link text-white d-flex align-items-center"
								>
									<i className="fa-solid fa-calendar-alt"></i>
								</NavLink>
							</OverlayTrigger>
						)}	
						{isOpen ? (	
						<NavLink
							to="/planificacion/actividades"
							className="nav-link text-white d-flex align-items-center"
						>
							<i className="fa-solid fa-chart-line"></i>
							<span>Actividades</span>
						</NavLink>
						) : (
							<OverlayTrigger placement="right" overlay={renderTooltip("Actividades")}>
								<NavLink
									to="/planificacion/actividades"
									className="nav-link text-white d-flex align-items-center"
								>
									<i className="fa-solid fa-chart-line"></i>
								</NavLink>
							</OverlayTrigger>
						)}
						{isOpen ? (
						<NavLink
							to="/planificacion/perfiles"
							className="nav-link text-white d-flex align-items-center"
						>
							<i className="fa-solid fa-id-badge"></i>
							<span>Perfiles</span>
						</NavLink>
						) : (
							<OverlayTrigger placement="right" overlay={renderTooltip("Perfiles")}>
								<NavLink
									to="/planificacion/perfiles"
									className="nav-link text-white d-flex align-items-center"
								>
									<i className="fa-solid fa-id-badge"></i>
								</NavLink>
							</OverlayTrigger>
						)}
					</div>
				)}

				{/* Verificación Submenu */}
				{isOpen ? (
					<div
						className="nav-link text-white text-custom-color fw-bold d-flex align-items-center"
						onClick={toggleVerificacionSubmenu}
					>
						<i className="fa-solid fa-circle-check"></i>
						<span>Verificación</span>
						<i
							className={`ms-auto ${
								isVerificacionOpen ? "fa-solid fa-chevron-up" : "fa-solid fa-chevron-down"
							}`}
						></i>
					</div>
				) : (
					<OverlayTrigger placement="right" overlay={renderTooltip("Verificación")}>
						<div
							className="nav-link text-white text-custom-color d-flex align-items-center"
							onClick={toggleVerificacionSubmenu}
						>
							<i className="fa-solid fa-circle-check"></i>
						</div>
					</OverlayTrigger>
				)}

				{isVerificacionOpen && (
					<div className="submenu">
						{isOpen ? (
						<NavLink
							to="/verificacion/verificadores-de-control"
							className="nav-link text-white d-flex align-items-center"
						>
							<i className="fa-solid fa-list-check"></i>
							<span>Verificadores de Control</span>
						</NavLink>
						) : (
							<OverlayTrigger placement="right" overlay={renderTooltip("Verificadores")}>
								<NavLink
									to="/verificacion/verificadores-de-control"
									className="nav-link text-white d-flex align-items-center"
								>
									<i className="fa-solid fa-list-check"></i>
								</NavLink>
							</OverlayTrigger>
						)}
						{isOpen ? (
						<NavLink
							to="/verificacion/items"
							className="nav-link text-white d-flex align-items-center"
						>
							<i className="fa-solid fa-rectangle-list"></i>
							<span>Items</span>
						</NavLink>
						) : (
							<OverlayTrigger placement="right" overlay={renderTooltip("Items")}>
								<NavLink
									to="/verificacion/items"
									className="nav-link text-white d-flex align-items-center"
								>
									<i className="fa-solid fa-rectangle-list"></i>
								</NavLink>
							</OverlayTrigger>
						)}
					</div>
				)}

				{/* Matriz de Peligro Submenu */}
				{isOpen ? (
					<div
						className="nav-link text-white text-custom-color fw-bold d-flex align-items-center"
						onClick={toggleMatrizSubmenu}
					>
						<i className="fa-solid fa-triangle-exclamation"></i>
						<span>Matriz de Peligro</span>
						<i
							className={`ms-auto ${
								isMatrizOpen ? "fa-solid fa-chevron-up" : "fa-solid fa-chevron-down"
							}`}
						></i>
					</div>
				) : (
					<OverlayTrigger placement="right" overlay={renderTooltip("Matriz de Peligro")}>
						<div
							className="nav-link text-white text-custom-color d-flex align-items-center"
							onClick={toggleMatrizSubmenu}
						>
							<i className="fa-solid fa-triangle-exclamation"></i>
						</div>
					</OverlayTrigger>
				)}

				{isMatrizOpen && (
					<div className="submenu">
						{/* Opción de Matriz de Peligro */}
						{isOpen ? (
							<NavLink
								to="/matriz-de-peligro/matriz-peligro"
								className="nav-link text-white d-flex align-items-center"
							>
								<i className="fa-solid fa-table-cells"></i>
								<span>Matriz de Peligro</span>
							</NavLink>
						) : (
							<OverlayTrigger placement="right" overlay={renderTooltip("Matriz de Peligro")}>
								<NavLink
									to="/matriz-de-peligro/matriz-peligro"
									className="nav-link text-white d-flex align-items-center"
								>
									<i className="fa-solid fa-table-cells"></i>
								</NavLink>
							</OverlayTrigger>
						)}

						{/* Configuración de Matriz de Peligro Submenu */}
						{isOpen ? (
							<div
								className="nav-link text-white text-custom-color fw-bold d-flex align-items-center"
								onClick={toggleConfiguracionMatrizSubmenu}
							>
								<i className="fa-solid fa-gear"></i>
								<span>Configuración</span>
								<i
									className={`ms-auto ${
										isConfiguracionMatrizOpen
											? "fa-solid fa-chevron-up"
											: "fa-solid fa-chevron-down"
									}`}
								></i>
							</div>
						) : (
							<OverlayTrigger placement="right" overlay={renderTooltip("Configuración de Matriz")}>
								<div
									className="nav-link text-white d-flex align-items-center"
									onClick={toggleConfiguracionMatrizSubmenu}
								>
									<i className="fa-solid fa-gear"></i>
								</div>
							</OverlayTrigger>
						)}

						{/* Submenú dentro de Configuración de Matriz */}
						{isConfiguracionMatrizOpen && (
							<div className="submenu">
								{isOpen ? (
									<NavLink
										to="/matriz-de-peligro/configuracion/tareas"
										className="nav-link text-white d-flex align-items-center"
									>
										<i className="fa-solid fa-bars-progress"></i>
										<span>Tareas</span>
									</NavLink>
								) : (
									<OverlayTrigger placement="right" overlay={renderTooltip("Tareas")}>
										<NavLink
											to="/matriz-de-peligro/configuracion/tareas"
											className="nav-link text-white d-flex align-items-center"
										>
											<i className="fa-solid fa-bars-progress"></i>
										</NavLink>
									</OverlayTrigger>
								)}
								{isOpen ? (
									<NavLink
										to="/matriz-de-peligro/configuracion/tipo-de-tareas"
										className="nav-link text-white d-flex align-items-center"
									>
										<i className="fa-solid fa-list-check"></i>
										<span>Tipo de Tareas</span>
									</NavLink>
								) : (
									<OverlayTrigger placement="right" overlay={renderTooltip("TiposDeTareas")}>
										<NavLink
											to="/matriz-de-peligro/configuracion/tipo-de-tareas"
											className="nav-link text-white d-flex align-items-center"
										>
											<i className="fa-solid fa-list-check"></i>
										</NavLink>
									</OverlayTrigger>
								)}
								{isOpen ? (
									<NavLink
										to="/matriz-de-peligro/configuracion/criticidad-de-peligro" 
										className="nav-link text-white d-flex align-items-center"
									>
										<i className="fa-solid fa-bolt"></i>
										<span>Criticidad</span>
									</NavLink>
								) : (
									<OverlayTrigger placement="right" overlay={renderTooltip("Criticidad")}>
										<NavLink
											to="/matriz-de-peligro/configuracion/criticidad-de-peligro" 
											className="nav-link text-white d-flex align-items-center"
										>
											<i className="fa-solid fa-bolt"></i>
										</NavLink>
									</OverlayTrigger>
								)}
								{isOpen ? (
									<NavLink
										to="/matriz-de-peligro/configuracion/jerarquia-de-control"
										className="nav-link text-white d-flex align-items-center"
									>
										<i className="fa-solid fa-network-wired"></i>
										<span>Jerarquía de Control</span>
									</NavLink>
								) : (
									<OverlayTrigger placement="right" overlay={renderTooltip("Comprobaciones")}>
										<NavLink
											to="/matriz-de-peligro/configuracion/jerarquia-de-control"
											className="nav-link text-white d-flex align-items-center"
										>
											<i className="fa-solid fa-network-wired"></i>
										</NavLink>
									</OverlayTrigger>
								)}
								{isOpen ? (
									<NavLink
										to="/matriz-de-peligro/configuracion/peligro"
										className="nav-link text-white d-flex align-items-center"
									>
										<i className="fa-solid fa-circle-radiation"></i>
										<span>Peligros</span>
									</NavLink>
								) : (
									<OverlayTrigger placement="right" overlay={renderTooltip("Peligro")}>
										<NavLink
											to="/matriz-de-peligro/configuracion/peligro"
											className="nav-link text-white d-flex align-items-center"
										>
											<i className="fa-solid fa-circle-radiation"></i>
										</NavLink>
									</OverlayTrigger>
								)}
								{isOpen ? (
									<NavLink
										to="/matriz-de-peligro/configuracion/riesgos"
										className="nav-link text-white d-flex align-items-center"
									>
										<i className="fa-solid fa-circle-exclamation"></i>
										<span>Riesgos</span>
									</NavLink>
								) : (
									<OverlayTrigger placement="right" overlay={renderTooltip("Riesgos")}>
										<NavLink
											to="/matriz-de-peligro/configuracion/riesgos"
											className="nav-link text-white d-flex align-items-center"
										>
											<i className="fa-solid fa-circle-exclamation"></i>
										</NavLink>
									</OverlayTrigger>
								)}
							</div>
						)}
					</div>
				)}

				{/* Actividades Submenu */}
                {isOpen ? (
                    <div className="nav-link text-white  text-custom-color fw-bold d-flex align-items-center" onClick={toggleActividadesSubmenu}>
                        <i className="fa-solid fa-people-robbery"></i>
                        <span>Tipo de Actividad</span>
                        <i className={`ms-auto ${isActividadesOpen ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'}`}></i>
                    </div>
                ) : (
                    <OverlayTrigger placement="right" overlay={renderTooltip('Tipo de Actividad')}>
                        <div className="nav-link text-white text-custom-color d-flex align-items-center" onClick={toggleActividadesSubmenu}>
                            <i className="fa-solid fa-people-robbery"></i>
                        </div>
                    </OverlayTrigger>
                )}

                {isActividadesOpen && (
                    <div className="submenu">
                        {isOpen ? (
                            <NavLink to="/tipo-de-actividad/tipo-de-actividad" className="nav-link text-white d-flex align-items-center">
                                <i className="fa-solid fa-people-robbery"></i>
                                <span>Tipo de Actividad</span>
                            </NavLink>
                        ) : (
                            <OverlayTrigger placement="right" overlay={renderTooltip('Actividades')}>
                                <NavLink to="/tipo-de-actividad/tipo-de-actividad" className="nav-link text-white d-flex align-items-center">
                                    <i className="fa-solid fa-people-robbery"></i>
                                </NavLink>
                            </OverlayTrigger>
                        )}
                    </div>
                )}
    

				{/* Organización Submenu */}
				{isOpen ? (
					<div className="nav-link text-white text-custom-color fw-bold d-flex align-items-center" onClick={toggleOrgSubmenu}>
						<i className="fa-solid fa-layer-group"></i>
						<span>Organización</span>
						<i
							className={`ms-auto ${
								isOrgOpen ? "fa-solid fa-chevron-up" : "fa-solid fa-chevron-down"
							}`}
						></i>
					</div>
				) : (
					<OverlayTrigger placement="right" overlay={renderTooltip("Organización")}>
						<div
							className="nav-link text-white text-custom-color d-flex align-items-center"
							onClick={toggleOrgSubmenu}
						>
							<i className="fa-solid fa-layer-group"></i>
						</div>
					</OverlayTrigger>
				)}

				{isOrgOpen && (
					<div className="submenu">
						{isOpen ? (
						<NavLink
							to="/organizacion/ciudad"
							className="nav-link text-white d-flex align-items-center"
						>
							<i className="fa-solid fa-tree-city"></i>
							<span>Ciudad</span>
						</NavLink>
						 ) : (
							<OverlayTrigger placement="right" overlay={renderTooltip("Ciudad")}>
								<NavLink
									to="/organizacion/ciudad"
									className="nav-link text-white d-flex align-items-center"
								>
									<i className="fa-solid fa-tree-city"></i>
								</NavLink>
							</OverlayTrigger>
						)}
						{isOpen ? (
						<NavLink
							to="/organizacion/compañias"
							className="nav-link text-white d-flex align-items-center"
						>
							<i className="fa-solid fa-building"></i>
							<span>Compañias</span>
						</NavLink>
						 ) : (
							<OverlayTrigger placement="right" overlay={renderTooltip("Compañias")}>
								<NavLink
									to="/organizacion/compañias"
									className="nav-link text-white d-flex align-items-center"
								>
									<i className="fa-solid fa-building"></i>
								</NavLink>
							</OverlayTrigger>
						)}
						{isOpen ? (
						<NavLink
							to="/organizacion/areas"
							className="nav-link text-white d-flex align-items-center"
						>
							<i className="fa-solid fa-sitemap"></i>
							<span>Áreas</span>
						</NavLink>
						 ) : (
							<OverlayTrigger placement="right" overlay={renderTooltip("Áreas")}>
								<NavLink
									to="/organizacion/areas"
									className="nav-link text-white d-flex align-items-center"
								>
									<i className="fa-solid fa-sitemap"></i>
								</NavLink>
							</OverlayTrigger>
						)}
						{isOpen ? (
						<NavLink
							to="/organizacion/colaboradores"
							className="nav-link text-white d-flex align-items-center"
						>
							<i className="fa-solid fa-id-card-clip"></i>
							<span>Colaboradores</span>
						</NavLink>
						 ) : (
							<OverlayTrigger placement="right" overlay={renderTooltip("Colaboradores")}>
								<NavLink
									to="/organizacion/colaboradores"
									className="nav-link text-white d-flex align-items-center"
								>
									<i className="fa-solid fa-id-card-clip"></i>
								</NavLink>
							</OverlayTrigger>
						)}
						{isOpen ? (
						<NavLink
							to="/organizacion/cargos"
							className="nav-link text-white d-flex align-items-center"
						>
							<i className="fa-solid fa-address-card"></i>
							<span>Cargos</span>
						</NavLink>
						 ) : (
							<OverlayTrigger placement="right" overlay={renderTooltip("Cargos")}>
								<NavLink
									to="/organizacion/cargos"
									className="nav-link text-white d-flex align-items-center"
								>
									<i className="fa-solid fa-address-card"></i>
								</NavLink>
							</OverlayTrigger>
						)}
						{isOpen ? (
						<NavLink
							to="/organizacion/procesos"
							className="nav-link text-white d-flex align-items-center"
						>
							<i className="fa-solid fa-arrows-rotate"></i>
							<span>Procesos</span>
						</NavLink>
						 ) :( 
							<OverlayTrigger placement="right" overlay={renderTooltip("Procesos")}>
								<NavLink
									to="/organizacion/procesos"
									className="nav-link text-white d-flex align-items-center"
								>
									<i className="fa-solid fa-arrows-rotate"></i>
								</NavLink>
							</OverlayTrigger>
						)}
					</div>
				)}
			</Nav>

			<button onClick={toggleSidebar} className="btn-sidebar">
				<OverlayTrigger
					placement="right"
					overlay={isOpen ? renderTooltip("cerrar") : renderTooltip("abrir")}
				>
					<i className={`fa-solid ${isOpen ? "fa-chevron-left" : "fa-chevron-right"}`}></i>
				</OverlayTrigger>
			</button>
		</div>
	);
};

export default Menu;
