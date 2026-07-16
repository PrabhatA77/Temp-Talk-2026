import { Navigate,Outlet,useParams } from "react-router-dom";
import useTempRoomStore from "../store/tempRoomStore.js";

const TempRoomProtectedRoute = () => {

    const {roomId} = useParams();
    const userName = useTempRoomStore((state)=>state.userName);

    if(!userName || userName.trim() === ""){
        return <Navigate to={`/temp/join/${roomId}`} replace />;
    }

    return <Outlet/>;
}

export default TempRoomProtectedRoute