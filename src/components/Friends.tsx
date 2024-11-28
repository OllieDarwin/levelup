import { Link } from "react-router-dom"

interface Props {
    data: { friendID: string, username: string, iconURL: string }[]
}

function Friends({ data }: Props) {
    let emptyData = []
    for (let i=1; i<=8-data.length; i++) {
        emptyData.push(0)
    }

    return (
        <div className="flex justify-around">
            { data.map(({ username, iconURL }) => (
                <div className="text-center flex">
                    <Link to={"/profile/" + username}>
                        <img className="size-28 bg-[--b1] rounded-full mx-auto" src={window.location.origin + iconURL} alt="User icon"  />
                        <h3 className="text-md font-medium mt-2">{username}</h3>
                    </Link>
                </div>
            ))}
            { emptyData.map(() => (
                <div className="text-center flex">
                    <div className="size-28 bg-[--b1] rounded-full mx-auto" />
                    <h3 className="text-md font-medium mt-2"></h3>
                </div>
            ))}
        </div>
    )
}

export default Friends