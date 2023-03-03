import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import NoteContext from "../context/notes/NoteContext";

const Login = () => {
  const navigate = useNavigate(null);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const context = useContext(NoteContext);
  const { login } = context;

  const formHandler = async (e) => {
    e.preventDefault();
    login(credentials, navigate);
  };

  const changeHandler = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="container">
      <form onSubmit={formHandler}>
        <h1>Login to Enter MyNotebook</h1>
        <div className="my-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            name="email"
            aria-describedby="emailHelp"
            value={credentials.email}
            onChange={changeHandler}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            name="password"
            id="exampleInputPassword1"
            value={credentials.password}
            onChange={changeHandler}
            minLength="5"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Login;
