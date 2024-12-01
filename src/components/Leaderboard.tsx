import { useEffect, useState } from "react";
import { fetchUserProfile, getTopUsersByXP, getUserXPRankByID } from "../firebase/auth";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

function Leaderboard() {
    const { currentUser, userLoggedIn } = useAuth()
    const [currentUserData, setCurrentUserData] = useState<{ username: string; xp: number; iconURL: string, rank?: number } | null>(null)

    const [data, setData] = useState<{ userID: string; username: string; xp: number; iconURL: string, rank?: number }[]>([])
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

    useEffect(() => {
        const loadUserProfile = async () => {
            if (currentUser) {
                const profile = await fetchUserProfile(currentUser.uid)
                const rank = await getUserXPRankByID(currentUser.uid)
                if (profile && profile.username) {
                    setCurrentUserData({
                        username: profile.username,
                        xp: profile.xp || 0,
                        iconURL: profile.iconURL || "",
                        rank: rank
                    })
                }
            }
        }

        loadUserProfile()
    }, [userLoggedIn])

    useEffect(() => {
        // Add current user to leaderboard if not present
        if (currentUserData && !data.some((user) => user.username === currentUserData.username)) {
            setData((prevData) => [...prevData, { ...currentUserData, userID: currentUser?.uid || "" }])
        }
    }, [currentUserData, data])

    return (
        <div className="bg-[--b1] rounded-2xl p-4 w-full lg:min-w-[20rem]">
            <h1 className="text-xl font-bold my-2 ml-2">Leaderboard</h1>
            {loading ? (
                <span className="loading loading-infinity loading-lg m-auto"></span>
            ) : (
                <div className="space-y-4">
                    {data.map(({ username, xp, iconURL, rank }, i) => (
                        <Link to={"/profile/" + username} key={i}>
                            <div
                                className={`flex items-center rounded-2xl p-4 my-2 ${
                                    username === currentUserData?.username ? "bg-[--p]" : "bg-[--btn-color]"
                                }`}
                            >
                                <p className="font-black text-lg w-8">{rank ? rank : i + 1}</p>
                                <img
                                    className="w-12 h-12 bg-[--b1] rounded-full mr-4"
                                    src={iconURL}
                                    alt="User icon"
                                />
                                <div>
                                    <h1 className="font-bold">{username}</h1>
                                    <h2
                                        className={
                                            username === currentUserData?.username ? "text-white" : "text-[#CACACA]"
                                        }
                                    >
                                        Score: {xp.toLocaleString()}
                                    </h2>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Leaderboard
