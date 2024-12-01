import { Link, Navigate } from "react-router-dom"
import { useAuth } from "../contexts/authContext"
import PageTitle from "../components/PageTitle"
import BodyCard from "../components/BodyCard"
import Navbar from "../components/Navbar"

function LandingPage() {
    const { userLoggedIn } = useAuth()

    return (
        <>
            <PageTitle title="Landing" />
            {userLoggedIn && (<Navigate to="/home" />) }
            <Navbar showNav={false}></Navbar>

            {/* Main card */}
            <BodyCard>
                <div className="mx-8 h-full">
                    <h1 className="font-semibold text-center mt-8 text-4xl lg:mt-24">Welcome to <span className="text-[--p]">LevelUp</span>!</h1>
                    <h2 className="font-normal text-[#CACACA] text-center mt-8 text-xl w-[70%] mx-auto">LevelUp is an adaptive educational tool which harnesses the power of artificial intelligence to produce peronsalised learning experiences.</h2>
                    <Link className="mx-auto block text-center mt-4" to="/signup">
                        <div className="btn border-none bg-[--p] rounded-full">Get Started</div>
                    </Link>
                </div>
            </BodyCard>
        </>
    )
}

export default LandingPage

