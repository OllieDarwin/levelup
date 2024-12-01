import { useState } from "react"
import BodyCard from "../components/BodyCard"
import Navbar from "../components/Navbar"
import PageTitle from "../components/PageTitle"
import { doPasswordReset } from "../firebase/auth"

function PasswordReset () {

    const [email, setEmail] = useState("")
    const [sent, setSent] = useState(false)

    const sendEmail = async (e: React.FormEvent) => {
        e.preventDefault()
        await doPasswordReset(email)
        setSent(true)
        return
    }

    return (
        <>
            <PageTitle title="Reset Password" />
            <Navbar showNav={false}></Navbar>

            {/* Main card */}
            <BodyCard>
                <div className="mx-8 h-full">
                    <h1 className="font-semibold text-center mt-8 text-4xl lg:mt-24 mb-12">Reset Password</h1>
                    {!sent ? 
                    <form autoComplete="off" onSubmit={sendEmail}>
                        <label className="input rounded-full bg-[--b1] flex items-center gap-2 max-w-xs mx-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
                            <input required type="text" name="email" id="email" placeholder="Email" className="grow" autoComplete="false" onChange={(e) => setEmail(e.target.value)} />
                        </label>
                        <input className="btn rounded-full bg-[--p] border-none max-w-xs w-full mt-4 mx-auto block" type="submit" value="Send"/>
                        </form>
                    :
                    <div className="text-center text-lg text-[#CACACA]">
                        Thanks! Please check your email.
                    </div>
                    }
                </div>
            </BodyCard>
        </>
    )
}

export default PasswordReset