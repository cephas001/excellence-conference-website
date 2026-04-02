// composables/useErrorModal.js
export const useErrorModal = () => {
  const isOpen = useState("error_modal_open", () => false);
  const errorMessage = useState("error_modal_message", () => "");
  const errorTitle = useState(
    "error_modal_title",
    () => "Action Not Permitted",
  );

  const triggerError = (message, title = "Action Not Permitted") => {
    errorMessage.value = message;
    errorTitle.value = title;
    isOpen.value = true;
  };

  const closeModal = () => {
    isOpen.value = false;
    errorMessage.value = "";
  };

  return {
    isOpen,
    errorMessage,
    errorTitle,
    triggerError,
    closeModal,
  };
};
