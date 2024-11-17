import { useState } from "react"
import Navbar from "../components/Navbar"
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { doSignInWithEmailAndPassword } from "../firebase/auth";

function Login() {
    const { userLoggedIn } = useAuth()
    
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isSigningIn, setIsSigningIn] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const signIn = async (e:React.FormEvent) => {
        e.preventDefault()
        if (!email || !password) {
            setErrorMessage("Please enter a username and password and try again.")
            return;
        }
        try {
            if (!isSigningIn) {
                setIsSigningIn(true)
                setErrorMessage("")
                await doSignInWithEmailAndPassword(email, password)
                // doSendEmailVerification()
            }
          } catch (error: any) {
            const errorCode = error.code;
            const errorMessage = error.message;
      
            console.log("errorCode:", errorCode, "errorMessage:", errorMessage);
            if(errorCode === "auth/invalid-credential") {
                setErrorMessage("The email and password you entered did not match our records. Please try again.")
            }
          }
    }

    return (
        <>
            {userLoggedIn && (<Navigate to={'/home'} replace={true} />)}

            <div className="min-h-screen h-screen">
                <Navbar></Navbar>
                <div className="flex flex-col min-h-[calc(100vh-5rem)]">
                    <div className="container mx-auto mt-12 w-[90%] bg-[--btn-color] rounded-t-2xl shadow flex-1">
                        <div className="flex flex-col my-24 bg-[--b1] px-16 rounded-2xl max-w-min py-16 mx-auto">
                            <h1 className="font-semibold text-4xl ml-2 ">Log in</h1>
                            <label className="text-gray-400 ml-2 my-2 min-w-max">Don't have an account yet? <Link to="/signup" className="text-[--p] underline">Sign Up</Link></label>
                            <form autoComplete="off" onSubmit={signIn}>
                                <label className="input rounded-full bg-[--btn-color]  flex items-center gap-2 max-w-xs">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
                                    <input required type="text" name="email" id="email" placeholder="Email" className="grow" autoComplete="false" onChange={(e) => setEmail(e.target.value)} />
                                </label>
                                <label className="input rounded-full bg-[--btn-color] flex items-center gap-2 max-w-xs mt-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70"><path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" /></svg>
                                    <input required type="password" name="password" id="password" placeholder="Password" className="grow" autoComplete="false" onChange={(e) => setPassword(e.target.value)} />
                                </label>
                                {/* CREATE FORGOT PASSWORD PAGE */}
                                <label className="max-w-xs w-full block mt-4 ml-2">Forgot Password?</label>
                                <label className="text-[#EC5657] ml-2 mt-4 max-w-xs">{errorMessage}</label>
                                <input className="btn rounded-full bg-[--p] border-none max-w-xs w-full mt-4" type="submit" value="Login"/>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login