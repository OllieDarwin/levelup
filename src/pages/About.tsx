import Navbar from "../components/Navbar"

function About() {
    return (
        <div className="min-h-screen h-screen">
            <Navbar></Navbar>
            <div className="flex flex-col min-h-[calc(100vh-5rem)]">
                <div className="container mx-auto mt-12 w-[90%] bg-[--btn-color] rounded-t-2xl shadow flex-1">
                     <h1 className="font-semibold text-center mt-24 text-4xl">About this project</h1>
                </div>
            </div>
        </div>
    )
}

export default About