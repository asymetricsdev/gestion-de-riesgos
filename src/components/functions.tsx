import Swal, { SweetAlertIcon } from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export function showAlert(message: string, icon: SweetAlertIcon, focusElementId: string | null = null): void {
    MySwal.fire({
        title: message,
        icon: icon,
        confirmButtonText: 'Aceptar',
        willClose: () => {
            if (focusElementId) {
                setFocus(focusElementId);
            }
        }
    });
}

function setFocus(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
        element.focus();
    }
}

//CAPITALIZAR COLUMNA DESCRIPCIÓN
export function capitalizeFirstLetter (str: string) {
    if (!str) return str;
  
    return str
      .toLowerCase()
      .split('. ')
      .map(sentence => sentence.charAt(0).toUpperCase() + sentence.slice(1))
      .join('. ');
};

