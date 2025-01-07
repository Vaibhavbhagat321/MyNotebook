import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import NoteContext from "../context/notes/NoteContext";

const Signup = () => {
  const navigate = useNavigate(null);
  const context = useContext(NoteContext);
  const { signup, isLoading } = context;

  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    cPassword: "",
  });

  const formHandler = async (e) => {
    e.preventDefault();
    signup(credentials, navigate);
  };

  const changeHandler = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="container">
      <form onSubmit={formHandler}>
        <h1>Create Account to Start MyNotebook</h1>
        <div className="my-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="name"
            className="form-control"
            id="exampleInputName1"
            name="name"
            aria-describedby="emailHelp"
            value={credentials.name}
            onChange={changeHandler}
            minLength="2"
            required
          />
        </div>
        <div className="mb-3">
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
        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            className="form-control"
            name="cPassword"
            id="exampleInputPassword2"
            value={credentials.cPassword}
            onChange={changeHandler}
            minLength="5"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          Sign up
        </button>
      </form>
    </div>
  );
};

export default Signup;
