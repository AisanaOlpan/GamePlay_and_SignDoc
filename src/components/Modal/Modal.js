import React, { useState } from "react";

import classes from "./Modal.module.css";
const Modal = ({ isVisible = false, title, content, footer, onClose }) => {
  const keydownHandler = ({ key }) => {
    switch (key) {
      case "Escape":
        onClose();
        break;
      default:
    }
  };

  React.useEffect(() => {
    document.addEventListener("keydown", keydownHandler);
    return () => document.removeEventListener("keydown", keydownHandler);
  });

  return !isVisible ? null : (
    <div className={classes.modal} onClick={onClose}>
      <div
        className={classes.modal_dialog}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={classes.modal_header}>
          <h3 className={classes.modal_title}>{title}</h3>
          <span className={classes.modal_close} onClick={onClose}>
            &times;
          </span>
        </div>
        <div className={classes.modal_body}>
          <div className={classes.modal_content}>{content}</div>
        </div>
        {footer && <div className={classes.modal_footer}>{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
