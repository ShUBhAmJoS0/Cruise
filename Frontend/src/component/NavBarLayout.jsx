import { useAuth } from "../context/AuthContext";
import { AdminNavbar } from "./AdminNavBar";
import { ArtistNavbar } from "./ArtistNavBar";
import { AttendeeNavBar } from "./Attendeenavbar";



export function Layout({children}){
    const {user,logout,role,loading,dbuser} = useAuth()
    console.log(user)
    if (loading) return null; 
const renderNavbar =()=>{
    switch(role){
        case 'Admin':
            return <AdminNavbar user={user} logout={logout} dbuser={dbuser}/>;
            case "Artist":
                return <ArtistNavbar user={user} logout={logout}  dbuser={dbuser}/>;
                case "Attendee":
                    return <AttendeeNavBar user={user} logout={logout}/>
                    default:
                        return null
    }
};
return (
<div className="min -h screen">
       {renderNavbar()}
       <div>
        {children}
        </div>
     
</div>

)
}