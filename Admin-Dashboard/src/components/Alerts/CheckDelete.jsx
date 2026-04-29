import Swal from "sweetalert2";

export const CheckDelete = ({ title }) => {
    return Swal.fire({
        title: `Delete ${title}?`,
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
        background: "#0f172a",
        color: "#f8fafc",
        customClass: {
            popup: 'rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700',
            title: 'text-xl font-black text-slate-800 dark:text-white mb-4',
            htmlContainer: 'dark:text-slate-200 font-medium text-slate-600 dark:text-slate-300',
            confirmButton: 'bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-200 mx-2',
            cancelButton: 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-200 mx-2'
        },
        buttonsStyling: false,
        didOpen: () => {
            // RTL support
if (document.documentElement.dir === 'rtl') {
                Swal.getPopup().style.direction = 'rtl';
                Swal.getPopup().classList.add('text-right');
            }
            
            // Additional dark mode enhancements
            const popup = Swal.getPopup();
            popup.classList.add('dark:bg-slate-800', 'dark:border-slate-700');
            
            const icon = Swal.getIcon();
            if (icon) icon.classList.add('dark:text-yellow-400');
        }
    });
}

