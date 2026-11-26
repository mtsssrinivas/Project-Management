import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

export function Login() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [email, setEmail] = useState('jane.cooper@projectflow.dev');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      addToast({
        type: 'success',
        title: 'Welcome Back',
        message: 'Successfully signed in to ProjectFlow.',
      });
      navigate('/dashboard');
    }, 600);
  };

  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 bg-canvas">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-charcoal-900 text-white font-mono font-bold text-sm shadow-subtle mb-3">
          PF
        </div>
        <h2 className="text-xl font-bold tracking-tight text-charcoal-950">
          Sign in to ProjectFlow
        </h2>
        <p className="mt-1 text-xs text-charcoal-500">
          Precision project and task management for engineering teams.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-lg border border-border-subtle bg-surface px-6 py-8 shadow-subtle sm:px-10">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              label="Work Email"
              type="email"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full"
                isLoading={isLoading}
              >
                Sign In
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-xs text-charcoal-500 border-t border-border-subtle pt-4">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-primary hover:text-primary-700 transition-colors"
            >
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
