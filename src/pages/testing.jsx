import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
    const {user, logout} = useAuth();
    
    return(
        <div className="dashboard">
            <header className="dashboard-header">
                <div className="logo">AccountHub</div>
                <nav>
                    <Link to="/dashboard" className ="nav-link active">Dashboard</Link>
                    <Link to="/settings" className="nav-link"Settings></Link>
                    <button onClick={logout} className="btn btn-outline">
                        Logout
                    </button>
                </nav>
            </header>
        </div>
     )
}
