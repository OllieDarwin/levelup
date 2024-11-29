import { Link, Navigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useAuth } from "../contexts/authContext"
import BodyCard from "../components/BodyCard"

import Leaderboard from "../components/Leaderboard"

function Games() {
    const { userLoggedIn } = useAuth()
    
    return (
        <>
            {!userLoggedIn && <Navigate to="/login" />}

            <div className="min-h-screen">
                <Navbar showNav={true}></Navbar>
                <BodyCard>
                    <div className="p-4 block mt-8 max-md:mt-0">
                        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 h-full">
                            {/* Games Section */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                                <Link to="/games/quiz">
                                    <div className="card card-compact bg-[--b1] rounded-box place-items-center h-full">
                                        <div className="card-content py-6">
                                            <h1 className="card-title">Maths Quiz</h1>
                                        </div>
                                    </div>
                                </Link>
                                <Link to="/games">
                                    <div className="card card-compact bg-[--b1] rounded-box place-items-center h-full">
                                        <div className="card-content py-6">
                                            <h1 className="card-title">Example Game</h1>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                            {/* Leaderboard Section */}
                            <Leaderboard /> 
                        </div>
                    </div>
                </BodyCard>
            </div>
        </>
    )
}

export default Games