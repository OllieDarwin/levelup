import { Navigate, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useEffect, useState } from "react"
import { useAuth } from "../contexts/authContext"
import BodyCard from "../components/BodyCard"
import { doSignOut, fetchUserSettings, saveUserSettings } from "../firebase/auth"
import PageTitle from "../components/PageTitle"

function Settings() {
    const { currentUser, userLoggedIn } = useAuth()
    const navigate = useNavigate()

    const [useDyslexiaFont, setUseDyslexiaFont] = useState(false)
    const [userInput, setUserInput] = useState("")
    const [loading, setLoading] = useState(false);

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

    useEffect(() => {
        const loadSettings = async () => {
            if (currentUser) {
                const settings = await fetchUserSettings(currentUser.uid)
                setUserInput(settings?.studyTopics || "")
            }
        };
        loadSettings()
    }, [currentUser])

    const handleSave = async () => {
        setLoading(true)
        if(currentUser) {
            await saveUserSettings(currentUser.uid, { studyTopics: userInput })
        }
        setLoading(false)
    };

    return (
        <>
            <PageTitle title="Settings" />
            {!userLoggedIn && <Navigate to="/login" />}

            <div className="min-h-screen h-screen flex flex-col">
                <Navbar showNav={true} />

                {/* Main card */}
                <BodyCard>
                    <h1 className="font-semibold text-center mt-8 lg:mt-12 text-3xl lg:text-4xl">Settings</h1>

                    {/* Dyslexia Font Toggle */}
                    <div className="form-control flex items-center justify-center mt-12">
                        <label className="label cursor-pointer w-[90%] md:w-[60%] lg:w-[40%] flex justify-between items-center">
                            <span className="label-text text-base lg:text-lg text-[#CACACA]">Dyslexia-friendly font</span>
                            <input
                                type="checkbox"
                                onChange={handleToggle}
                                checked={useDyslexiaFont}
                                className="toggle checked:bg-[--p] checked:border-[--p] checked:text-[--p]"
                            />
                        </label>
                    </div>

                    {/* Study Topics Textarea */}
                    <div className="flex flex-col items-center mt-8">
                        <textarea
                            className="textarea w-[90%] md:w-[75%] lg:w-[50%] h-32 md:h-40 border rounded-md p-4 resize-none"
                            placeholder="Describe your course, topics you're studying, and areas you'd like to practice."
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                        />
                        <button
                            className="btn bg-[--p] border-none mt-4 px-6 py-2 rounded-full w-[50%] md:w-[30%] lg:w-[20%]"
                            onClick={handleSave}
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>

                    {/* Sign Out Button */}
                    <button
                        className="btn text-center border-none bg-[--warning] px-6 py-2 rounded-full block mx-auto mt-8 w-[50%] md:w-[30%] lg:w-[20%]"
                        onClick={() => {
                            doSignOut().then(() => {
                                navigate("/login");
                            });
                        }}
                    >
                        Sign out
                    </button>
                </BodyCard>
            </div>
        </>
    )
}

export default Settings