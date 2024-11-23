import { Navigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useAuth } from "../contexts/authContext"
import BodyCard from "../components/BodyCard"

function About() {
    const { userLoggedIn } = useAuth()
    
    return (
        <>
            {!userLoggedIn && (<Navigate to="/login" />) }

            <div className="min-h-screen h-screen">
                <Navbar showNav={true}></Navbar>
                <BodyCard>
                    <h1 className="font-semibold text-center mt-24 text-4xl">About this project</h1>
                </BodyCard>
            </div>
        </>
    )
}

export default About