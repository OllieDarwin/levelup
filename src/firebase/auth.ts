import { auth } from "./firebase-config";
import {
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
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

/**
 * Create user
 * @param email Desired email
 * @param password Desired password
 * @returns the user's new credential
 */
export const doCreateUserWithEmailAndPassword = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const userDocRef = doc(db, "users", userCredential.user.uid)
    await setDoc(userDocRef, {...defaultUserProfile, ...{email: email}})
    return userCredential
};

/**
 * Sign in
 * @returns Result
 */
export const doSignInWithEmailAndPassword = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
};

/**
 * Sign out
 * @returns Result
 */
export const doSignOut = () => {
    return auth.signOut();
};

/**
 * Send password reset email
 * @param email email of the desired user
 * @returns Result
 */
export const doPasswordReset = (email: string) => {
    return sendPasswordResetEmail(auth, email);
};

/**
 * Save a user profile
 * @param userID ID of the desired user
 * @param profile Data to save
 */
export const saveUserProfile = async (userId: string, profile: Partial<UserProfile>) => {
    try {
        const userDocRef = doc(db, "users", userId)
        await updateDoc(userDocRef, profile)
        console.log("Profile saved successfully!")
    } catch (err) {
        console.log("Error saving profile: " + err)
    }
}

/**
 * Get a user's profile by ID
 * @param userID ID of the desired user
 * @returns Their user profile
 */
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

/**
 * Get a list of the top 5 users by XP
 * @returns A list of the top 5 user profiles by XP
 */
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

/**
 * Get a user's profile by username
 * @param username Username of the desired user
 * @returns Their user profile
 */
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

/**
 * Get the user's XP rank
 * @param userID ID of desired user
 * @returns a number detailing the user's XP rank
 */
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

/**
 * Create a friend requests from one user to another
 * @param userID ID of one user (current, sender)
 * @param friendID ID of other user (recipient)
 */
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

/**
 * Get a list of friend requests from a user
 * @param userID ID of the desired user
 * @returns Aa list of all friend requests the user has sent or received
 */
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

/**
 * Accept a friend request from one user to another
 * @param userID ID of one user (current)
 * @param friendID ID of other user
 */
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

/**
 * Ignore a friend request from one user to another
 * @param userID ID of one user (current)
 * @param friendID ID of other user
 */
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

/**
 * Get username from user using their user ID
 * @param userID The ID of the to get the username from
 * @returns the string of the username
 */
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

/**
 * Get user icon using their user ID
 * @param userID The ID of the user to get the icon from
 * @returns the string of the user icon location
 */
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

/**
 * Get the relationship between two users
 * @param userID One user (current)
 * @param friendID The other user
 * @returns "friends" || "pending" || "received" || "none"
 */
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

/**
 * Get a list of 8 of the user's friends.
 * @param userID The userID to get friends for
 * @returns An array of user objects
 */
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

/**
 * Save the user settings
 * @param userID The userID to save settings for
 */
export const saveUserSettings = async (userId: string, settings: any) => {
    const userRef = doc(db, "users", userId)
    await setDoc(userRef, { settings }, { merge: true })
}

/**
 * Get the user settings from firestore.
 * @param userID The userID to fetch settings for
 * @returns User settings
 */
export const fetchUserSettings = async (userId: string) => {
    const userRef = doc(db, "users", userId)
    const docSnapshot = await getDoc(userRef)
    return docSnapshot.exists() ? docSnapshot.data().settings : null
}

/**
 * Query users from Firestore matching the search term.
 * @param searchTerm The string to search for
 * @returns Array of user objects
 */
export const searchUsers = async (searchTerm: string) => {
    const usersRef = collection(db, "users")
    const q = query(
        usersRef,
        where("username", ">=", searchTerm),
        where("username", "<=", searchTerm + "\uf8ff") // Firestore range query
    )

    const querySnapshot = await getDocs(q)
    const users: { userID: string, username: string, iconURL: string }[] = []
    querySnapshot.forEach((doc) => {
        const data = doc.data() as { username: string, iconURL: string }
        users.push({ userID: doc.id, ...data })
    });

    return users
}

/**
 * Checks if a given username already exists in the Firestore database.
 * @param username - The username to check.
 * @returns A promise that resolves to true if the username exists, false otherwise.
 */
export const doesUsernameExist = async (username: string): Promise<boolean> => {
    try {
        const usersRef = collection(db, "users"); // Replace "users" with your actual collection name
        const q = query(usersRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);

        // If the query returns any documents, the username exists
        return !querySnapshot.empty;
    } catch (error) {
        console.error("Error checking username existence:", error);
        return false; // Handle errors gracefully by returning false
    }
};