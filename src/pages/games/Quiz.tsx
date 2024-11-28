import { Link, Navigate } from "react-router-dom"
import Navbar from "../../components/Navbar"
import { useAuth } from "../../contexts/authContext"
import BodyCard from "../../components/BodyCard"

import { useEffect, useState } from "react"
import { generateQuestion, getSolution } from "../../services/aiService"
import { fetchUserProfile, saveUserProfile } from "../../firebase/auth"

function Quiz() {

    // User state
    const { currentUser, userLoggedIn } = useAuth()
    const [currentXP, setCurrentXP] = useState(0)

    useEffect(() => {
        const loadUserProfile = async () => {
            if (currentUser) {
                const profile = await fetchUserProfile(currentUser.uid)
                if(profile !== null) {
                    setCurrentXP(profile.xp)
                }
            }
        }

        loadUserProfile()
    }, [userLoggedIn])

    // Current question state
    const [question, setQuestion] = useState<{ question: string, title: string, description: string }>({question: "", title: "", description: ""})
    const [userSolution, setUserSolution] = useState("")
    const [loadingSolution, setLoadingSolution] = useState(false)
    const [solution, setSolution] = useState<null | { correct: boolean, response: string }>(null)
    const [textAreaText, setTextAreaText] = useState("")
    const [loadingQuestion, setLoadingQuestion] = useState(true)

    // Overall game state
    const [playing, setPlaying] = useState(false)
    const [leftoverTime, setLeftoverTime] = useState(60)
    const [score, setScore] = useState(0)
    const [showScore, setShowScore] = useState(false)
    const [gameEnded, setGameEnded] = useState(false)
    const [timeTicking, setTimeTicking] = useState(true)

    // Timer
    useEffect(() => {
        let timer: NodeJS.Timeout
        if (playing && leftoverTime > 0 && timeTicking) {
            timer = setInterval(() => {
                setLeftoverTime((t) => t - 1)
            }, 1000);
        } else if (leftoverTime === 0) {
            endGame()
        }
        return () => clearInterval(timer);
    }, [playing, leftoverTime, timeTicking]);


    const startGame = () => {
        setPlaying(true)
    }

    const endGame = async () => {
        setGameEnded(true)
        setPlaying(false)
        setShowScore(true)
        if (currentUser !== null) {
            await saveUserProfile(currentUser?.uid, {xp: currentXP + score})
        }
    }

    const loadQuestion = async () => {
        setLoadingQuestion(true)
        const question = await generateQuestion()
        setQuestion(question)
        setLoadingQuestion(false)
    }

    const handleSubmit = async () => {
        setTimeTicking(false)
        setLoadingSolution(true)
        let retries = 3
        let solutionResponse = null
    
        while (retries > 0) {
            try {
                const solution = await getSolution(question?.question, userSolution)
                solutionResponse = solution // Store the solution if successful
                break // Exit the loop on success
            } catch (error) {
                console.error(`Attempt failed. Retries left: ${retries - 1}`, error)
                retries--
                if (retries === 0) {
                    setSolution({
                        correct: false,
                        response: "An error occurred while processing your solution. Please try again later.",
                    });
                    setLoadingSolution(false)
                    return // Exit the function after displaying the error
                }
            }
        }
    
        setSolution(solutionResponse) // Set the solution if successful
        setLoadingSolution(false)
    
        // Increment score if correct
        if (solutionResponse?.correct) {
            setScore((currentScore) => currentScore + 5000);
        }
    };
    

    const handleNextQuestion = () => {
        loadQuestion()
        setTextAreaText("")
        setSolution(null)
        setTimeTicking(true)
    }

    useEffect(() => {
        loadQuestion()
        // setLoadingQuestion(false)
    }, [])

    return (
        <>
            {!userLoggedIn && (<Navigate to="/login" />) }
            
            <div className="min-h-screen h-screen">
                {/* Navigation */}
                <Navbar showNav={true}></Navbar>

                {/* Main Game */}
                <BodyCard>
                    {/* Game bar */}
                    <div className="navbar w-[80%] fixed left-[50%] translate-x-[-50%] mt-8">
                        <div className="navbar-start">
                            {playing && !gameEnded ?
                            <div className="btn pointer-events-none bg-[--b1] border-none px-8 py-2 rounded-full">{ score.toLocaleString() }</div>
                            :
                            <button className="btn bg-[--p] border-none rounded-full px-8" onClick={startGame}>Start</button>
                            }
                            
                        </div>
                        <div className="navbar-end">
                            <div className="btn pointer-events-none bg-[--b1] border-none px-8 py-2 rounded-full">{ Math.floor(leftoverTime / 60) }:{ String(leftoverTime % 60).padStart(2, '0') }</div>
                        </div>
                    </div>
                    {/* End Game area */}
                    {showScore && 
                    <div className="card card-compact fixed left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%] z-10 shadow-xl bg-[--btn-color] w-[30%]">
                        <div className="card-body mx-auto text-center">
                            <h2 className="text-2xl font-medium mt-8">Well done!</h2>
                            <h1 className="text-4xl font-semibold">Score: <span className="text-[--p]">{ score.toLocaleString() }</span></h1>
                            <Link to="/home">
                                <button className="btn rounded-full bg-[--p] border-none my-8 px-8">Go back</button>
                            </Link>
                        </div>
                    </div>
                    }
                    {/* Main game question */}
                    <div className={(!playing && "blur-sm pointer-events-none") + " flex flex-col items-center my-auto"}>
                        {/* Question display */}
                        <div className="card card-compact bg-[--btn-color] w-[50%] shadow-xl mx-auto">
                            <figure className="bg-[--b1] h-36 px-16 text-center">
                                {loadingQuestion === true ?
                                <span className="loading loading-infinity loading-lg"></span>
                                :
                                <p>{question.question}</p>
                                }
                                
                            </figure>
                            <div className="card-body">
                                {loadingQuestion === true ?
                                <></>
                                :
                                <>
                                    <h2 className="card-title">{question.title}</h2>
                                    <p className="text-[#CACACA]">{question.description}</p>
                                </>
                                }
                            </div>
                        </div>
                        {/* Text area & solution area */}
                        <div className="flex w-[50%] mx-auto gap-4 min-h-36 mb-8">
                            <textarea name="solution" id="solution" className={(solution !== null ? "w-1/3" : "w-full") + " textarea mt-8 h-full"} value={textAreaText} placeholder="Write your solution here" onChange={(e) => {
                                setUserSolution(e.target.value)
                                setTextAreaText(e.target.value)
                            }}></textarea>
                            {solution !== null &&
                            <>
                                <div className="card card-compact mt-8 bg-[--b1] w-2/3 min-h-full">
                                    <div className="card-body flex-none">
                                        <h2 className="card-title">Solution:</h2>
                                        {loadingSolution ? 
                                            <span className="loading loading-infinity loading-lg"></span>
                                        : 
                                        <>
                                            { solution.correct ? <p className="text-green-500 mb-0">Correct! ✔</p> : <p className="text-red-500 mb-0">Incorrect. ✘</p> }
                                            <p>{solution.response}</p>
                                        </>}
                                    </div>
                                </div>
                            </>
                            }
                        </div>
                        {/* Action button */}
                        {
                            loadingSolution ?
                                <button className="btn rounded-full bg-[--p] border-none w-[50%] mt-4 mx-auto" type="submit"><span className="loading loading-infinity loading-lg"></span></button>
                            : (solution === null ?
                                <button className="btn rounded-full bg-[--p] border-none w-[50%] mt-4 mx-auto" type="submit" onClick={handleSubmit}>Mark Solution</button>
                            :
                                <button className="btn rounded-full bg-[--p] border-none w-[50%] mt-4 mx-auto" type="submit" onClick={handleNextQuestion}>Next Question</button>
                            )
                        }
                    </div>
                </BodyCard>
            </div>
        </>
    )
}

export default Quiz 