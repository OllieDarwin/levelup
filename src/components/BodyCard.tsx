interface Props {
    children: React.ReactNode
}

const BodyCard: React.FC<Props> = ({ children }: Props) => {
    return (
        <div className="card card-compact w-[90%] h-[calc(100vh-8.05rem)] bg-[--btn-color] shadow-xl mx-auto mt-4"> 
            { children }
        </div>
    )
}

export default BodyCard