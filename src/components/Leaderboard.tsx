import { useEffect, useState } from "react"
import { fetchUserProfile, getTopUsersByXP } from "../firebase/auth"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/authContext"

// TODO: Add user icon

function Leaderboard() {
    const { currentUser, userLoggedIn } = useAuth()
    const [currentUsername, setCurrentUsername] = useState("")

    const [data, setData] = useState<{userID: string, username: string, xp: number, iconURL: string}[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTopUsers = async () => {
            try {
                const users = await getTopUsersByXP()
                setData(users)
            } catch (error) {
                console.error("Error fetching top users:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchTopUsers()
    }, [])

    // Get current user data
    useEffect(() => {
        const loadUserProfile = async () => {
            if (currentUser) {
                const profile = await fetchUserProfile(currentUser.uid)
                if (profile && profile.username) {
                    setCurrentUsername(profile.username)
                }
            }
        }

        loadUserProfile()
    }, [userLoggedIn])

    return (
    <>
        <div className="join join-vertical w-[36rem] gap-2 bg-[--b1] px-4 py-4 rounded-2xl h-max my-auto">
            <h1 className="text-xl font-bold ml-2 my-2">Leaderboard</h1>
            {loading ? 
            <span className="loading loading-infinity loading-lg m-auto"></span>
            : 
            data.map(({username, xp, iconURL}, i) => (
                <Link to={"/profile/" + username}>
                    <div className={"flex rounded-2xl py-2 " + (username === currentUsername ? "bg-[--p]" : "bg-[--btn-color]")}>
                        <p className="my-auto mx-8 font-black">{i+1}</p>
                        <img className="size-12 bg-white rounded-full my-auto mr-4" src={window.location.origin + (iconURL || "/user-icons/1.png")} alt="User icon" />
                        <div>
                            <h1 className="font-bold text-lg">{username}</h1>
                            <h2 className={(username === currentUsername ? "text-white" : "text-[#CACACA]")}>Score: {xp.toLocaleString()}</h2>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    </>
)
}

export default Leaderboard