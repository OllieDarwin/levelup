import { Link, Navigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useAuth } from "../contexts/authContext"
import BodyCard from "../components/BodyCard"

import Leaderboard from "../components/Leaderboard"

function About() {
    const { userLoggedIn } = useAuth()
    
    return (
        <>
            {!userLoggedIn && (<Navigate to="/login" />) }

            <div className="min-h-screen h-screen">
                <Navbar showNav={true}></Navbar>
                <BodyCard>
                    <div className="flex mx-8 h-full my-auto">
                        <div className="grid grid-cols-2 mx-8 my-auto h-[90%] gap-8 w-full">
                            <Link to="/games/quiz">
                                <div className="card card-compact bg-[--b1] rounded-box place-items-center h-full">
                                    <figure>
                                    </figure>
                                    <div className="card-content py-6">
                                        <h1 className="card-title">Maths Quiz</h1>
                                    </div>
                                </div>
                            </Link>
                            <Link to="/games">
                                <div className="card card-compact bg-[--b1] rounded-box place-items-center h-full">
                                    <figure>
                                    </figure>
                                    <div className="card-content py-6">
                                        <h1 className="card-title">Example Game</h1>
                                    </div>
                                </div>
                            </Link>
                            <Link to="/games">
                                <div className="card card-compact bg-[--b1] rounded-box place-items-center h-full">
                                    <figure>
                                    </figure>
                                    <div className="card-content py-6">
                                        <h1 className="card-title">Example Game</h1>
                                    </div>
                                </div>
                            </Link>
                            <Link to="/games">
                                <div className="card card-compact bg-[--b1] rounded-box place-items-center h-full">
                                    <figure>
                                    </figure>
                                    <div className="card-content py-6">
                                        <h1 className="card-title">Example Game</h1>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <Leaderboard />
                    </div>
                </BodyCard>
            </div>
        </>
    )
}

export default About