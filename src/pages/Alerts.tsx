import { Link, Navigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useAuth } from "../contexts/authContext"
import BodyCard from "../components/BodyCard"
import { useEffect, useState } from "react"
import { acceptFriendRequest, getFriendRequests, ignoreFriendRequest } from "../firebase/auth"
import { Timestamp } from "firebase/firestore"
import PageTitle from "../components/PageTitle"

function Alerts() {
    const { currentUser, userLoggedIn } = useAuth()
    const [friendRequests, setFriendRequests] = useState<{ friendID: string; friendName: string; sentAt: Timestamp; status: "pending" | "received"; iconURL: string }[]>([]);

    const loadFriendRequests = async () => {
        if (!currentUser) return console.error("No user found")
        try {
            const requests = await getFriendRequests(currentUser.uid)
            setFriendRequests(requests)
        } catch (error) {
            console.error("Error loading friend requests:", error)
        }
    };

    // Get friend requests
    useEffect(() => {
        loadFriendRequests()
    }, []);

    // Handle accepting a friend request
    const handleAcceptRequest = async (friendID: string) => {
        if (!currentUser) return console.error("No user found")
        try {
            await acceptFriendRequest(currentUser.uid, friendID)
            // Remove the request from the local state
            setFriendRequests((prevRequests) =>
                prevRequests.filter((request) => request.friendID !== friendID)
            )
        } catch (error) {
            console.error("Error accepting friend request:", error)
        }
    }

    // Handle ignoring a friend request
    const handleIgnoreRequest = async (friendID: string) => {
        if (!currentUser) return console.error("No user found")
        try {
            await ignoreFriendRequest(currentUser.uid, friendID)
            // Remove the request from the local state
            setFriendRequests((prevRequests) =>
                prevRequests.filter((request) => request.friendID !== friendID)
            )
        } catch (error) {
            console.error("Error ignoring friend request:", error)
        }
    }

    // Filter friend requests to only display "received" requests
    const receivedRequests = friendRequests.filter((request) => request.status === "received")

    return (
        <>
            <PageTitle title="Alerts" />
            {!userLoggedIn && <Navigate to="/login" />}

            <div className="min-h-screen h-screen">
                <Navbar showNav={true}></Navbar>
                <BodyCard>
                    <h1 className="font-semibold text-center mt-8 lg:mt-24 text-4xl mb-8">Alerts:</h1>
                    {receivedRequests.length === 0 ? <p className="text-center text-[#CACACA] text-xl">You have no alerts.</p>
                    : (receivedRequests.map((request) => (
                        <div key={request.friendID} className="bg-[--b1] flex flex-col md:flex-row items-center md:items-start rounded-2xl py-4 mx-4 mb-2">
                            {/* Profile Picture */}
                            <Link
                                className="mb-4 md:my-auto md:mx-8 w-24 h-24 flex-shrink-0"
                                to={`/profile/${request.friendName}`}
                            >
                                <img
                                    className="w-24 h-24 object-cover bg-[--b1] rounded-full"
                                    src={window.location.origin + (request.iconURL || "/user-icons/1.png")}
                                    alt="User icon"
                                />
                            </Link>
                        
                            {/* Text and Buttons */}
                            <div className="text-center md:text-left w-full">
                                <h1 className="font-bold text-lg mb-2 max-md:mx-4 mx-0">
                                    <Link to={`/profile/${request.friendName}`}>
                                        {request.friendName}
                                    </Link>{" "}
                                    has added you as a friend.
                                </h1>
                                <h2 className="text-[#CACACA] mb-4">
                                    Would you like to accept?
                                </h2>
                                <div className="flex justify-center md:justify-start space-x-4">
                                    <div
                                        className="btn border-none bg-[--p] rounded-full px-8"
                                        onClick={() => handleAcceptRequest(request.friendID)}
                                    >
                                        Accept
                                    </div>
                                    <div
                                        className="btn border-none bg-[--btn-color] rounded-full px-8"
                                        onClick={() => handleIgnoreRequest(request.friendID)}
                                    >
                                        Ignore
                                    </div>
                                </div>
                            </div>
                        </div>
                    )))}
                </BodyCard>
            </div>
        </>
    );
}

export default Alerts
