import NoteContext from "./NoteContext";
import { useState } from "react";

const NoteState = (props) => {
  // const host = "http://localhost:5000";
  const host = "https://my-notebook-api.vercel.app";
  const authToken = localStorage.getItem("token");
  const contentType = "application/json";
  const notesInitial = [
    {
      //   _id: "63ec953012ae08c9a8407412",
      //   user: "63ec928b12ae08c9a84073f4",
      //   title: "dumy title",
      //   description: "this is dumy description",
      //   tag: "personal",
      //   date: "2023-02-15T08:17:52.163Z",
      //   __v: 0,
      // },
      // {
      //   _id: "63ec953012a1e08c9a8407412",
      //   user: "63ec928b12ae08c9a84073f4",
      //   title: "dumy title 2",
      //   description: "this is dumy description",
      //   tag: "personal",
      //   date: "2023-02-15T08:17:52.163Z",
      //   __v: 0,
    },
  ];
  const [notes, setNotes] = useState(notesInitial);
  const [alert, setAlert] = useState({
    type: "",
    message: "",
  });
  const [user, setUser] = useState({ id: "", name: "", email: "" });
  const [isLoading, setIsLoading] = useState(false);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert({ type: "", message: "" });
    }, 2000);
  };

  //Fetch all notes form mongo
  const getNotes = async () => {
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",
      headers: {
        "Content-Type": contentType,
        "auth-token": authToken,
      },
    });
    const noteResult = await response.json();
    setNotes(noteResult);
  };

  //ADD note
  const addNote = async (title, description, tag) => {
    setIsLoading(true);
    //---------------------add note in dummy array
    // const note = {
    //   _id: "163f06f088a535d9fc14ed95",
    //   user: "63ec928b12ae08c9a84073f4",
    //   title: title,
    //   description: description,
    //   tag: tag,
    //   date: "2023-02-18T06:24:08.505Z",
    //   __v: 0,
    // };

    // setNotes(notes.concat(note));

    //---------------------add note using api call
    await fetch(`${host}/api/notes/addnote`, {
      method: "POST",
      headers: {
        "Content-Type": contentType,
        "auth-token": authToken,
      },
      body: JSON.stringify({
        title,
        description,
        tag,
      }),
    });
    await getNotes();
    setIsLoading(false);
  };

  //DELETE note
  const deleteNote = async (id) => {
    setIsLoading(true);
    //---------------------delete note in dummy array
    // setNotes(
    //   notes.filter((note) => {
    //     return note._id !== id;
    //   })
    // );

    //---------------------delete note using api call
    await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": contentType,
        "auth-token": authToken,
      },
    });
    showAlert("success", "Note Deleted Successfully.");
    await getNotes();
    setIsLoading(false);
  };

  //UPDATE note
  const updateNote = async (id, title, description, tag) => {
    setIsLoading(true);
    // ---------------------update note using api call
    await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": contentType,
        "auth-token": authToken,
      },
      body: JSON.stringify({
        title,
        description,
        tag,
      }),
    });
    showAlert("success", "Note Updated Successfully.");
    await getNotes();
    setIsLoading(false);
  };

  //fetching user data
  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${host}/api/auth/fetchuser`, {
      method: "POST",
      headers: {
        "Content-Type": contentType,
        "auth-token": token,
      },
    });
    const json = await response.json();
    setUser({ id: json._id, name: json.name, email: json.email });
  };

  const changePassword = async (password) => {
    setIsLoading(true);
    // ---------------------change password using api call
    const response = await fetch(`${host}/api/auth/changepassword`, {
      method: "PUT",
      headers: {
        "Content-Type": contentType,
        "auth-token": authToken,
      },
      body: JSON.stringify({
        existing: password.existing,
        new: password.new,
        confirm: password.confirm,
      }),
    });
    const json = await response.json();
    json.success
      ? showAlert("success", "Password change successfully.")
      : showAlert("danger", json.error);
    setIsLoading(false);
  };

  const login = async (credentials, navigate) => {
    setIsLoading(true);
    const response = await fetch(`${host}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": contentType,
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });
    const json = await response.json();
    if (json.success) {
      localStorage.setItem("token", json.authToken);
      navigate("/");
      showAlert("success", "Logged in Successfully.");
    } else {
      showAlert("danger", "Enter valid Credentials.");
    }
    setIsLoading(false);
  };

  const signup = async (credentials, navigate) => {
    setIsLoading(true);
    if (credentials.password === credentials.cPassword) {
      const response = await fetch(`${host}/api/auth/createuser`, {
        method: "POST",
        headers: {
          "Content-Type": contentType,
        },
        body: JSON.stringify({
          name: credentials.name,
          email: credentials.email,
          password: credentials.password,
        }),
      });
      const json = await response.json();
      if (json.success) {
        showAlert("success", "Account Created Successfully.");
        navigate("/login");
      } else {
        showAlert("danger", "Enter correct credentials.");
      }
    } else {
      showAlert("danger", "Enter correct credentials.");
      console.log(credentials);
    }
    setIsLoading(false);
  };

  return (
    <NoteContext.Provider
      value={{
        notes,
        addNote,
        deleteNote,
        updateNote,
        getNotes,
        alert,
        showAlert,
        user,
        fetchUser,
        changePassword,
        login,
        signup,
        isLoading,
      }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
