import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const EmployeeList = () => {
  const [empdata, setEmpData] = useState([]);

  const loadUsers = () => {
    axios
      .get("http://localhost:4000/employee")
      .then((response) => {
        setEmpData(response.data);
      })
      .catch((err) => console.log(err.message));
  };

  useEffect(() => {
    loadUsers();
  }, []); // Dependency array added

  const deleteUser = (id) => {
    if (window.confirm("Confirm to delete")) {
      axios
        .delete(`http://localhost:4000/employee/${id}`)
        .then(() => {
          alert("Deleted Successfully");
          loadUsers();
        })
        .catch((err) => console.log(err.message));
    }
  };

  return (
    <center className="me-2 ms-2">
      <Link
        to={"/employee/addemployee"}
        className="btn btn-outline-primary mt-4 mb-3"
      >
        Add New Employee
      </Link>
      <div>
        <table border="1" className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>DOB</th>
              <th>Mobile</th>
              <th>Gender</th>
              <th>Country</th>
              <th>State</th>
              <th>City</th>
              <th>Hobbies</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {empdata.length > 0 ? (
              empdata.map((items) => (
                <tr key={items.id}>
                  <td>
                    {items.firstname} {items.lastname}
                  </td>
                  <td>{items.email}</td>
                  <td>{items.dob}</td>
                  <td>{items.mobile}</td>
                  <td>{items.gender}</td>
                  <td>{items.country}</td>
                  <td>{items.state}</td>
                  <td>{items.city}</td>
                  <td>{items.hobbies.join(", ")}</td>
                  <td>{items.address}</td>
                  <td>
                    <Link to={`/employee/editemployee/${items.id}`}>
                      <button className="btn btn-warning m-1 btn-sm">
                        Edit
                      </button>
                    </Link>
                    <button
                      className="btn btn-danger m-1 btn-sm"
                      onClick={() => deleteUser(items.id)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11">No employees found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Link to="/">Go Back Home</Link>
    </center>
  );
};

export default EmployeeList;
