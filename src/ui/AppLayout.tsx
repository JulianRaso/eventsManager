
//UI
import Header from "../ui/Header"
import Sidebar from "../ui/Sidebar"
import Main from '../ui/Main'


export default function AppLayout(){
    return(
        <div className="landingContainer">
        <Header />
        <Sidebar />
        <Main />
      </div>
    )
}