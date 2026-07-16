import useIntializeAuth from "./Hooks/useInitializeAuth.js"
import AppRoutes from "./routes/AppRoutes.jsx";
import {ToastContainer} from "react-toastify";
import BackgroundCanvas from "./components/Background/BackgroundCanvas.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

const App = () => {

  useIntializeAuth();

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>

      <div className="relative min-h-screen w-full transition-colors duration-300 overflow-hidden bg-white dark:bg-black">

        {/* 2. The Presentation Layer: Sits fixed at the back */}
        <BackgroundCanvas 
          dotGap={35} 
          dotRadius={2} 
          interactionRadius={120} 
          lightColor="#000000" 
          darkColor="#ff0000" 
        />

        {/* 3. The Application Layer: z-10 ensures your routes render ON TOP of the canvas */}
        <div className="relative z-10">
          <AppRoutes />
        </div>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          theme="colored"
        />
      </div>
    </GoogleOAuthProvider>
  )
}

export default App