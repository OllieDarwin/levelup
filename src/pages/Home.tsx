import { Navigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useEffect, useState } from "react"
import { auth } from "../firebase/firebase-config"
import { fetchUserProfile, useAuth } from "../contexts/authContext"

function Home() {
    const { userLoggedIn } = useAuth()
    const [username, setUsername] = useState("")

    useEffect(() => {
        const loadUserProfile = async () => {
            const user = auth.currentUser
            if (user) {
                const profile = await fetchUserProfile(user.uid)
                if (profile && profile.username) {
                    setUsername(profile.username)
                }
            }
        }

        loadUserProfile()
    }, [auth])

    return (
        <>
            {!userLoggedIn && console.log("not logged in") }
            {!userLoggedIn && (<Navigate to="/login" />) }
            
            <div className="min-h-screen h-screen">
                <Navbar></Navbar>
                <div className="flex flex-col min-h-[calc(100vh-7rem)]">
                    <div className="container mx-auto mt-4 w-[90%] bg-[--btn-color] rounded-t-2xl shadow flex-1">
                        <h1 className="font-semibold text-center mt-24 text-4xl">Welcome to <span className="text-[--p]">LevelUp</span>!</h1>
                        {username && 
                            <h1 className="font-normal text-[#CACACA] text-center mt-8 text-xl">Welcome back, {username || "LOADING"}. Feel free to scroll and see what we’re about and play some games!</h1>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home