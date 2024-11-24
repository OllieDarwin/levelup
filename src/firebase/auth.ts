import { auth } from "./firebase-config";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    sendEmailVerification,
    updatePassword
} from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc, collection, orderBy, limit, query, getDocs, setDoc, where, serverTimestamp, Timestamp, deleteDoc } from "firebase/firestore";

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
    const userDocRef = doc(db, "users", userCredential.user.uid)
    await setDoc(userDocRef, {...defaultUserProfile, ...{email: email}})
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
            saveUserProfile(userId, {...defaultUserProfile})
            return null
        }
    } catch (error) {
            console.error("Error fetching user profile:", error)
            return null
    }
};

export const getTopUsersByXP = async (): Promise<{userID: string, username: string, xp: number}[]> => {
    try {
        const userCollection = collection(db, "users")
        const topUsersQuery = query(userCollection, orderBy("xp", "desc"), limit(5))
        const querySnapshot = await getDocs(topUsersQuery)
        const topUsers = querySnapshot.docs.map((doc) => ({
            userID: doc.id,
            ...doc.data(),
        })) as {userID: string, username: string, xp: number}[]

        return topUsers
    } catch (error) {
        console.error("Error fetching top users:", error)
        throw error
    }
}

export const getUserProfileByUsername = async (username: string) => {
    try {
        const userCollection = collection(db, "users")
        const usernameQuery = query(userCollection, where("username", "==", username))
        const querySnapshot = await getDocs(usernameQuery)
        if (querySnapshot.empty) {
            throw new Error("No user found with this username.");
        }
        const userDoc = querySnapshot.docs[0]
        return {id: userDoc.id, ...userDoc.data()}
    } catch (error) {
        console.error("Error fetching user profile by username:", error)
        throw error
    }
}

export const getUserXPRankByID = async (userID: string) => {
    try {
        const userCollection = collection(db, "users")
        const topUsersQuery = query(userCollection, orderBy("xp", "desc"))
        const querySnapshot = await getDocs(topUsersQuery)
        const topUsers = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            xp: doc.data().xp
        }))

        const rank = topUsers.findIndex((user) => user.id === userID) + 1

        return rank
    } catch (error) {
        console.error("Error fetching user rank by user ID:", error)
        throw error
    }
}

export const sendFriendRequest = async (userID: string, friendID: string) => {
    try {
        const userRef = doc(db, "users", userID, "friendRequests", friendID)
        const friendRef = doc(db, "users", friendID, "friendRequests", userID)
        const username = await getUsernameFromID(userID)
        const friendName = await getUsernameFromID(friendID)

        await setDoc (userRef, {
            friendID: friendID,
            friendName: friendName,
            status: "pending",
            sentAt: serverTimestamp()
        })
        await setDoc (friendRef, {
            friendID: userID,
            friendName: username,
            status: "received",
            sentAt: serverTimestamp()
        })

        console.log("Friend request sent!")
    } catch (error) {
        console.error("Error sending friend request:", error)
        throw error
    }
}

export const getFriendRequests = async (userID: string) => {
    try {
        const friendRequestsRef = collection(db, "users", userID, "friendRequests")
        const friendRequestsQuery = query(friendRequestsRef, orderBy("sentAt", "desc"))
        const querySnapshot = await getDocs(friendRequestsQuery)
        const friendRequests = querySnapshot.docs.map((doc) => ({
            ...doc.data()
        })) as {friendID: string, friendName: string, sentAt: Timestamp, status: "pending" | "received"}[]

        return friendRequests
    } catch (error) {
        console.error("Error fetching friend requests:", error)
        throw error
    }
}

export const acceptFriendRequest = async (userID: string, friendID: string) => {
    try {
        const userFriendsRef = doc(db, "users", userID, "friends", friendID)
        const friendFriendsRef = doc(db, "users", friendID, "friends", userID)

        await setDoc (userFriendsRef, {
            friendID: friendID,
            addedAt: serverTimestamp()
        })
        await setDoc (friendFriendsRef, {
            friendID: userID,
            addedAt: serverTimestamp()
        })

        const userRequestRef = doc(db, "users", userID, "friendRequests", friendID)
        const friendRequestRef = doc(db, "users", friendID, "friendRequests", userID)

        await deleteDoc(userRequestRef)
        await deleteDoc(friendRequestRef)

        console.log("Accepted friend request.")

    } catch (error) {
        console.error("Error accepting friend request:", error)
        throw error
    }
}

export const ignoreFriendRequest = async (userID: string, friendID: string) => {
    try {
        const userRequestRef = doc(db, "users", userID, "friendRequests", friendID)
        const friendRequestRef = doc(db, "users", friendID, "friendRequests", userID)

        await deleteDoc(userRequestRef)
        await deleteDoc(friendRequestRef)

        console.log("Ignored friend request.")

    } catch (error) {
        console.error("Error ignoring friend request:", error)
        throw error
    }
}

export const getUsernameFromID = async (userID: string) => {
    try {
        const userDocRef = doc(db, "users", userID)
        const userSnapshot = await getDoc(userDocRef)

        if (userSnapshot.exists()) {
            return userSnapshot.data().username
        }
    } catch (error) {
        console.error("Error fetching username by user ID:", error)
        throw error
    }
}