import { Navigate, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useEffect, useState } from "react"
import { useAuth } from "../contexts/authContext"
import BodyCard from "../components/BodyCard"
import { doSignOut } from "../firebase/auth"
import PageTitle from "../components/PageTitle"

function Settings() {
    const { userLoggedIn } = useAuth()
    const navigate = useNavigate()

    const [useDyslexiaFont, setUseDyslexiaFont] = useState(false)

    useEffect(() => {
        const storedFont = localStorage.getItem("useDyslexiaFont")
        if(storedFont !== null) {
            setUseDyslexiaFont(storedFont === "true" ? true : false)
        }
    }, [])

    const handleToggle = () => {
        const storedFont = localStorage.getItem("useDyslexiaFont")
        localStorage.setItem("useDyslexiaFont", (storedFont === "true" ? "false" : "true"))
        setUseDyslexiaFont(storedFont === "true" ? false : true)
    }

    useEffect(() => {
        if(useDyslexiaFont) {
            document.body.classList.add("dyslexia")
            document.body.classList.remove("default-font")
        } else {
            document.body.classList.add("default-font")
            document.body.classList.remove("dyslexia")
        }
    }, [useDyslexiaFont])

    return (
        <>
            <PageTitle title="Settings" />
            {!userLoggedIn && (<Navigate to="/login" />) }
            
            <div className="min-h-screen h-screen">
                <Navbar showNav={true}></Navbar>

                {/* Main card */}
                <BodyCard>
                    <h1 className="font-semibold text-center mt-8 lg:mt-24 text-4xl">Settings</h1>
                    <div className="form-control">
                        <label className="label cursor-pointer w-[20%] mx-auto my-16">
                            <span className="label-text text-lg">Dyslexia-friendly font</span>
                            <input type="checkbox" onChange={handleToggle} checked={useDyslexiaFont} className="toggle checked:bg-[--p] checked:border-[--p] checked:text-[--p]" />
                        </label>
                    </div>
                    <button className="text-center text-lg bg-[--p] px-8 py-4 rounded-full block mx-auto" onClick={() => { doSignOut().then(() => {navigate("/login")}) }}>Sign out</button>
                </BodyCard>
            </div>
        </>
    )
}

export default Settings