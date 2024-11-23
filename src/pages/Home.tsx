import { Navigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useEffect, useState } from "react"
import { useAuth } from "../contexts/authContext"
import BodyCard from "../components/BodyCard"
import { fetchUserProfile } from "../firebase/auth"

function Home() {
    const { currentUser, userLoggedIn } = useAuth()
    const [username, setUsername] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadUserProfile = async () => {
            if (currentUser) {
                const profile = await fetchUserProfile(currentUser.uid)
                if (profile && profile.username) {
                    setUsername(profile.username)
                    setLoading(false)
                    console.log(profile.xp)
                }
            }
        }

        loadUserProfile()
    }, [userLoggedIn])

    return (
        <>
            {!userLoggedIn && (<Navigate to="/login" />) }
            
            <div className="min-h-screen h-screen">
                <Navbar showNav={true}></Navbar>

                {/* Main card */}
                <BodyCard>
                    {loading ?
                    <>
                        <span className="loading loading-infinity loading-lg mx-auto mt-64"></span>
                    </> 
                    :
                    <>
                        <h1 className="font-semibold text-center mt-24 text-4xl">Welcome to <span className="text-[--p]">LevelUp</span>!</h1>
                        {username && <h1 className="font-normal text-[#CACACA] text-center mt-8 text-xl">Welcome back, {username || "LOADING"}. Feel free to scroll and see what we’re about and play some games!</h1>}
                    </>
                    }
                </BodyCard>
            </div>
        </>
    )
}

export default Home