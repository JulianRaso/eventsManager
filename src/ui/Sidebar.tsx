import '../styles/sidebar.css'
import { Link, NavLink } from "react-router";

//Icons
import { MdDashboard, MdEvent } from "react-icons/md";
import { RiSoundModuleFill } from "react-icons/ri";
import { IoPerson } from "react-icons/io5";
import { GrConfigure } from "react-icons/gr";
import { GiLightProjector } from "react-icons/gi";
import { TfiBlackboard } from "react-icons/tfi";



export default function Sidebar(){
    return(
        <div className="sidebar">

            <div className='imgContainer'>
                <img src="" alt="Logo" />
            </div>

            <ul>
                <li><Link to='/'><MdDashboard /> Dashboard</Link></li>
                <li><NavLink to='/booking'><MdEvent /> Reservas</NavLink></li>
                <li><IoPerson />Personal</li>
                <li><RiSoundModuleFill /> Equipos Sonido</li>
                <li><GiLightProjector />Equipos Iluminacion</li>
                <li><TfiBlackboard />Equipo Ambientacion</li>
                <li><GrConfigure />Configuracion</li>
            </ul>
        </div>
    )
}