import { useState } from "react"
import { searchUsers } from "../firebase/auth"

function UserSearch() {
    const [searchTerm, setSearchTerm] = useState("")
    const [results, setResults] = useState<{ userID: string, username: string, iconURL: string }[]>([])
    const [loading, setLoading] = useState(false)

    const handleSearch = async (query: string) => {
        setSearchTerm(query)
        if(query.trim() === "") {
            setResults([])
            return
        }

        setLoading(true)
        const users = await searchUsers(query)
        setResults(users)
        setLoading(false)
    }

    return (
    <>
        <div className="relative w-full md:w-[50%] mx-auto mt-4">
            {/* Search Input */}
            <input
                type="text"
                className="input w-full p-2 rounded-full"
                placeholder="Search for users..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
            />

            {/* Dropdown Results */}
            {searchTerm && results.length > 0 && (
                <ul className="absolute bg-[--b1] w-full mt-2 rounded-full shadow-lg z-10">
                    {results.map((user) => (
                        <li
                            key={user.userID}
                            className="p-2 hover:bg-[--btn-color] cursor-pointer"
                            onClick={() => window.location.href = `/profile/${user.username}`} // Navigate to the user's profile page
                        >
                            <div>
                                <strong>{user.username}</strong>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {/* Loading Indicator */}
            {loading && (
                <div className="absolute bg-[--b1] w-full mt-2 rounded-full shadow-lg z-10 text-center text-gray-500 p-2">
                    Loading...
                </div>
            )}

            {/* No Results */}
            {searchTerm && !loading && results.length === 0 && (
                <div className="absolute bg-[--b1] w-full mt-2 rounded-full shadow-lg z-10 text-center text-gray-500 p-2">
                    No results found
                </div>
            )}
        </div>
    </>
    )
}

export default UserSearch