import Swal, { SweetAlertIcon } from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export function showAlert(message: string, icon: SweetAlertIcon, focusElementId: string) {
    setFocus(focusElementId);
    MySwal.fire({
        title: message,
        icon: icon,
        confirmButtonText: 'Aceptar',
        focusConfirm: focusElementId !== '',
    });
}

function setFocus(elementId: string) {
    if (elementId !== '') {
        document.getElementById(elementId)?.focus();
    }
}
