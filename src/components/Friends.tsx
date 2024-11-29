import { Link } from "react-router-dom"

interface Props {
    data: { friendID: string, username: string, iconURL: string }[]
}

function Friends({ data }: Props) {
    let emptyData = Array.from({ length: 8 - data.length })

    return (
        <div
            className="grid gap-4"
            style={{
                gridTemplateColumns: "repeat(auto-fit, minmax(6rem, 1fr))", // At least 2 icons wide
                gridAutoRows: "auto",
            }}
        >
            {/* Render actual friends */}
            {data.map(({ username, iconURL }, index) => (
                <div
                className="text-center w-full max-w-[6rem] mx-auto"
                key={`friend-${index}`}
            >
                <Link to={"/profile/" + username}>
                    <img
                        className="w-24 h-24 bg-[--b1] rounded-full mx-auto object-cover"
                        src={iconURL}
                        alt="User icon"
                    />
                    <h3 className="text-md font-medium mt-2 truncate">
                        {username}
                    </h3>
                </Link>
            </div>
            ))}
            {/* Render placeholder slots */}
            {emptyData.map((_, index) => (
                <div
                className="text-center w-full max-w-[100px] mx-auto hidden sm:block"
                key={`placeholder-${index}`}
            >
                <div className="w-24 h-24 bg-[--b1] rounded-full mx-auto" />
                <h3 className="text-md font-medium mt-2 text-transparent">
                    Guest
                </h3>
            </div>
            ))}
        </div>
    )
}

export default Friends