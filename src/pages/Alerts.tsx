import { Link, Navigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useAuth } from "../contexts/authContext"
import BodyCard from "../components/BodyCard"
import { useEffect, useState } from "react"
import { acceptFriendRequest, getFriendRequests, ignoreFriendRequest } from "../firebase/auth"
import { Timestamp } from "firebase/firestore"

function Alerts() {
    const { currentUser, userLoggedIn } = useAuth()
    const [friendRequests, setFriendRequests] = useState<{friendID: string, friendName: string, sentAt: Timestamp, status: "pending" | "received", iconURL: string}[]>([])

    const loadFriendRequests = async () => {
        if (!currentUser) throw console.error("No user found")
        try {   
            const requests = await getFriendRequests(currentUser.uid)
            setFriendRequests(requests)
        } catch (error) {
            console.error("Error loading friend requests:", error)
            throw error
        }
    }

    // Get friend requests
    useEffect(() => {
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
                                        <Link className=" mx-8 my-auto" to={"/profile/"+request.friendName}>
                                            <img className="size-24 bg-white rounded-full" src={window.location.origin + (request.iconURL || "/user-icons/1.png")} alt="User icon" />
                                        </Link>
                                        <div>
                                            <h1 className="font-bold text-lg"><Link to={"/profile/"+request.friendName}>{request.friendName}</Link> has added you as a friend.</h1>
                                            <h2 className="text-[#CACACA] mb-4">Would you like to accept?</h2>
                                            <div className="btn border-none bg-[--p] mr-4" onClick={() => {
                                                acceptFriendRequest(currentUser?.uid, request.friendID)
                                                loadFriendRequests()
                                            }}>Accept</div>
                                            <div className="btn border-none bg-[--btn-color]" onClick={() => {
                                                ignoreFriendRequest(currentUser?.uid, request.friendID)
                                                loadFriendRequests()
                                            }}>Ignore</div>
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