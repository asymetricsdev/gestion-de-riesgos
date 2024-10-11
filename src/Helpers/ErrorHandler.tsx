import axios from "axios";
import { showAlert } from "../components/functions";

export const handleError = (error: any) => {
    if (axios.isAxiosError(error)) {
    var err = error.response;
    if(Array.isArray(err?.data.errors)) { 
      for (let val of err.data.errors) {

        showAlert(val.descripcion, "error");
        }
    } else if (typeof err?.data.errors === "object") {
      for (let e in err?.data.errors) {
        showAlert(err.data.errors[e][0], "error");
        }
    } else if (err?.data) {
        showAlert(err.data, "error");
    } else if (err?.status === 401) {
        showAlert("Please log in again", "error");
        window.history.pushState({}, "Login", "/login");    
    } else if (err) {
        showAlert(err?.data, "error");
    }
  } 
};