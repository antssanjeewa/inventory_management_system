import Swal from "sweetalert2";

export const showError = (message: string) => {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: message,
  });
};

export const showSuccess = (message: string) => {
  Swal.fire({
    icon: "success",
    title: "Success",
    toast: true,
    position: "top-end",
    text: message,
    timer: 1500,
    showConfirmButton: false,
    background: '#171f33',
    color: '#dae2fd',
  });
};

export const confirmAction = async (title: string = "Are you sure?", text: string = "This action cannot be undone.") => {
  const result = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#0ea5e9',
    cancelButtonColor: '#1e293b',
    confirmButtonText: 'Yes, proceed',
    cancelButtonText: 'Cancel',
    background: '#171f33',
    color: '#dae2fd',
  });
  return result.isConfirmed;
};