import {FaArrowUp, FaArrowDown} from "react-icons/fa"


interface VoteArrowProps{
    voteFunction:Function,
    voteScore:number | undefined,
    userVote:number | undefined
}

const VoteArrows=({voteFunction, voteScore, userVote}:VoteArrowProps)=>{
    return (
    <div className='flex-shrink-0 w-10 py-2 text-center rounded-lg'>
            <div className='w-6 mx-auto cursor-pointer rounded-lg text-gray-400 hover:bg-gray-300 hover:text-red-500'
                onClick={()=>{
                    voteFunction(1)
                }}
                >
                {userVote===1 ? <FaArrowUp className='mx-1 fill-red-500'/> :<FaArrowUp className='mx-1 fill-gray-400'/>}
            </div>
            <p>{voteScore}</p>
            <div className='w-6 mx-auto text-gray-400 cursor-pointer rounded-lg hover:bg-gray-300 hover:text-blue-500'
            onClick={()=>voteFunction(-1)}
            >
                {userVote===-1 ? <FaArrowDown className='mx-1 fill-blue-500'/> :<FaArrowDown className='mx-1 fill-gray-400'/>}
            </div>
    </div>);
}

export default VoteArrows;

