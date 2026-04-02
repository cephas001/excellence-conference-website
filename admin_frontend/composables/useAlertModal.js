// composables/useAlertModal.js
import { useState } from "#app";

export const useAlertModal = () => {
  const isOpen = useState("alert_modal_open", () => false);
  const title = useState("alert_modal_title", () => "");
  const message = useState("alert_modal_message", () => "");
  const type = useState("alert_modal_type", () => "error"); // Accepts: 'error', 'success', 'warning', 'info'

  const showAlert = (msg, alertType = "error", customTitle = null) => {
    message.value = msg;
    type.value = alertType;

    // Auto-generate a title if one isn't provided
    if (customTitle) {
      title.value = customTitle;
    } else {
      const titles = {
        error: "An Error Occurred",
        success: "Success!",
        warning: "Warning",
        info: "Notice",
      };
      title.value = titles[alertType] || "Alert";
    }

    isOpen.value = true;
  };

  const closeAlert = () => {
    isOpen.value = false;
  };

  return {
    isOpen,
    title,
    message,
    type,
    showAlert,
    closeAlert,
  };
};
