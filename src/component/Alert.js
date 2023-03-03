import React, { useContext } from "react";
import NoteContext from "../context/notes/NoteContext";

const Alert = () => {
  const context = useContext(NoteContext);
  const { alert } = context;

  return (
    <div
      style={{
        height: "60px",
      }}
    >
      {alert.message && (
        <div
          className={`alert alert-${alert.type}`}
          style={{
            height: "60px",
          }}
          role="alert"
        >
          <span className="align-middle">{alert.message}</span>
        </div>
      )}
    </div>
  );
};

export default Alert;
