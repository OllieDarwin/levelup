import React, { useContext, useState, useEffect } from "react"
import { auth } from "../../firebase/firebase-config"
import { onAuthStateChanged, User } from "firebase/auth"
import { doc, getDoc, getFirestore } from "firebase/firestore"

const db = getFirestore()

export interface ExtendedUser extends User {
    username?: string
}

interface AuthContextType {
    currentUser: ExtendedUser | null
    userLoggedIn: boolean
    loading: boolean
}

type AuthProviderProps = {
    children: React.ReactNode
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<ExtendedUser | null>(null)
  const [userLoggedIn, setUserLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, initializeUser)
        return unsubscribe
  }, []);

  async function initializeUser(user: ExtendedUser | null) {
    if (user) {
        setCurrentUser({ ...user })
        setUserLoggedIn(true)
    } else {
        setCurrentUser(null)
        setUserLoggedIn(false)
    }
    setLoading(false)
  }

  const value = {
    currentUser,
    userLoggedIn,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const fetchUserProfile = async (userId: string | null) => {
    if (userId === null) {
        return null
    }
    try {
        const userDocRef = doc(db, "users", userId)
        const userSnapshot = await getDoc(userDocRef)

        if (userSnapshot.exists()) {
            console.log("User data:", userSnapshot.data())
            return userSnapshot.data()
        } else {
            console.log("No user data found!")
            return null
        }
    } catch (error) {
            console.error("Error fetching user profile:", error)
            return null
    }
};