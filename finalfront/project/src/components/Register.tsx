import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterForm } from './RegisterForm';

const API_URL = 'http://127.0.0.1:8000/api'; // Ensure API path matches Django

function Register() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (email: string, name: string, password: string, role: 'buyer' | 'seller', user_id: string) => {
    try {
      const response = await fetch(`${API_URL}/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name: name,
          password,
          role,
          user_id, // Send Buyer ID or Seller ID
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      alert('Registration successful! Please log in.');
      navigate('/login'); // Redirect to login
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div>
      <RegisterForm onRegister={handleRegister} />
      {error && <div className="text-red-500 text-center mt-4">{error}</div>}
    </div>
  );
}

export default Register;
