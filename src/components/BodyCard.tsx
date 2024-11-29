interface Props {
    children: React.ReactNode
}

const BodyCard: React.FC<Props> = ({ children }: Props) => {
    return (
        <div className="w-full max-w-[90%] mx-auto bg-[--btn-color] rounded-2xl shadow-xl sm:px-8 md:px-10 lg:px-12 mt-4 pt-4 mb-4" style={{boxSizing: "border-box", minHeight: `calc(100vh - 8rem)`,}}> 
            { children }
        </div>
    )
}

export default BodyCard