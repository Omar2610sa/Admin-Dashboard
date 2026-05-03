import Swal from "sweetalert2";

const toast = Swal.mixin({
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: "#0f172a", color: "#fff",
});

export const SuccessAlert = (text = "Success") => {
    return toast.fire({
        icon: "success",
        title: text,
    });
};