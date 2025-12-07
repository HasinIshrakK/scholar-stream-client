import React, { createContext, useState } from 'react';
import auth from '../firebase/firebase.config';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    const emailSignUp = async (email, password, name, photo) => {
        const result = await createUserWithEmailAndPassword(auth, email, password);

        await updateProfile(result.user, {
            displayName: name,
            photoURL: photo
        });

        return result.user;
    };

    const emailSignIn = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password)
            .then((result) => {
                const _user = result.user;
                setUser(_user);
                alert('signed in')
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const provider = new GoogleAuthProvider();

    const googleSignIn = () => {
        return signInWithPopup(auth, provider).then(result => {
            const user = result.user;
            setUser(user);
            alert('signed in')

        })
            .catch((error) => {
                console.log(error);
            }
            );
    };

    const logout = async () => {
        await signOut(auth);
        alert('signed out')
    }

    const value = {
        user,
        setUser,
        googleSignIn,
        logout,
        emailSignUp,
        emailSignIn,
    };

    return (
        <AuthContext value={value}>
            {children}
        </AuthContext>
    );
};

export default AuthProvider;