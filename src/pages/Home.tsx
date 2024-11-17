import { Navigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useAuth } from "../contexts/authContext"

function Home() {
    const { currentUser, userLoggedIn } = useAuth()

    return (
        <>
            {!userLoggedIn && console.log("not logged in") }
            {!userLoggedIn && (<Navigate to="/login" />) }

            <div className="min-h-screen h-screen">
                <Navbar></Navbar>
                <div className="flex flex-col min-h-[calc(100vh-5rem)]">
                    <div className="container mx-auto mt-12 w-[90%] bg-[--btn-color] rounded-t-2xl shadow flex-1">
                        <h1 className="font-semibold text-center mt-24 text-4xl">Welcome to <span className="text-[--p]">LevelUp</span>!</h1>
                        <h1 className="font-semibold text-center mt-24 text-4xl">{currentUser?.email}</h1>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home