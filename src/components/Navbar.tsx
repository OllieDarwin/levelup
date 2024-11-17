import { Link, useLocation, useNavigate } from "react-router-dom"
import levelup from "../assets/images/levelup.svg"
import { useEffect, useState } from "react"
import { useAuth } from "../contexts/authContext"
import { doSignOut } from "../firebase/auth"

function Navbar() {
    const location = useLocation()
    const [url, setUrl] = useState("")
    useEffect(() => {
        setUrl(location.pathname)
    }, [location])

    const { userLoggedIn } = useAuth()
    const navigate = useNavigate()

    return (
        <>
            <div className="navbar px-[3%]">
                <div className="navbar-start">
                    <Link to="/">
                        <img className="h-16" src={levelup} alt="LevelUp" />
                    </Link>
                </div>
                <div className="navbar-center">
                    <div className="join join-horizontal rounded-full bg-[#1E1E1E]">
                        <Link to="/home">
                            <div className="btn join-item px-6 border-none">
                                    <svg className={"feather feather-home size-6 " + (url === "/home" ? "stroke-[--p]" : "stroke-white")} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" strokeWidth="2" ><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                            </div>
                        </Link>
                        <Link to="/about">
                            <div className="btn join-item px-6 border-none">
                                    <svg className={"feather feather-home size-6 " + (url === "/about" ? "stroke-[--p]" : "stroke-white")} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"  fill="none" stroke="currentColor" strokeWidth="2" ><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                            </div>
                        </Link>
                        <div className="btn join-item px-6 border-none">
                            <svg className="feather feather-home stroke-white hover:stroke-gray-400 size-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" ><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                        </div>
                        <div className="btn join-item px-6 border-none">
                            <svg className="feather feather-home stroke-white hover:stroke-gray-400 size-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" ><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        </div>
                        <div className="btn join-item px-6 border-none">
                            <svg className="feather feather-home stroke-white hover:stroke-gray-400 size-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" ><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                        </div>
                    </div>
                </div>
                <div className="navbar-end">
                    
                    {
                        userLoggedIn
                            ? 
                            <>
                                <button onClick={() => { doSignOut().then(() => {navigate("/login")}) }}>Sign out</button>
                            </>
                            :
                            <>
                                <Link to="/login">
                                    Login
                                </Link>
                            </>
                            
                    }
                </div>
            </div>
        </>
    )
}

export default Navbar