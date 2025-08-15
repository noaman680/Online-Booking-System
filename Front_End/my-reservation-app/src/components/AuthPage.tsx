import React, { useState } from 'react';

// --- Type Definitions ---
// In a larger app, these types could be in their own file, e.g., 'src/types.ts'
interface User {
    fullName: string;
    email: string;
}

interface UserWithPassword extends User {
    password: string;
}

// --- Component Props Definition ---
// This interface now correctly includes all the props needed from App.tsx
interface AuthPageProps {
  onLoginSuccess: (user: User) => void;
  users: UserWithPassword[];
  addUser: (user: UserWithPassword) => void;
}

// --- Authentication Page Component ---
const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess, users, addUser }) => {
    const [isSigningUp, setIsSigningUp] = useState(false);
    
    // --- Form State & Handlers ---
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [authError, setAuthError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setAuthError('');
        setSuccessMessage('');
        if (password !== confirmPassword) {
            setAuthError("Passwords do not match.");
            return;
        }
        setIsLoading(true);
        await new Promise(res => setTimeout(res, 1000));
        
        if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
            setAuthError('An account with this email already exists.');
            setIsLoading(false);
            return;
        }

        addUser({ fullName, email, password });
        
        setIsLoading(false);
        setSuccessMessage("Sign up successful! Please sign in.");
        setIsSigningUp(false);
    };

    const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setAuthError('');
        setSuccessMessage('');
        setIsLoading(true);
        
        await new Promise(res => setTimeout(res, 1000));

        const foundUser = users.find(
            u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        setIsLoading(false);
        if (foundUser) {
            onLoginSuccess({ fullName: foundUser.fullName, email: foundUser.email });
        } else {
            setAuthError("Invalid email or password.");
        }
    };


    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
            <h1 className="text-4xl font-bold text-blue-600 mb-4">ExpressLine Reservations</h1>
            <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8">
                <div className="flex border-b border-gray-200 mb-6">
                    <button onClick={() => setIsSigningUp(false)} className={`flex-1 py-2 text-center font-semibold transition-colors ${!isSigningUp ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-500'}`}>
                        Sign In
                    </button>
                    <button onClick={() => setIsSigningUp(true)} className={`flex-1 py-2 text-center font-semibold transition-colors ${isSigningUp ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-500'}`}>
                        Sign Up
                    </button>
                </div>

                {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}
                {authError && <p className="text-red-500 text-center mb-4">{authError}</p>}

                {isSigningUp ? (
                    <form onSubmit={handleSignUp}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullName">Full Name</label>
                            <input required className="shadow-inner appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" id="fullName" type="text" placeholder="John Doe" value={fullName} onChange={e => setFullName(e.target.value)} />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email-signup">Email Address</label>
                            <input required className="shadow-inner appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" id="email-signup" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password-signup">Password</label>
                            <input required className="shadow-inner appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" id="password-signup" type="password" placeholder="••••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">Confirm Password</label>
                            <input required className="shadow-inner appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" id="confirmPassword" type="password" placeholder="••••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                        </div>
                        <button type="submit" disabled={isLoading} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors disabled:bg-gray-400">
                            {isLoading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleSignIn}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email-signin">Email Address</label>
                            <input required className="shadow-inner appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" id="email-signin" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password-signin">Password</label>
                            <input required className="shadow-inner appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" id="password-signin" type="password" placeholder="••••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                        </div>
                        <button type="submit" disabled={isLoading} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors disabled:bg-gray-400">
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AuthPage;
