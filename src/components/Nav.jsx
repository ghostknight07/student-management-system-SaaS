import Image from "next/image";
import Link from "next/link";
import {useState} from "react";
import {X, Menu} from "lucide-react";

export default function Nav(){
	const [mobileScreen, setMobileScreen] = useState(false);


    return(
    	<div className="flex flex-col  sticky top-0 z-50">
	        <nav className="backdrop-blur-lg flex flex-col items-center justify-center h-16 w-full  overflow-hidden">
	            
	            <div className="h-full w-9/12 flex items-center justify-between">
	                <div>
	                	<Link href="/"><Image src="/logo.svg" alt="logo" width={40} height={40}/></Link>
	                </div>
	                <div className="hidden lg:flex gap-8 secondary-font">
	                	<Link className="hover:underline" href="/">Home</Link>
	                	<Link className="hover:underline" href="#pricing">Pricing</Link>
	                	<Link className="hover:underline" href="/about">About Us</Link>
	                	<Link className="hover:underline" href="/dashboard">Dashboard</Link>
	                </div>
	                <div>
	                	<Link className="hidden lg:flex" href="/"><button className="p-2 py-1 cursor-pointer text-white rounded shadow-md bg-green">Login</button></Link>
	                </div>

	            {/*mobile version*/}
	            	<div className="lg:hidden">
	            		<button onClick={() => setMobileScreen(!mobileScreen)}>{mobileScreen? <X className="w-6 h-6" />: <Menu className="w-6 h-6" />}</button>
	            	</div>
	            </div>
	        </nav>
	        {mobileScreen && (
	            <div className="lg:hidden h-screen mt-10 text-xl flex flex-col items-center gap-6">
	            	<div className="flex flex-col gap-4 items-center">
	            		     <Link onClick={() => setMobileScreen(false)} className="hover:underline" href="/">Home</Link>
					      	<Link onClick={() => setMobileScreen(false)} className="hover:underline" href="#pricing">Pricing</Link>
					      	<Link onClick={() => setMobileScreen(false)} className="hover:underline" href="/about">About Us</Link>
					      	<Link onClick={() => setMobileScreen(false)} className="hover:underline" href="/dashboard">Dashboard</Link>
	            	</div>
	            	<Link href="/sign-in">
            			<button  className="flex gap-2 cursor-pointer px-12 py-3 rounded-md text-white bg-green hover:bg-green-dark hover:gap-4">
            			Login
            			<Image src="/plane.svg" width={15} height={15} alt="plane"/>
            			</button>
            		</Link>
	            </div>
	        )}
        </div>
    )
}
