import React, { useState } from 'react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore'; 

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const LoginPage: FC = () => {
  const [isLoginView, setIsLoginView] = useState<boolean>(true);
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>(''); 

  const navigate = useNavigate(); 
  const { login, signUp } = useAuthStore(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    if (isLoginView) {
      // --- LOGIN LOGIC ---
      try {
        await login({ email, password });
        
        // On success, redirect to the dashboard
        navigate('/dashboard');

      } catch (error: any) {
        // If it fails, display the error message from the store
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      // --- SIGNUP LOGIC ---
      try {
        await signUp({ fullName, email, password });

        // On success, show a message and switch to the login view
        setSuccessMessage('Account created successfully! Please sign in.');
        setIsLoginView(true);
        setPassword(''); // Clear password field
      } catch (error: any) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const toggleView = () => {
      setIsLoginView(!isLoginView);
      setErrorMessage('');
      setSuccessMessage('');
      setEmail('');
      setPassword('');
      setFullName('');
  }

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{isLoginView ? 'Welcome Back!' : 'Create an Account'}</CardTitle>
          <CardDescription>
            {isLoginView ? 'Enter your credentials to access your dashboard.' : 'Enter your details below to get started.'}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-4">
            {!isLoginView && (
              <div className="grid gap-2">
                <Label htmlFor="full-name">Full Name</Label>
                <Input id="full-name" placeholder="John Doe" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {errorMessage && <p className="text-sm text-red-600 px-1">{errorMessage}</p>}
            {successMessage && <p className="text-sm text-green-600 px-1">{successMessage}</p>}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Processing...' : (isLoginView ? 'Sign In' : 'Create Account')}
            </Button>
            <div className="text-center text-sm text-gray-600">
              {isLoginView ? "Don't have an account? " : "Already have an account? "}
              <button type="button" onClick={toggleView} className="font-semibold text-blue-600 hover:underline">
                {isLoginView ? 'Sign Up' : 'Sign In'}
              </button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;

