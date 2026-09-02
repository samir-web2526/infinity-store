import Swal from "sweetalert2";

// Create SweetAlert2 custom toast mixin
const SweetToast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3500,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
  customClass: {
    popup: "swal2-toast-custom",
  },
});

const toast = (message, options = {}) => {
  const title = typeof message === "string" ? message : message?.title || "";
  return SweetToast.fire({
    title,
    icon: options.icon || undefined,
    ...options,
  });
};

toast.success = (message, options = {}) => {
  return SweetToast.fire({
    icon: "success",
    title: message,
    ...options,
  });
};

toast.error = (message, options = {}) => {
  return SweetToast.fire({
    icon: "error",
    title: message,
    ...options,
  });
};

toast.warning = (message, options = {}) => {
  return SweetToast.fire({
    icon: "warning",
    title: message,
    ...options,
  });
};

toast.info = (message, options = {}) => {
  return SweetToast.fire({
    icon: "info",
    title: message,
    ...options,
  });
};

toast.dismiss = () => {
  Swal.close();
};

export { SweetToast };
export default toast;
