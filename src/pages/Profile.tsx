import { useEffect, useState } from "react"
import { Navigate, useParams } from "react-router-dom"
import { acceptFriendRequest, fetchUserProfile, getUserProfileByUsername, getUserRelationship, getUserXPRankByID, sendFriendRequest } from "../firebase/auth"
import Navbar from "../components/Navbar"
import BodyCard from "../components/BodyCard"
import { useAuth } from "../contexts/authContext"
import PageTitle from "../components/PageTitle"

// TODO: Add more user data and user can edit profile?

function Profile() {
    const { currentUser, userLoggedIn } = useAuth()
    const { username } = useParams<{ username: string}>()
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [rank, setRank] = useState<number>()

    const [currentUsername, setCurrentUsername] = useState("")

    const [userRelationship, setUserRelationship] = useState<"none" | "pending" | "received" | "friends">()
    const [buttonElement, setButtonElement] = useState(<></>)

    // Get data for user profile
    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                if (!username) throw new Error("No username found")
                const userProfile = await getUserProfileByUsername(username)
                setProfile(userProfile)
                const userRank = await getUserXPRankByID(userProfile.id)
                setRank(userRank)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

        loadUserProfile()
    }, [username])

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

    const loadUserRelationship = async () => {
        if (currentUser && profile !== null) {
            const relationship = await getUserRelationship(currentUser.uid, profile.id)
            setUserRelationship(relationship) // Update state
        }
    }

    useEffect(() => {
        loadUserRelationship()
    }, [currentUser, profile])
    
    // Watch for changes to userRelationship to update the button state
    useEffect(() => {
        const updateButtonState = () => {
            if (!currentUser) {
                setButtonElement(<></>)
                return
            }
            if (username === currentUsername) {
                setButtonElement(<></>)
                return
            }
            if (userRelationship === "none") {
                setButtonElement(<div className="btn border-none bg-[--p]" onClick={addFriend}>Add as friend</div>)
                return
            } else if (userRelationship === "friends") {
                setButtonElement(<div className="btn border-none bg-[--btn-color]">Friends</div>)
                return
            } else if (userRelationship === "pending") {
                setButtonElement(<div className="btn border-none bg-[--btn-color]">Friend request sent</div>)
                return
            } else if (userRelationship === "received") {
                setButtonElement(<div className="btn border-none bg-[--p]" onClick={() => acceptFriendRequest(currentUser?.uid, profile.id)}>Accept friend request</div>)
                return
            }
        };
    
        if (userRelationship) {
            loadUserRelationship()
            updateButtonState()
        }
    }, [userRelationship, currentUser, username, currentUsername, profile]);
    

    const addFriend = async () => {
        if(!currentUser) throw console.error("Error adding friend: no user found")
        await sendFriendRequest(currentUser.uid, profile.id)
    }

    return (
    <>
        {username && <PageTitle title={username} />}
        {!username && <PageTitle title="Profile" />}
        {!userLoggedIn && (<Navigate to="/login" />) }
            
        <div className="min-h-screen h-screen">
            <Navbar showNav={true} />

            {/* Main card */}
            <BodyCard>
                {loading ? (
                    <div className="flex justify-center items-center mt-32">
                        <span className="loading loading-infinity loading-lg"></span>
                    </div>
                ) : (
                    <div className="px-6">
                        <div className="card card-compact bg-[--b1] mx-auto mt-12 md:mt-48 w-full sm:w-[70%] md:w-[50%] lg:w-[40%] px-6 pb-6 rounded-xl flex flex-col items-center">
                            {/* User profile image */}
                            <img 
                                className="size-32 bg-[--b1] rounded-full -mt-12 mb-4" 
                                src={profile.iconURL} 
                                alt="User icon" 
                            />
                            {/* User details */}
                            <h1 className="text-2xl font-bold text-center">{username}</h1>
                            <p className="text-[#CACACA] mb-4 text-center">Rank #{rank}</p>
                            
                            {/* Button section */}
                            {buttonElement}
                        </div>
                    </div>
                )}
            </BodyCard>
        </div>

    </>
    )
}

export default Profile