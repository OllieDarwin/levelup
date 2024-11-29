import { Navigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useEffect, useState } from "react"
import { useAuth } from "../contexts/authContext"
import BodyCard from "../components/BodyCard"
import { fetchUserProfile, getTopFriends } from "../firebase/auth"
import Friends from "../components/Friends"

// TODO: Add friends view and Games

function Home() {
    const { currentUser, userLoggedIn } = useAuth()
    const [username, setUsername] = useState("")
    const [loading, setLoading] = useState(true)
    const [friends, setFriends] = useState<{ iconURL: string; username: string; friendID: string; }[]>([])

    useEffect(() => {
        const loadUserProfile = async () => {
            if (currentUser) {
                const profile = await fetchUserProfile(currentUser.uid)
                if (profile && profile.username) {
                    setUsername(profile.username)
                    setLoading(false)
                }
            }
        }

        loadUserProfile()
    }, [userLoggedIn])

    const loadTopFriends = async () => {
        if (currentUser) {
            try {
                const topFriends = await getTopFriends(currentUser.uid)
                setFriends(topFriends)
            } catch (error) {
                console.error("Error loading top friends:", error)
            }
        }
    }

    useEffect(() => {
        if (currentUser) {
            loadTopFriends()
        }
    }, [currentUser])

    return (
        <>
            {!userLoggedIn && (<Navigate to="/login" />) }
            <Navbar showNav={true}></Navbar>

            {/* Main card */}
            <BodyCard>
                {loading ?
                <>
                    <span className="loading loading-infinity loading-lg mx-auto mt-64 block"></span>
                </> 
                :
                <>
                    <div className="mx-8 h-full">
                        <h1 className="font-semibold text-center mt-8 text-4xl lg:mt-24">Welcome to <span className="text-[--p]">LevelUp</span>!</h1>
                        {username && <h2 className="font-normal text-[#CACACA] text-center mt-8 text-xl">Welcome back, {username || "LOADING"}. Feel free to scroll and see what we’re about and play some games!</h2>}
                        <div className="lg:mx-12 mb-8">
                            <h3 className="font-semibold text-xl mt-8 mx-4 mb-4">Friends</h3>
                            <Friends data={friends} />
                        </div>
                    </div>
                </>
                }
            </BodyCard>
        </>
    )
}

export default Home