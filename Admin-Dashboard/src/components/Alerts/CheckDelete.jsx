import Swal from "sweetalert2";

export const CheckDelete = ({ title }) => {
    return Swal.fire({
        title: `Delete ${title}?`,
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        background: "#0f172a",
        color: "#fff"
    });
}
