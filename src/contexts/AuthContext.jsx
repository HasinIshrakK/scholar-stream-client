import React, { createContext, useEffect, useState } from 'react';
import auth from '../firebase/firebase.config';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import Swal from 'sweetalert2';
import useAxios from '../hooks/useAxios';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const axiosInstance = useAxios();


    const emailSignUp = async (email, password, name, photo) => {
        const result = await createUserWithEmailAndPassword(auth, email, password);

        await updateProfile(result.user, {
            displayName: name,
            photoURL: photo,
        });

        await axiosInstance.post('/users', {
            uid: result.user.uid,
            name,
            email,
            photo,
            role: "student"
        });

        setUser(result.user);
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Successfully Signed Up",
            showConfirmButton: false,
            timer: 1500,
            theme: 'auto'
        });
        return result.user;
    };

    const emailSignIn = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password)
            .then((result) => {
                const _user = result.user;
                setUser(_user);
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Successfully Logged In",
                    showConfirmButton: false,
                    timer: 1500,
                    theme: 'auto'
                });
            })
            .catch((error) => {
                alert(error);
            });
    }

    const provider = new GoogleAuthProvider();

    const googleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            await axiosInstance.post('/users', {
                uid: user.uid,
                name: user.displayName,
                email: user.email,
                photo: user.photoURL,
                role: "student",
            });

            setUser(user);

            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Successfully Logged In",
                showConfirmButton: false,
                timer: 1500,
                theme: 'auto'
            });

        } catch (error) {
            console.error("Google login error:", error);
        }
    };


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const logout = async () => {
        await signOut(auth);
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Successfully Logged Out",
            showConfirmButton: false,
            timer: 1500,
            theme: 'auto'
        });
    }

    const value = {
        user,
        setUser,
        googleSignIn,
        logout,
        emailSignUp,
        emailSignIn,
        loading,
    };

    return (
        <AuthContext value={value}>
            {children}
        </AuthContext>
    );
};

export default AuthProvider;