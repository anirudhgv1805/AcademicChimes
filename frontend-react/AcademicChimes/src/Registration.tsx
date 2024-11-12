import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Registration() {
  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    registerNo: "",
    dept: "",
    staffId: "",
    designation: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(formData.password === formData.confirmPassword){
      try {
        console.log(JSON.stringify({ ...formData, role }));
        const response = await fetch("http://localhost:8080/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, role }),
        });
        if (response.ok) {
          alert("Registration successful!");
          navigate("/login");
        } else {
          const errorData = await response.text();
          alert(`Registration failed: ${errorData}`);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred during registration.");
      }
    } else {
      alert("Password and confirm password do not match");
    }
  };

  return (
    <div className="mx-auto flex bg-gray-100">
      <form onSubmit={handleSubmit} className="p-6 bg-white shadow-md rounded-lg flex flex-col gap-10 mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">AcademicChimes</h1>
        <h2 className="text-2xl mb-4 text-center">Register as {role === "student" ? "Student" : "Staff"}</h2>

        <div className="flex flex-row justify-center gap-10">
          <label>
            <input
              type="radio"
              name="role"
              value="student"
              checked={role === "student"}
              onChange={() => setRole("student")}
            />
            Student
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="staff"
              checked={role === "staff"}
              onChange={() => setRole("staff")}
            />
            Staff
          </label>
        </div>

        <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="input" required />
        <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="input" required />
        <input name="password" value={formData.password} onChange={handleChange} placeholder="Password" type="password" className="input" required />
        <input name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" type="password" className="input" required />

        {role === "student" ? (
          <>
            <input name="registerNo" value={formData.registerNo} onChange={handleChange} placeholder="Register Number" className="input" required />
            <select name="dept" value={formData.dept} onChange={handleChange} className="input" required>
              <option value="">Select Department</option>
              <option value="computer science">Computer Science</option>
              <option value="information technology">Information Technology</option>
              <option value="artificial intelligence and data science">Artificial Intelligence and Data Science</option>
              <option value="artificial intelligence and machine learning">Artificial Intelligence and Machine Learning</option>
              <option value="automobile">Automobile</option>
              <option value="mechanical">Mechanical</option>
              <option value="mechatronics">Mechatronics</option>
              <option value="eee">EEE</option>
              <option value="ece">ECE</option>
              <option value="csd">CSD</option>
            </select>
          </>
        ) : (
          <>
            <input name="staffId" value={formData.staffId} onChange={handleChange} placeholder="Staff ID" className="input" required />
            <select name="dept" value={formData.dept} onChange={handleChange} className="input" required>
              <option value="">Select Department</option>
              <option value="computer science">Computer Science</option>
              <option value="information technology">Information Technology</option>
              <option value="artificial intelligence and data science">Artificial Intelligence and Data Science</option>
              <option value="artificial intelligence and machine learning">Artificial Intelligence and Machine Learning</option>
              <option value="automobile">Automobile</option>
              <option value="mechanical">Mechanical</option>
              <option value="mechatronics">Mechatronics</option>
              <option value="eee">EEE</option>
              <option value="ece">ECE</option>
              <option value="csd">CSD</option>
            </select>
            <select name="designation" value={formData.designation} onChange={handleChange} className="input" required>
              <option value="">Select Designation</option>
              <option value="hod">HOD</option>
              <option value="assistant professor">Assistant Professor</option>
              <option value="associate professor">Associate Professor</option>
            </select>
          </>
        )}

        <button type="submit" className="btn-primary bg-black text-white hover:bg-gray-700">Register</button>
      </form>
    </div>
  );
}

export default Registration;