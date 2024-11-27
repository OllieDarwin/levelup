import { Navigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useEffect, useState } from "react"
import { useAuth } from "../contexts/authContext"
import BodyCard from "../components/BodyCard"

function Settings() {
    const { userLoggedIn } = useAuth()

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
            {!userLoggedIn && (<Navigate to="/login" />) }
            
            <div className="min-h-screen h-screen">
                <Navbar showNav={true}></Navbar>

                {/* Main card */}
                <BodyCard>
                    <h1 className="font-semibold text-center mt-24 text-4xl">Settings</h1>
                    <div className="form-control">
                        <label className="label cursor-pointer w-[20%] mx-auto my-16">
                            <span className="label-text text-lg">Dyslexia-friendly font</span>
                            <input type="checkbox" onChange={handleToggle} checked={useDyslexiaFont} className="toggle checked:bg-[--p] checked:border-[--p] checked:text-[--p]" />
                        </label>
                    </div>
                </BodyCard>
            </div>
        </>
    )
}

export default Settings