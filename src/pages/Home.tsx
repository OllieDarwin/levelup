import { Navigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useEffect, useState } from "react"
import { auth } from "../firebase/firebase-config"
import { fetchUserProfile, useAuth } from "../contexts/authContext"
import BodyCard from "../components/BodyCard"

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
            {!userLoggedIn && (<Navigate to="/login" />) }
            
            <div className="min-h-screen h-screen">
                <Navbar showNav={true}></Navbar>

                {/* Main card */}
                <BodyCard>
                    <h1 className="font-semibold text-center mt-24 text-4xl">Welcome to <span className="text-[--p]">LevelUp</span>!</h1>
                    {username && 
                        <h1 className="font-normal text-[#CACACA] text-center mt-8 text-xl">Welcome back, {username || "LOADING"}. Feel free to scroll and see what we’re about and play some games!</h1>
                    }
                </BodyCard>
            </div>
        </>
    )
}

export default Home