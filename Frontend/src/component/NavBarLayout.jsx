import { useAuth } from "../context/AuthContext";
import { AdminNavbar } from "./AdminNavBar";
import { ArtistNavbar } from "./ArtistNavBar";
import { AttendeeNavBar } from "./AttendeeNavBar";
import Footer from "../components/Footer";

export function Layout({ children }) {
    const { user, logout, role, loading, dbuser } = useAuth();
    if (loading) return null;
    const renderNavbar = () => {
        switch (role) {
            case 'Admin':
                return <AdminNavbar user={user} logout={logout} dbuser={dbuser} />;
            case "Artist":
                return <ArtistNavbar user={user} logout={logout} dbuser={dbuser} />;
            case "Attendee":
                return <AttendeeNavBar user={user} logout={logout} dbuser={dbuser} />;
            default:
                return null;
        }
    };
    return (
        <div className="min-h-screen flex flex-col">
            {renderNavbar()}
            <div className="flex-1">
                {children}
            </div>
            <Footer />
        </div>
    );
}