import React, { useContext } from 'react';
import { Link } from 'react-router';
import { AuthContext } from '../../../contexts/AuthContext';

const Login = () => {

    const { emailSignIn, googleSignIn } = useContext(AuthContext);

    const handleOnSubmit = (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        emailSignIn(email, password);
    };

    const google = (e) => {
        e.preventDefault();
        googleSignIn();
    };

    return (
        <div className="hero py-6 min-h-screen">
            <div className="hero-content flex-col">
                <div className="text-center">
                    <h1 className="text-5xl text-indigo-700 font-bold">Login now!</h1>
                    <p className="py-6">
                        Welcome Back
                    </p>
                </div>
                <div className="card bg-base-100 w-72 sm:w-96 max-w-sm shrink-0 shadow-2xl">
                    <div className="card-body">
                        <form onSubmit={handleOnSubmit}>
                            <fieldset className="fieldset">
                                <label className="label">Email</label>
                                <input name='email' type="email" className="input" placeholder="Email" />
                                <label className="label">Password</label>
                                <input name='password' type="password" className="input" placeholder="Password" />
                                <div><a className="link link-hover">Forgot password?</a></div>
                                <button className="btn btn-primary mt-4">Login</button>
                            </fieldset>
                            <button onClick={google} className="btn btn-primary btn-outline bg-white text-black border-[#e5e5e5] mt-2 w-full">
                                <svg aria-label="Google logo" className='h-6' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
                                <p>
                                    Continue with Google
                                </p>
                            </button>
                            <div className='mt-2'>Don't have an account? <Link to='/auth/register' className="link link-hover">Register</Link></div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;