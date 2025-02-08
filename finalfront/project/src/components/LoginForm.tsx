import React, { useState, useCallback } from 'react';
import { LogIn } from 'lucide-react';
import { loadSlim } from "tsparticles-slim";
import Particles from "react-tsparticles";
import type { Container, Engine } from "tsparticles-engine";
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing

interface LoginFormProps {
  onLogin: (email: string, password: string, role: 'buyer' | 'seller') => Promise<void>;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onLogin(email, password, role);
    } finally {
      setIsLoading(false);
    }
  };

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    await console.log(container);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        className="absolute inset-0"
        options={{
          background: {
            color: {
              value: "#0f172a",
            },
          },
          fpsLimit: 120,
          interactivity: {
            events: {
              onHover: {
                enable: true,
                mode: "repulse",
              },
            },
            modes: {
              repulse: {
                distance: 100,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: "#ffffff",
            },
            links: {
              color: "#ffffff",
              distance: 150,
              enable: true,
              opacity: 0.3,
              width: 1,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 2,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 80,
            },
            opacity: {
              value: 0.3,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 3 },
            },
          },
          detectRetina: true,
        }}
      />

      <div className="relative bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="bg-indigo-100/20 p-3 rounded-full mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
          <p className="text-gray-300 mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 text-center">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-600 focus:ring-2 focus:ring-indigo-500 bg-gray-800/50 text-white transition-colors duration-200"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 text-center">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-600 focus:ring-2 focus:ring-indigo-500 bg-gray-800/50 text-white transition-colors duration-200"
              required
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col items-center">
            <label className="block text-sm font-medium text-gray-300 mb-1">I am a</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'buyer' | 'seller')}
              className="w-48 px-4 py-2 rounded-lg border border-gray-600 focus:ring-2 focus:ring-indigo-500 bg-gray-800/50 text-white transition-colors duration-200 text-center"
              disabled={isLoading}
            >
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Sign Up Button */}
        <div className="text-center mt-4">
          <button
            onClick={() => navigate('/register')}
            className="py-2 px-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
