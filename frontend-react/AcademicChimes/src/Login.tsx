/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [credentials, setCredentials] = useState({
    id: '',
    password: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        console.log(data.token);
        navigate('/dashboard');
      } else {
        setError('Invalid credentials');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="p-6 bg-white shadow-md rounded-lg flex flex-col gap-4 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">AcademicChimes Login</h1>

        <div className="flex justify-center gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="role"
              value="student"
              checked={credentials.role === 'student'}
              onChange={handleChange}
              className="mr-2"
            />
            Student
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="role"
              value="staff"
              checked={credentials.role === 'staff'}
              onChange={handleChange}
              className="mr-2"
            />
            Staff
          </label>
        </div>

        <input
          name="id"
          value={credentials.id}
          onChange={handleChange}
          placeholder={credentials.role === 'student' ? 'Register Number' : 'Staff ID'}
          className="p-2 border rounded"
          required
        />
        <input
          name="password"
          type="password"
          value={credentials.password}
          onChange={handleChange}
          placeholder="Password"
          className="p-2 border rounded"
          required
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button type="submit" className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Login
        </button>
      </form>
    </div>
  );
}