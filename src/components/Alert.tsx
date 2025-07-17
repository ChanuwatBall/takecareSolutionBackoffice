import React, { useEffect, useRef } from "react";

type ButtonType = {
  text: string;
  role?: "cancel" | "confirm";
  handler?: () => void;
};

type AlertProps = {
  title: string;
  message: string;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  buttons: ButtonType[];
};

const Alert: React.FC<AlertProps> = ({ title, message, isOpen, setOpen, buttons }) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  const handleClose = () => setOpen(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        handleClose();
      } else if (e.key === "Enter") {
        const firstNonCancel = buttons.find((btn) => btn.role !== "cancel");
        if (firstNonCancel) {
          firstNonCancel.handler?.();
          handleClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, buttons]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === dialogRef.current) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div ref={dialogRef} style={backdropStyle} onClick={handleBackdropClick}>
      <div style={cardStyle}>
        <h3 style={titleStyle}>{title}</h3>
        <div style={{width:"100%",height:"1px",borderTop:"1px solid #ddd"}} ></div>
        <p style={messageStyle}>{message}</p>
        <div style={buttonGroupStyle}>
          {buttons.map((btn, index) => (
            <button
              key={index}
              onClick={() => {
                handleClose();
                btn.handler?.();
              }}
              style={{
                ...buttonStyle,
                background: btn.role === "cancel" ? "#eee" : "#0062FF",
                color: btn.role === "cancel" ? "#333" : "#fff",
              }}
            >
              {btn.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Alert;



const backdropStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999,
  animation: "fadeIn 0.2s ease-in-out",
};

const cardStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: "16px",
  padding: ".5rem",
  paddingBottom: "1rem",
  width: "90%",
  maxWidth: "350px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  textAlign: "center",
  transform: "scale(1)",
  animation: "scaleIn 0.2s ease-in-out",
};

const titleStyle: React.CSSProperties = {
  fontSize: "1.2rem",
  fontWeight: 600,
  marginBottom: "0.75rem",
};

const messageStyle: React.CSSProperties = {
  fontSize: "1rem",
  marginBottom: "1.5rem",
  color: "#444",
};

const buttonGroupStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  gap: "1rem",
  flexWrap: "wrap",
};

const buttonStyle: React.CSSProperties = {
  padding: "0.5rem 1.5rem",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  fontSize: "1rem",
};
