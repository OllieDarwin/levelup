import { Link, useLocation, useNavigate } from "react-router-dom"
import levelup from "../assets/images/levelup.svg"
import levelupicon from "../assets/images/levelup-icon.svg"
import { useEffect, useState } from "react"
import { useAuth } from "../contexts/authContext"
import { doSignOut } from "../firebase/auth"

interface Props {
    showNav: boolean
}

function Navbar({ showNav }: Props) {
    const location = useLocation()
    const [url, setUrl] = useState("")
    useEffect(() => {
        setUrl(location.pathname)
    }, [location])

    const { userLoggedIn } = useAuth()
    const navigate = useNavigate()

    return (
        <>
            {/* Desktop Navbar */}
            <div className="navbar px-[3%] h-[6.05rem] max-md:hidden flex">
                <div className="navbar-start mb-auto mt-2">
                    <Link to="/">
                        <img className="h-16" src={levelup} alt="LevelUp" />
                    </Link>
                </div>
                {showNav && 
                <>
                    <div className="navbar-center">
                        <div className="flex flex-col items-center mt-4">
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
                                    <svg className="feather feather-home stroke-white size-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" ><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                </div>
                                <div className="btn join-item px-6 border-none">
                                    <svg className="feather feather-home stroke-white size-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" ><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                </div>
                                <div className="btn join-item px-6 border-none">
                                    <svg className="feather feather-home stroke-white size-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" ><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                                </div>
                            </div>
                            <div className="join gap-4 mt-2">
                                {url == "/home" ?
                                    <div className="rounded-full px-3 py-1 bg-[--btn-color] w-14">
                                        <p className="text-[0.6rem] text-center">Home</p>
                                    </div>
                                :
                                    <div className="rounded-full px-3 py-1 w-14">
                                    </div>
                                }
                                {url == "/about" ?
                                    <div className="rounded-full px-3 py-1 bg-[--btn-color] w-14">
                                        <p className="text-[0.6rem] text-center">Alerts</p>
                                    </div>
                                :
                                    <div className="rounded-full px-3 py-1 w-14">
                                    </div>
                                }
                                {url == "/play" ?
                                    <div className="rounded-full px-3 py-1 bg-[--btn-color] w-14">
                                        <p className="text-[0.6rem] text-center">Play</p>
                                    </div>
                                :
                                    <div className="rounded-full px-3 py-1 w-14">
                                    </div>
                                }
                                {url == "/profile" ?
                                    <div className="rounded-full px-3 py-1 bg-[--btn-color] w-14">
                                        <p className="text-[0.6rem] text-center">Profile</p>
                                    </div>
                                :
                                    <div className="rounded-full px-3 py-1 w-14">
                                    </div>
                                }
                                {url == "/settings" ?
                                    <div className="rounded-full px-3 py-1 bg-[--btn-color] w-14">
                                        <p className="text-[0.6rem] text-center">Settings</p>
                                    </div>
                                :
                                    <div className="rounded-full px-3 py-1 w-14">
                                    </div>
                                }
                            </div>
                        </div> 
                    </div>
                </>}
                <div className="navbar-end mb-auto mt-6">
                    
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
            {/* Tablet & Phone */}
            <div className="navbar px-[3%]h-[6.05rem] md:hidden">
                <div className="navbar-start">
                    <div className="navbar-start mb-auto mt-2">
                        <Link to="/">
                            <img className="h-8 mt-2 ml-5" src={levelupicon} alt="LevelUp" />
                        </Link>
                    </div>
                </div>
                <div className="navbar-center">
                    <div className="flex flex-col items-center mt-4">
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
                                <svg className="feather feather-home stroke-white size-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" ><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                            </div>
                            <div className="btn join-item px-6 border-none">
                                <svg className="feather feather-home stroke-white size-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" ><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            </div>
                            <div className="btn join-item px-6 border-none">
                                <svg className="feather feather-home stroke-white size-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" ><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                            </div>
                        </div>
                    </div> 
                </div>
                <div className="navbar-end"></div>
            </div>
        </>
    )
}

export default Navbar