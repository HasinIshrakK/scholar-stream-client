import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { AuthContext } from '../../../contexts/AuthContext';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

const friendlyAuthError = (err) => {
    const code = err?.code || "";
    if (code.includes("user-not-found") || code.includes("wrong-password") || code.includes("invalid-credential")) {
        return "That email and password combination doesn't match our records.";
    }
    if (code.includes("too-many-requests")) {
        return "Too many attempts. Please wait a moment and try again.";
    }
    if (code.includes("popup-closed-by-user")) {
        return null; // user cancelled — not a real error, don't show a message
    }
    return "Something went wrong signing you in. Please try again.";
};

const Login = () => {
    const { emailSignIn, googleSignIn } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    const [hidePassword, setHidePassword] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [googleSubmitting, setGoogleSubmitting] = useState(false);
    const [error, setError] = useState("");

    const redirectTo = location?.state?.from || '/';

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        setError("");
        setSubmitting(true);
        try {
            await emailSignIn(email, password);
            navigate(redirectTo);
        } catch (err) {
            console.error("Login failed:", err);
            setError(friendlyAuthError(err) || "Something went wrong signing you in. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const google = async (e) => {
        e.preventDefault();
        setError("");
        setGoogleSubmitting(true);
        try {
            await googleSignIn();
            navigate(redirectTo);
        } catch (err) {
            console.error("Google sign-in failed:", err);
            const message = friendlyAuthError(err);
            if (message) setError(message);
        } finally {
            setGoogleSubmitting(false);
        }
    };

    return (
        <div className="hero py-6 min-h-screen bg-[#FAF9F5]" style={{ fontFamily: "'Inter', sans-serif" }}>
            <div className="hero-content flex-col">
                <div className="text-center">
                    <h1
                        className="text-4xl sm:text-5xl text-[#0F1B3C] font-semibold"
                        style={{ fontFamily: "'Fraunces', serif" }}
                    >
                        Welcome back
                    </h1>
                    <p className="py-4 text-slate-500">
                        Log in to track your applications and saved scholarships.
                    </p>
                </div>
                <div className="card bg-white w-72 sm:w-96 max-w-sm shrink-0 border border-slate-200 shadow-sm">
                    <div className="card-body">
                        {error && (
                            <div className="mb-2 px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleOnSubmit}>
                            <fieldset className="fieldset">
                                <label className="label text-slate-600">Email</label>
                                <input
                                    required
                                    name='email'
                                    type="email"
                                    autoComplete="email"
                                    className="input focus:outline-none focus:border-[#C9A227] w-full"
                                    placeholder="Email"
                                />
                                <label className="label text-slate-600 mt-2">Password</label>
                                <div className='relative'>
                                    <input
                                        required
                                        type={hidePassword ? 'password' : 'text'}
                                        name='password'
                                        autoComplete="current-password"
                                        className="input focus:outline-none focus:border-[#C9A227] w-full pr-10"
                                        placeholder="Password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setHidePassword(!hidePassword)}
                                        aria-label={hidePassword ? "Show password" : "Hide password"}
                                        className="absolute inset-y-0 right-3 flex items-center text-lg text-slate-400 hover:text-slate-600"
                                    >
                                        {hidePassword ? <FaRegEye /> : <FaRegEyeSlash />}
                                    </button>
                                </div>
                                <div className="mt-1">
                                    <a className="link link-hover text-sm text-slate-500">Forgot password?</a>
                                </div>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="btn mt-4 w-full bg-[#0F1B3C] hover:bg-[#16234F] text-white border-none disabled:opacity-70"
                                >
                                    {submitting ? "Logging in..." : "Login"}
                                </button>
                            </fieldset>
                            <button
                                type="button"
                                onClick={google}
                                disabled={googleSubmitting}
                                className="btn btn-outline bg-white text-[#1A1A1A] border-[#e5e5e5] hover:bg-slate-50 mt-2 w-full disabled:opacity-70"
                            >
                                <svg aria-label="Google logo" className='h-6' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
                                <p>{googleSubmitting ? "Connecting..." : "Continue with Google"}</p>
                            </button>
                            <div className='mt-3 text-sm text-slate-500'>
                                Don't have an account? <Link to='/auth/register' className="link link-hover text-[#0F1B3C] font-medium">Register</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
