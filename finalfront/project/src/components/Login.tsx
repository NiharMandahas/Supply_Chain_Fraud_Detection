import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from "./LoginForm";

const API_URL = 'http://127.0.0.1:8000/api';

function Login() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string, role: 'buyer' | 'seller') => {
    try {
      const response = await fetch(`${API_URL}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Save user data, seller_id, and buyer_id in localStorage indefinitely
      localStorage.setItem('user', JSON.stringify(data.user));
      
      if (role === 'buyer') {
        localStorage.setItem('buyer_id', JSON.stringify(data.user.buyer_id)); // Save buyer ID
        console.log(localStorage.getItem('buyer_id')); 
      } else {
        localStorage.setItem('seller_id', JSON.stringify(data.user.seller_id)); // Save seller ID
      }

      // Redirect based on role
      navigate(role === 'buyer' ? '/buyer' : '/seller');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div>
      <LoginForm onLogin={handleLogin} />
      {error && <div className="text-red-500 text-center mt-4">{error}</div>}
    </div>
  );
}

export default Login;
