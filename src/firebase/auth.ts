import { auth } from "./firebase-config";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    sendEmailVerification,
    updatePassword
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const db = getFirestore()

export const doCreateUserWithEmailAndPassword = async (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
};

export const doSignInWithEmailAndPassword = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const doSignOut = () => {
    return auth.signOut();
};

export const doPasswordReset = (email: string) => {
    return sendPasswordResetEmail(auth, email);
};

export const doPasswordChange = (password: string) => {
    if (auth.currentUser !== null) {
        return updatePassword(auth.currentUser, password);
    }
};

export const doSendEmailVerification = () => {
    if (auth.currentUser !== null) {
        return sendEmailVerification(auth.currentUser, {
            url: `${window.location.origin}/home`,
        });
    }
};

export const saveUserProfile = async (userId: string, profile: {username: string}) => {
    try {
        const userDocRef = doc(db, "users", userId)
        await setDoc(userDocRef, profile)
        console.log("Profile saved successfully!")
    } catch (err) {
        console.log("Error saving profile: " + err)
    }
}