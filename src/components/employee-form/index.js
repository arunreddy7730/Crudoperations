import axios from "axios";
import React, { useEffect, useState } from "react";
import { Form, Formik, Field, ErrorMessage } from "formik";
import { useParams, useNavigate } from "react-router-dom";
import * as Yup from "yup"; // Import Yup for validation
import "./add-employee.css";

const countryList = [
  {
    name: "India",
    states: [
      {
        name: "Andhra Pradesh",
        cities: ["Tirupati", "Visakapatnam", "Kurnool", "Kadapa"],
      },
      {
        name: "Telangana",
        cities: ["Hyderabad", "Karimnagar", "Adilabad", "Nalgonda"],
      },
    ],
  },
  {
    name: "Russia",
    states: [
      {
        name: "Adygea",
        cities: ["Maykop", "Shaumyan", "Rodnikovyi"],
      },
      {
        name: "Altai",
        cities: ["Aleysk", "Barnaul", "Kulunda"],
      },
    ],
  },
  {
    name: "Germany",
    states: [
      {
        name: "Berlin",
        cities: ["Nordend", "Hamburg", "Munich"],
      },
      {
        name: "Bavaria",
        cities: ["Nuremberg", "Augsburg", "Landshut"],
      },
    ],
  },
];

const hobbies = ["Music", "TV", "Playing Shuttle", "Reading Books"];

const Step1Schema = Yup.object().shape({
  firstname: Yup.string().required("Please enter first name"),
  lastname: Yup.string().required("Please enter last name"),
  email: Yup.string().email("Invalid email").required("Please enter email"),
  mobile: Yup.string().required("Please enter mobile"),
});

const Step2Schema = Yup.object().shape({
  dob: Yup.date().required("Please select date of birth"),
  gender: Yup.string().required("Please select gender"),
  country: Yup.string().required("Please select country"),
  state: Yup.string().required("Please select state"),
  city: Yup.string().required("Please select city"),
  address: Yup.string().required("Please enter address"),
  hobbies: Yup.array().min(1, "Select at least one hobby"),
  agree: Yup.boolean().oneOf([true], "You must agree to the terms"),
});

const EmployeeForm = () => {
  const [step, setStep] = useState(1);
  const { employeeId } = useParams();
  const navigate = useNavigate();

  const initialUser = {
    firstname: "",
    lastname: "",
    email: "",
    mobile: "",
    dob: "",
    gender: "",
    country: "",
    state: "",
    city: "",
    address: "",
    hobbies: [],
    agree: false,
  };

  const [countries] = useState([...countryList]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [initialValues, setIntialValues] = useState(initialUser);

  useEffect(() => {
    if (employeeId) {
      axios
        .get(`http://localhost:4000/employee/${employeeId}`)
        .then((response) => {
          setIntialValues(response.data);
          changeCountry(response.data.country);
          changeState(response.data.state, response.data.country);
        })
        .catch((err) => alert(err.message));
    }
  }, [employeeId]);

  const changeCountry = (countryName) => {
    let countriesCopy = countryList.find((val) => val.name === countryName);
    if (countriesCopy && countriesCopy.states) {
      setStates(countriesCopy.states);
    }
  };

  const changeState = (stateName, countryName) => {
    let countriesCopy = countryList.find((val) => val.name === countryName);
    if (countriesCopy && countriesCopy.states) {
      let statesCopy = countriesCopy.states.find((val) => val.name === stateName);
      if (statesCopy) {
        setCities(statesCopy.cities);
      }
    }
  };

  const changeHobbie = (formik, e) => {
    const { checked, name } = e.target;
    if (checked) {
      formik.setFieldValue("hobbies", [...formik.values.hobbies, name]);
    } else {
      formik.setFieldValue(
        "hobbies",
        formik.values.hobbies.filter((v) => v !== name)
      );
    }
  };

  const handleSubmit = (values) => {
    if (employeeId) {
      axios
        .put(`http://localhost:4000/employee/${employeeId}`, values)
        .then(() => alert(`Employee updated successfully`))
        .then(() => navigate("/employeeslist"))
        .catch((err) => alert(err.message));
    } else {
      axios
        .post("http://localhost:4000/employee", values)
        .then(() => alert(`Employee added successfully`))
        .then(() => navigate("/employeeslist"))
        .catch((err) => alert(err.message));
    }
  };

  return (
    <div className="add-employee">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title text-center p-2">
            {step === 1 ? "Step 1: Personal Details" : "Step 2: Address & Hobbies"}
          </h5>
          <Formik
            initialValues={initialValues}
            validationSchema={step === 1 ? Step1Schema : Step2Schema}
            onSubmit={(values, { setSubmitting }) => {
              if (step === 2) {
                handleSubmit(values);
              } else {
                setStep(2);
                setSubmitting(false);
              }
            }}
          >
            {({ values, handleChange, handleBlur, setFieldValue, errors, touched }) => (
              <Form>
                {step === 1 && (
                  <>
                    <div className="mb-3 row">
                      <label htmlFor="firstname" className="col-4 col-form-label">First Name</label>
                      <div className="col-8">
                        <Field
                          type="text"
                          name="firstname"
                          id="firstname"
                          className={`form-control ${errors.firstname && touched.firstname ? "input-error" : ""}`}
                        />
                        <ErrorMessage name="firstname" component="div" className="invalid-feedback" />
                      </div>
                    </div>
                    <div className="mb-3 row">
                      <label htmlFor="lastname" className="col-4 col-form-label">Last Name</label>
                      <div className="col-8">
                        <Field
                          type="text"
                          name="lastname"
                          id="lastname"
                          className={`form-control ${errors.lastname && touched.lastname ? "input-error" : ""}`}
                        />
                        <ErrorMessage name="lastname" component="div" className="invalid-feedback" />
                      </div>
                    </div>
                    <div className="mb-3 row">
                      <label htmlFor="email" className="col-4 col-form-label">Email</label>
                      <div className="col-8">
                        <Field
                          type="email"
                          name="email"
                          id="email"
                          className={`form-control ${errors.email && touched.email ? "input-error" : ""}`}
                        />
                        <ErrorMessage name="email" component="div" className="invalid-feedback" />
                      </div>
                    </div>
                    <div className="mb-3 row">
                      <label htmlFor="mobile" className="col-4 col-form-label">Mobile</label>
                      <div className="col-8">
                        <Field
                          type="text"
                          name="mobile"
                          id="mobile"
                          className={`form-control ${errors.mobile && touched.mobile ? "input-error" : ""}`}
                        />
                        <ErrorMessage name="mobile" component="div" className="invalid-feedback" />
                      </div>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="mb-3 row">
                      <label htmlFor="dob" className="col-4 col-form-label">Date of Birth</label>
                      <div className="col-8">
                        <Field
                          type="date"
                          name="dob"
                          id="dob"
                          className={`form-control ${errors.dob && touched.dob ? "input-error" : ""}`}
                        />
                        <ErrorMessage name="dob" component="div" className="invalid-feedback" />
                      </div>
                    </div>
                    <div className="mb-3 row">
                      <label htmlFor="gender" className="col-4 col-form-label">Gender</label>
                      <div className="col-8">
                        <div className="form-check">
                          <Field type="radio" name="gender" value="Male" id="male" className="form-check-input" />
                          <label htmlFor="male" className="form-check-label">Male</label>
                        </div>
                        <div className="form-check">
                          <Field type="radio" name="gender" value="Female" id="female" className="form-check-input" />
                          <label htmlFor="female" className="form-check-label">Female</label>
                        </div>
                        <ErrorMessage name="gender" component="div" className="invalid-feedback" />
                      </div>
                    </div>
                    <div className="mb-3 row">
                      <label htmlFor="country" className="col-4 col-form-label">Country</label>
                      <div className="col-8">
                        <Field
                          as="select"
                          name="country"
                          id="country"
                          className={`form-control ${errors.country && touched.country ? "input-error" : ""}`}
                          onChange={(e) => {
                            handleChange(e);
                            changeCountry(e.target.value);
                            setFieldValue("state", "");
                            setFieldValue("city", "");
                          }}
                        >
                          <option value="">Select Country</option>
                          {countries.map((country) => (
                            <option key={country.name} value={country.name}>
                              {country.name}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage name="country" component="div" className="invalid-feedback" />
                      </div>
                    </div>
                    <div className="mb-3 row">
                      <label htmlFor="state" className="col-4 col-form-label">State</label>
                      <div className="col-8">
                        <Field
                          as="select"
                          name="state"
                          id="state"
                          className={`form-control ${errors.state && touched.state ? "input-error" : ""}`}
                          onChange={(e) => {
                            handleChange(e);
                            changeState(e.target.value, values.country);
                            setFieldValue("city", "");
                          }}
                        >
                          <option value="">Select State</option>
                          {states.map((state) => (
                            <option key={state.name} value={state.name}>
                              {state.name}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage name="state" component="div" className="invalid-feedback" />
                      </div>
                    </div>
                    <div className="mb-3 row">
                      <label htmlFor="city" className="col-4 col-form-label">City</label>
                      <div className="col-8">
                        <Field
                          as="select"
                          name="city"
                          id="city"
                          className={`form-control ${errors.city && touched.city ? "input-error" : ""}`}
                        >
                          <option value="">Select City</option>
                          {cities.map((city) => (
                            <option key={city} value={city}>
                              {city}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage name="city" component="div" className="invalid-feedback" />
                      </div>
                    </div>
                    <div className="mb-3 row">
                      <label htmlFor="address" className="col-4 col-form-label">Address</label>
                      <div className="col-8">
                        <Field
                          as="textarea"
                          name="address"
                          id="address"
                          className={`form-control ${errors.address && touched.address ? "input-error" : ""}`}
                        />
                        <ErrorMessage name="address" component="div" className="invalid-feedback" />
                      </div>
                    </div>
                    <div className="mb-3 row">
                      <label htmlFor="hobbies" className="col-4 col-form-label">Hobbies</label>
                      <div className="col-8">
                        {hobbies.map((hobbie) => (
                          <div key={hobbie} className="form-check">
                            <Field
                              type="checkbox"
                              name="hobbies"
                              value={hobbie}
                              id={`hobbie-${hobbie}`}
                              className="form-check-input"
                            />
                            <label htmlFor={`hobbie-${hobbie}`} className="form-check-label">
                              {hobbie}
                            </label>
                          </div>
                        ))}
                        <ErrorMessage name="hobbies" component="div" className="invalid-feedback" />
                      </div>
                    </div>
                    <div className="mb-3 row">
                      <div className="col-8 offset-4">
                        <div className="form-check">
                          <Field type="checkbox" name="agree" id="agree" className="form-check-input" />
                          <label htmlFor="agree" className="form-check-label">
                            I agree to the terms
                          </label>
                        </div>
                        <ErrorMessage name="agree" component="div" className="invalid-feedback" />
                      </div>
                    </div>
                  </>
                )}

                <div className="form-group">
                  <button
                    type="button"
                    className="btn btn-secondary m-4"
                    onClick={() => setStep(step - 1)}
                    disabled={step === 1}
                  >
                    Previous
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {step === 1 ? "Next" : "Submit"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default EmployeeForm;
