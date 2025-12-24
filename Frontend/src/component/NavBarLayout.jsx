import { useAuth } from "../context/AuthContext";
import { AdminNavbar } from "./AdminNavBar";
import { ArtistNavbar } from "./ArtistNavBar";
import { AttendeeNavBar } from "./Attendeenavbar";



export function Layout({children}){
    const {user,logout,role,loading} = useAuth()
    if (loading) return null; 
const renderNavbar =()=>{
    switch(role){
        case 'Admin':
            return <AdminNavbar user={user} logout={logout}/>;
            case "Artist":
                return <ArtistNavbar user={user} logout={logout}/>;
                case "Attendee":
                    return <AttendeeNavBar user={user} logout={logout}/>
                    default:
                        return null
    }
};
return (
<div className="h-100dvh">
       {renderNavbar()}
<div className="h-100dvh">
        {children}
        </div>
</div>

)
}