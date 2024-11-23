import { Link, Navigate } from "react-router-dom"
import Navbar from "../../components/Navbar"
import { useAuth } from "../../contexts/authContext"
import BodyCard from "../../components/BodyCard"

import { useEffect, useState } from "react"
import { generateQuestion, getSolution } from "../../services/aiService"

const defaultQuestion = {
    "question": "What is 40% of 120?",
    "title": "Calculating Percentages",
    "description": "This question tests your ability to calculate percentages. To find 40% of a number, you can use the following method: first convert the percentage to a fraction by dividing it by 100, so 40% becomes 0.40. Then multiply this by the total number which is 120 in this case."
}

function Quiz() {
    const { userLoggedIn } = useAuth()

    // Current question state
    const [question, setQuestion] = useState<{ question: string, title: string, description: string }>(defaultQuestion)
    const [userSolution, setUserSolution] = useState("")
    const [solution, setSolution] = useState<null | { correct: boolean, response: string }>(null)
    const [textAreaText, setTextAreaText] = useState("")
    const [loadingQuestion, setLoadingQuestion] = useState(true)

    // Overall game state
    const [playing, setPlaying] = useState(false)
    const [leftoverTime, setLeftoverTime] = useState(180)
    const [score, setScore] = useState(0)
    const [showScore, setShowScore] = useState(false)

    // Timer
    useEffect(() => {
        let timer: NodeJS.Timeout
        if (playing && leftoverTime > 0) {
            timer = setInterval(() => {
                setLeftoverTime((t) => t - 1)
            }, 1000);
        } else if (leftoverTime === 0) {
            endGame()
        }
        return () => clearInterval(timer);
    }, [playing, leftoverTime]);


    const startGame = () => {
        setPlaying(true)
    }

    const endGame = () => {
        setPlaying(false)
        console.log(score)
        setShowScore(true)
    }

    const loadQuestion = async () => {
        setLoadingQuestion(true)
        const question = await generateQuestion()
        setQuestion(question)
        setLoadingQuestion(false)
    }

    const handleSubmit = async () => {
        const solution = await getSolution(question?.question, userSolution)
        setSolution(solution)
        if(solution.correct) {
            setScore((currentScore) => currentScore + 5000)
        }
    }

    const handleNextQuestion = () => {
        loadQuestion()
        setTextAreaText("")
        setSolution(null)
    }

    useEffect(() => {
        // loadQuestion()
        setLoadingQuestion(false)
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
                    <div className="navbar w-[80%] fixed left-[50%] translate-x-[-50%] mt-6">
                        <div className="navbar-start">
                            {!playing ? 
                            <button className="btn bg-[--p] border-none rounded-full px-8" onClick={startGame}>Start</button>
                            :
                            <button className="btn bg-[--warning] border-none rounded-full px-8" onClick={endGame}>End</button>}
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
                            <h1 className="text-4xl font-semibold">Score: <span className="text-[--p]">{score.toLocaleString()}</span></h1>
                            <Link to="/home">
                                <button className="btn rounded-full bg-[--p] border-none my-8 px-8">Go back</button>
                            </Link>
                        </div>
                    </div>
                    }
                    {/* Main game question */}
                    <div className={(!playing && "blur-sm pointer-events-none") + " flex flex-col items-center"}>
                        {/* Question display */}
                        <div className="card card-compact bg-[--btn-color] w-[50%] shadow-xl mx-auto mt-16">
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
                                    <p>{question.description}</p>
                                </>
                                }
                            </div>
                        </div>
                        {/* Text area & solution area */}
                        <div className="flex w-[50%] mx-auto gap-4">
                            <textarea name="solution" id="solution" className={(solution !== null ? "w-1/2" : "w-full") + " textarea mt-8 h-48"} value={textAreaText} placeholder="Write your solution here" onChange={(e) => {
                                setUserSolution(e.target.value)
                                setTextAreaText(e.target.value)
                            }}></textarea>
                            {solution !== null &&
                            <>
                                <div className="card card-compact mt-8 bg-[--b1] w-1/2 h-48">
                                    <div className="card-body">
                                        <h2 className="card-title">Solution:</h2>
                                        { solution.correct ? 
                                        <>
                                            <p className="text-green-500">Correct! ✔</p>
                                        </>
                                        :
                                        <>
                                            <p className="text-red-500">Incorrect. ✘</p>
                                        </>
                                        }
                                        <p>{solution.response}</p>
                                    </div>
                                </div>
                            </>
                            }
                        </div>
                        {/* Action button */}
                        {solution === null ?
                        <button className="btn rounded-full bg-[--p] border-none w-[50%] mt-4 mx-auto" type="submit" onClick={handleSubmit}>Mark Solution</button>
                        :
                        <button className="btn rounded-full bg-[--p] border-none w-[50%] mt-4 mx-auto" type="submit" onClick={handleNextQuestion}>Next Question</button>
                        }
                    </div>
                </BodyCard>
            </div>
        </>
    )
}

export default Quiz 