import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router";
import { AuthContext } from '../../../contexts/AuthContext';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

const friendlyAuthError = (err) => {
    const code = err?.code || "";
    if (code.includes("email-already-in-use")) {
        return "An account with that email already exists — try logging in instead.";
    }
    if (code.includes("invalid-email")) {
        return "That email address doesn't look right.";
    }
    if (code.includes("popup-closed-by-user")) {
        return null; // user cancelled — not a real error
    }
    return "Something went wrong creating your account. Please try again.";
};

const Register = () => {
    const { emailSignUp, googleSignIn } = useContext(AuthContext);

    const navigate = useNavigate();
    const location = useLocation();
    const redirectTo = location?.state?.from || '/';

    const [hidePassword, setHidePassword] = useState(true);
    const [hidePassword2, setHidePassword2] = useState(true);
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [focus, setFocus] = useState(false);
    const [focus2, setFocus2] = useState(false);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [googleSubmitting, setGoogleSubmitting] = useState(false);

    const passwordRules = {
        hasUpper: password.toLowerCase() !== password,
        hasLower: password.toUpperCase() !== password,
        longEnough: password.length >= 6,
    };
    const passwordValid = passwordRules.hasUpper && passwordRules.hasLower && passwordRules.longEnough;
    const passwordsMatch = password.length > 0 && password === password2;

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const name = e.target.name.value;
        const photo = e.target.photo.value;
        const email = e.target.email.value;

        if (!passwordValid || !passwordsMatch) {
            setError("Please fix the password requirements before submitting.");
            return;
        }

        setSubmitting(true);
        try {
            const user = await emailSignUp(email, password, name, photo);
            if (user) navigate(redirectTo);
        } catch (err) {
            console.error("Registration failed:", err);
            setError(friendlyAuthError(err) || "Something went wrong creating your account. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const google = async (e) => {
        e.preventDefault();
        setError('');
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
                        Create your account
                    </h1>
                    <p className="py-4 text-slate-500">
                        Join ScholarStream to save scholarships and track applications.
                    </p>
                </div>
                <div className="card bg-white w-full sm:w-96 max-w-sm shrink-0 border border-slate-200 shadow-sm">
                    <div className="card-body">
                        {error && (
                            <div className="mb-2 px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleOnSubmit}>
                            <fieldset className="fieldset">
                                <label className="label text-slate-600">Name</label>
                                <input required type="text" name='name' autoComplete="name" className="input focus:outline-none focus:border-[#C9A227] w-full" placeholder="Your name" />

                                <label className="label text-slate-600 mt-2">Photo URL <span className="text-slate-400 font-normal">(optional)</span></label>
                                <input type="url" name='photo' className="input focus:outline-none focus:border-[#C9A227] w-full" placeholder="https://..." />

                                <label className="label text-slate-600 mt-2">Email</label>
                                <input required type="email" name='email' autoComplete="email" className="input focus:outline-none focus:border-[#C9A227] w-full" placeholder="Your email" />

                                <label className="label text-slate-600 mt-2">Password</label>
                                <div className='relative'>
                                    <input
                                        required
                                        type={hidePassword ? 'password' : 'text'}
                                        name='password'
                                        autoComplete="new-password"
                                        className="input focus:outline-none focus:border-[#C9A227] w-full pr-10"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onFocus={() => { setFocus(true); setFocus2(false); }}
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

                                {focus && (
                                    <div className='text-sm mt-1 space-y-0.5'>
                                        <p className={passwordRules.hasUpper ? 'text-emerald-600' : 'text-red-500'}>
                                            Must include at least one uppercase letter
                                        </p>
                                        <p className={passwordRules.hasLower ? 'text-emerald-600' : 'text-red-500'}>
                                            Must include at least one lowercase letter
                                        </p>
                                        <p className={passwordRules.longEnough ? 'text-emerald-600' : 'text-red-500'}>
                                            Must be at least 6 characters long
                                        </p>
                                    </div>
                                )}

                                <label className="label text-slate-600 mt-2">Confirm password</label>
                                <div className='relative'>
                                    <input
                                        required
                                        type={hidePassword2 ? 'password' : 'text'}
                                        name='password2'
                                        autoComplete="new-password"
                                        className="input focus:outline-none focus:border-[#C9A227] w-full pr-10"
                                        value={password2}
                                        onChange={(e) => setPassword2(e.target.value)}
                                        onFocus={() => { setFocus2(true); setFocus(false); }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setHidePassword2(!hidePassword2)}
                                        aria-label={hidePassword2 ? "Show password" : "Hide password"}
                                        className="absolute inset-y-0 right-3 flex items-center text-lg text-slate-400 hover:text-slate-600"
                                    >
                                        {hidePassword2 ? <FaRegEye /> : <FaRegEyeSlash />}
                                    </button>
                                </div>
                                {focus2 && (
                                    <p className={`text-sm mt-1 ${passwordsMatch ? 'text-emerald-600' : 'text-red-500'}`}>
                                        Must match the password above
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="btn mt-4 w-full bg-[#0F1B3C] hover:bg-[#16234F] text-white border-none disabled:opacity-70"
                                >
                                    {submitting ? "Creating account..." : "Register"}
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
                                Already registered? <Link to='/auth/login' className="link link-hover text-[#0F1B3C] font-medium">Login</Link>
                            </div>
                        </form>
                    </div>
                    <div>
                        <p className='px-6 pb-6 pt-2 text-xs text-slate-400 leading-relaxed'>
                            By joining, you agree to our <a className='link link-hover'>Terms of Service</a> and to occasionally receive emails from us.
                            Please read our <a className='link link-hover'>Privacy Policy</a> to learn how we use your personal data.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
