import React, { useState, useCallback } from 'react';
import { UserPlus } from 'lucide-react';
import { loadSlim } from "tsparticles-slim";
import Particles from "react-tsparticles";
import type { Container, Engine } from "tsparticles-engine";

interface RegisterFormProps {
  onRegister: (email: string, Name: string, password: string, role: 'buyer' | 'seller', user_id: string) => Promise<void>;
}

export function RegisterForm({ onRegister }: RegisterFormProps) {
  const [email, setEmail] = useState('');
  const [Name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [user_id, setuser_id] = useState(''); // Buyer ID / Seller ID
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onRegister(email, Name, password, role, user_id);
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
          background: { color: { value: "#0f172a" } },
          fpsLimit: 120,
          interactivity: {
            events: { onHover: { enable: true, mode: "repulse" } },
            modes: { repulse: { distance: 100, duration: 0.4 } },
          },
          particles: {
            color: { value: "#ffffff" },
            links: { color: "#ffffff", distance: 150, enable: true, opacity: 0.3, width: 1 },
            move: { direction: "none", enable: true, outModes: { default: "bounce" }, random: false, speed: 2, straight: false },
            number: { density: { enable: true, area: 800 }, value: 80 },
            opacity: { value: 0.3 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 3 } },
          },
          detectRetina: true,
        }}
      />

      <div className="relative bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="bg-indigo-100/20 p-3 rounded-full mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white">Create an Account</h2>
          <p className="text-gray-300 mt-2">Sign up to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
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

          {/* Full Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 text-center">Full Name</label>
            <input
              type="text"
              value={Name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-600 focus:ring-2 focus:ring-indigo-500 bg-gray-800/50 text-white transition-colors duration-200"
              required
              disabled={isLoading}
            />
          </div>

          {/* Password Input */}
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

          {/* Role Selection */}
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

          {/* ID Input (Buyer ID or Seller ID) */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 text-center">
              {role === 'buyer' ? 'Buyer ID' : 'Seller ID'}
            </label>
            <input
              type="text"
              value={user_id}
              onChange={(e) => setuser_id(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-600 focus:ring-2 focus:ring-indigo-500 bg-gray-800/50 text-white transition-colors duration-200"
              required
              disabled={isLoading}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
}
