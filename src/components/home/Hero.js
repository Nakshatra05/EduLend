import Link from "next/link"
import { toast } from "../../hooks/alert"

function Hero(){

    const tt = () => {
        toast('Image clicked success', {type: 'success'})
    }

    return(
        <div className="hero py-32 bg-base-100">
            <div className="hero-content max-w-5xl flex-col lg:flex-row-reverse">
                <img src="/education-png-6.png" className="max-w-sm rounded-lg shadow-2xl" onClick={tt} />
                <div>
                <h1 className="text-5xl font-bold">Bridging the gap of entry barriers for our young warriors</h1>
                <p className="py-6">It is platform on Edu Chain where Samaritans of the world could contribute anonymously or non-anonymously to the students of the world who are currently facing a entry barrier for participating in the Hackathons or taking up educational bootcamps/courses .</p>
                <Link href='/lender-login-type'>
                <button className="btn bg-green-500">Samaritan</button>
                </Link>                

                OR
                <Link href='/login-type'>
                <button className="btn bg-green-500">Borrower</button>
                </Link>                
                </div>
            </div>
        </div>
    )    
}

export default Hero