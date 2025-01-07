import React, { useContext, useEffect, useRef, useState } from "react";
import NoteContext from "../context/notes/NoteContext";
import profile from "../static/profile.jpg";

const Profile = () => {
  const context = useContext(NoteContext);
  const { user, fetchUser, changePassword, isLoading } = context;
  const ref = useRef(null);
  const ref_change = useRef(null);

  const [password, setPassword] = useState({
    existing: "",
    new: "",
    confirm: "",
  });

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line
  }, []);

  const showModal = () => {
    ref.current.click();
  };

  const handlerChangePassword = (e) => {
    e.preventDefault();
    changePassword(password);
    setPassword({ existing: "", new: "", confirm: "" });
    ref_change.current.click();
  };

  const handlerInput = (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };

  return (
    <div className="container">
      <button
        type="button"
        className="btn btn-primary d-none"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
        ref={ref}
      >
        Launch demo modal
      </button>

      <form onSubmit={handlerChangePassword}>
        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Change Password
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Enter existing password
                  </label>
                  <input
                    value={password.existing}
                    onChange={handlerInput}
                    type="password"
                    className="form-control"
                    id="password"
                    name="existing"
                    minLength={5}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="newpassword" className="form-label">
                    Enter new Password
                  </label>
                  <input
                    value={password.new}
                    onChange={handlerInput}
                    type="password"
                    className="form-control"
                    id="newpassword"
                    name="new"
                    minLength={5}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="cnewpassword" className="form-label">
                    Confirm new Password
                  </label>
                  <input
                    value={password.confirm}
                    onChange={handlerInput}
                    type="password"
                    className="form-control"
                    id="cnewpassword"
                    name="confirm"
                    minLength={5}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  ref={ref_change}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  Change
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
      <div className="text-center">
        <img
          src={profile}
          height="200px"
          width="200px"
          className="rounded"
          alt="profile"
        />
        <table className="table">
          <tbody>
            <tr>
              <th>id</th>
              <td>{user.id}</td>
            </tr>
            <tr>
              <th>Name</th>
              <td>{user.name}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{user.email}</td>
            </tr>
            <tr>
              <th>Password</th>
              <td>
                <button className="btn btn-primary" onClick={showModal}>
                  Change Password
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Profile;
