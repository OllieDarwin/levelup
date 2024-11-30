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
    xp?: number,
    iconURL: string
}

const defaultUserProfile: UserProfile = {
    username: "",
    email: "",
    xp: 0,
    iconURL: `/user-icons/${Math.floor(Math.random()*7)+1}.png`
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

export const getTopUsersByXP = async (): Promise<{userID: string, username: string, xp: number, iconURL: string}[]> => {
    try {
        const userCollection = collection(db, "users")
        const topUsersQuery = query(userCollection, orderBy("xp", "desc"), limit(5))
        const querySnapshot = await getDocs(topUsersQuery)
        const topUsers = querySnapshot.docs.map((doc) => ({
            userID: doc.id,
            ...doc.data(),
        })) as {userID: string, username: string, xp: number, iconURL: string}[]

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

        // Map the friend requests and fetch the iconURL for each friendID
        const friendRequests = await Promise.all(
            querySnapshot.docs.map(async (docSnapshot) => {
                const requestData = docSnapshot.data() as {friendID: string, friendName: string, sentAt: Timestamp, status: "pending" | "received"}

                // Fetch the iconURL from the friend's profile document
                let iconURL = "/user-icons/1.png" // Fallback icon
                try {
                    const friendProfileRef = doc(db, "users", requestData.friendID)
                    const friendProfileSnapshot = await getDoc(friendProfileRef)

                    if (friendProfileSnapshot.exists()) {
                        const friendProfileData = friendProfileSnapshot.data()
                        iconURL = friendProfileData.iconURL || iconURL // Use friend's iconURL if it exists
                    }
                } catch (error) {
                    console.error(`Error fetching profile for friendID: ${requestData.friendID}`, error)
                }

                return {
                    ...requestData,
                    iconURL,
                }
            })
        )

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

export const getUserIconFromID = async (userID: string) => {
    try {
        const userDocRef = doc(db, "users", userID)
        const userSnapshot = await getDoc(userDocRef)

        if (userSnapshot.exists()) {
            return userSnapshot.data().iconURL
        }

    } catch (error) {
        console.error("Error fetchin icon from ID:", error)
        throw error
    }
}

export const getUserRelationship = async (userID: string, friendID: string) => {
    if (!userID || !friendID) {
        console.error("Invalid userID or friendID provided:", { userID, friendID })
        throw new Error("Invalid userID or friendID")
    }

    try {
        const userFriendRequestsRef = doc(db, "users", userID, "friendRequests", friendID)
        const userFriendRequestSnapshot = await getDoc(userFriendRequestsRef)

        const userFriendsRef = doc(db, "users", userID, "friends", friendID)
        const userFriendSnapshot = await getDoc(userFriendsRef)

        if (userFriendRequestSnapshot.exists()) {
            const status = userFriendRequestSnapshot.data()?.status;
            if (status === "pending") return "pending"
            if (status === "received") return "received"
        } else if (userFriendSnapshot.exists()) {
            return "friends"
        }

        return "none"
    } catch (error) {
        console.error("Error establishing user relationship", error)
        throw error
    }
}

export const getTopFriends = async (userID: string) => {
    try {
        const friendsRef = collection(db, "users", userID, "friends")
        const friendsQuery = query(friendsRef, limit(8))
        const querySnapshot = await getDocs(friendsQuery)

        // Map the friends and fetch the data for each friendID
        const friends = await Promise.all(
            
            querySnapshot.docs.map(async (docSnapshot) => {
                const requestData = docSnapshot.data() as {friendID: string}

                try {
                    const friendProfileRef = doc(db, "users", requestData.friendID)
                    const friendProfileSnapshot = await getDoc(friendProfileRef)

                    if (friendProfileSnapshot.exists()) {
                        const friendProfileData = friendProfileSnapshot.data()
                        return {
                            friendID: requestData.friendID,
                            username: friendProfileData.username || "Unknown",
                            iconURL: friendProfileData.iconURL || "/user-icons/1.png",
                        }
                    } else {
                        console.warn(`Profile not found for friendID: ${requestData.friendID}`)
                        return {
                            friendID: requestData.friendID,
                            username: "Unknown",
                            iconURL: "/user-icons/1.png",
                        }
                    }
                } catch (error) {
                    console.error(`Error fetching profile for friendID: ${requestData.friendID}`, error)
                    return {
                        friendID: requestData.friendID,
                        username: "Unknown",
                        iconURL: "/user-icons/1.png",
                    }
                }
            })
        )

        return friends
    } catch (error) {
        console.error("Error fetching top friends:", error)
        throw error
    }
}

export const saveUserSettings = async (userId: string, settings: any) => {
    const userRef = doc(db, "users", userId)
    await setDoc(userRef, { settings }, { merge: true })
}

export const fetchUserSettings = async (userId: string) => {
    const userRef = doc(db, "users", userId)
    const docSnapshot = await getDoc(userRef)
    return docSnapshot.exists() ? docSnapshot.data().settings : null
}