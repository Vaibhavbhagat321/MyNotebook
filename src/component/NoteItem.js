import React, { useContext } from "react";
import NoteContext from "../context/notes/NoteContext";

const NoteItem = (props) => {
  const context = useContext(NoteContext);
  const { deleteNote } = context;
  const { note, updateNote } = props;
  const style = {
    justifyContent: "space-between",
  };

  return (
    <div className="col-md-3">
      <div className="card my-3" key={note.id}>
        <div className="card-body">
          <div className="d-flex" style={style}>
            <div>
              <h5 className="card-title">{note.title}</h5>
            </div>
            <div>
              <i
                className="fa-regular fa-trash-can mx-2"
                onClick={() => {
                  deleteNote(note._id);
                }}
              ></i>
              <i
                className="fa-regular fa-pen-to-square mx-2"
                onClick={updateNote}
              ></i>
            </div>
          </div>
          <p className="card-text">{note.description}</p>
          <p className="card-text">
            <small className="text-muted">{note.tag}</small>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoteItem;
