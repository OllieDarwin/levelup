import { Link, Navigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useAuth } from "../contexts/authContext"
import BodyCard from "../components/BodyCard"

import quiz from "../assets/images/quiz.jpg"

function About() {
    const { userLoggedIn } = useAuth()
    
    return (
        <>
            {!userLoggedIn && (<Navigate to="/login" />) }

            <div className="min-h-screen h-screen">
                <Navbar showNav={true}></Navbar>
                <BodyCard>
                    <div className="flex w-full mx-auto justify-center gap-16 my-auto">
                        <Link to="/games/quiz">
                            <div className="card card-compact bg-[--b1] rounded-box place-items-center h-64 w-96">
                                <figure>
                                    <img src={quiz} alt="" />
                                </figure>
                                <div className="card-content py-6">
                                    <h1 className="card-title">Maths Quiz</h1>
                                </div>
                            </div>
                        </Link>
                        <Link to="/games">
                            <div className="card card-compact bg-[--b1] rounded-box place-items-center h-64 w-96">
                                <figure>
                                    <img src={quiz} alt="" />
                                </figure>
                                <div className="card-content py-6">
                                    <h1 className="card-title">Example Game</h1>
                                </div>
                            </div>
                        </Link>
                    </div>
                </BodyCard>
            </div>
        </>
    )
}

export default About