import { toast } from "react-toastify";
import { TOASTS } from "../constants";


 const toastFunction =(type, _msg)=> {
    switch (type) {
        case TOASTS.SUCCESS:
            return toast.success(_msg, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
    
        case TOASTS.ERROR:
            return toast.error(_msg, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

        case TOASTS.WARNING:
            return toast.warn(_msg, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

        case TOASTS.INFO:
            return toast.info(_msg, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

        default:
            break;
    }
   
}

export default toastFunction;