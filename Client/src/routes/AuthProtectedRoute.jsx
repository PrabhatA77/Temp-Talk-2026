import { Navigate,Outlet,useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore.js";

export const AuthProtectedRoute = () => {
    const {isAuthenticated, isCheckingAuth} = useAuthStore();
    const location = useLocation();

    if(isCheckingAuth) return null;

    if(!isAuthenticated){
        return <Navigate to="/login" state={{from:location}} replace/>;
    }

    return <Outlet/>;
}

export const RedirectIfAuthenticated = () => {
    const {isAuthenticated,isCheckingAuth} = useAuthStore();

    if(isCheckingAuth) return null;

    if(isAuthenticated){
        return <Navigate to="/" replace/>;
    }

    return <Outlet/>;
}