import { Navigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useAuth } from "../contexts/authContext"
import BodyCard from "../components/BodyCard"
import { useEffect, useState } from "react"
import { acceptFriendRequest, getFriendRequests, getUserIconFromID, ignoreFriendRequest } from "../firebase/auth"
import { Timestamp } from "firebase/firestore"

function Alerts() {
    const { currentUser, userLoggedIn } = useAuth()
    const [friendRequests, setFriendRequests] = useState<{friendID: string, friendName: string, sentAt: Timestamp, status: "pending" | "received", iconURL: string}[]>([])

    // Get friend requests
    useEffect(() => {
        if (!currentUser) throw console.error("No user found")
        const loadFriendRequests = async () => {
            try {   
                const requests = await getFriendRequests(currentUser.uid)
                setFriendRequests(requests)
            } catch (error) {
                console.error("Error loading friend requests:", error)
                throw error
            }
        }
        loadFriendRequests()
    }, [])
    
    return (
        <>
            {!userLoggedIn && (<Navigate to="/login" />) }

            <div className="min-h-screen h-screen">
                <Navbar showNav={true}></Navbar>
                <BodyCard>
                    <h1 className="font-semibold text-center mt-24 text-4xl mb-8">Alerts:</h1>
                    {friendRequests.length === 0 && <>
                        <p className="text-center text-[#CACACA] text-xl">You have no alerts.</p>
                    </>}
                    {currentUser && friendRequests.map((request) => (
                        <>
                            {request.status === "received" && 
                                <>
                                    <div className="bg-[--b1] flex rounded-2xl py-4 mx-8">
                                        <img className="size-24 bg-white rounded-full mx-8 my-auto" src={request.iconURL || "/src/assets/user-icons/1.png"} alt="User icon" />
                                        <div>
                                            <h1 className="font-bold text-lg">{request.friendName} has added you as a friend.</h1>
                                            <h2 className="text-[#CACACA] mb-4">Would you like to accept?</h2>
                                            <div className="btn border-none bg-[--p] mr-4" onClick={() => acceptFriendRequest(currentUser?.uid, request.friendID)}>Accept</div>
                                            <div className="btn border-none bg-[--btn-color]" onClick={() => ignoreFriendRequest(currentUser?.uid, request.friendID)}>Ignore</div>
                                        </div>
                                    </div>
                                </>
                            }
                        </>
                    ))}
                </BodyCard>
            </div>
        </>
    )
}

export default Alerts