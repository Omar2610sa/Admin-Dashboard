import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from '@mui/icons-material/Close';
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

const Dialogs = ({ title }) => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <Button onClick={handleClickOpen}>
                <RemoveRedEyeIcon className="text-slate-900 dark:text-slate-300" />
            </Button>

            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    className: `
            bg-white dark:bg-slate-800 py-20`,
                }}
                BackdropProps={{
                    className: "bg-black/50",
                }}
            >
                {/* Header */}
                <DialogTitle
                    className="
            flex items-center justify-between
            text-2xl font-black
            bg-white dark:bg-slate-900
            text-slate-800 dark:text-white "
                >
                    Description
                    <button
                        onClick={handleClose}
                        className="text-slate-900 hover:text-slate-600 hover:text-slate-400 cursor-pointer dark:hover:text-slate-200 text-xl duration-300"
                    >
                        <CloseIcon />
                    </button>
                </DialogTitle>

                {/* Content */}
                <DialogContent
                    className=" !py-12 dark:bg-slate-800 bg-slate-100/80  text-slate-900 dark:text-slate-300"
                >
                    {title}
                </DialogContent>


            </Dialog>
        </>
    );
};

export default Dialogs;



