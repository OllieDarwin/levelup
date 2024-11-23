import { auth } from "./firebase-config";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    sendEmailVerification,
    updatePassword
} from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";

const db = getFirestore()

interface UserProfile {
    username?: string,
    email?: string,
    xp?: number
}

const defaultUserProfile: UserProfile = {
    username: "",
    email: "",
    xp: 0
}

export const doCreateUserWithEmailAndPassword = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    await saveUserProfile(userCredential.user.uid, {...defaultUserProfile, ...{email: email, xp: 0}})
    return userCredential
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

export const saveUserProfile = async (userId: string, profile: Partial<UserProfile>) => {
    try {
        const userDocRef = doc(db, "users", userId)
        await updateDoc(userDocRef, profile)
        console.log("Profile saved successfully!")
    } catch (err) {
        console.log("Error saving profile: " + err)
    }
}

export const fetchUserProfile = async (userId: string | null) => {
    if (userId === null) {
        return null
    }
    try {
        const userDocRef = doc(db, "users", userId)
        const userSnapshot = await getDoc(userDocRef)

        if (userSnapshot.exists()) {
            return userSnapshot.data()
        } else {
            console.error("No user data found!")
            doSignOut()
            return null
        }
    } catch (error) {
            console.error("Error fetching user profile:", error)
            return null
    }
};