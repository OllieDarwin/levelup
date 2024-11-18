import { Navigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useAuth } from "../contexts/authContext"

function About() {
    const { userLoggedIn } = useAuth()
    
    return (
        <>
            {!userLoggedIn && (<Navigate to="/login" />) }

            <div className="min-h-screen h-screen">
                <Navbar showNav={true}></Navbar>
                <div className="flex flex-col min-h-[calc(100vh-6.05rem)]">
                    <div className="container mx-auto mt-4 w-[90%] bg-[--btn-color] rounded-t-2xl shadow flex-1">
                        <h1 className="font-semibold text-center mt-24 text-4xl">About this project</h1>
                    </div>
                </div>
            </div>
        </>
    )
}

export default About