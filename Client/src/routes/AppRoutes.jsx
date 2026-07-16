import { Routes, Route, useLocation } from "react-router-dom";
import LandingPage from "../pages/LandingPage.jsx";
import Register from "../pages/auth/Register.jsx";
import Login from "../pages/auth/Login.jsx";
import ForgotPassword from "../pages/auth/ForgotPassword.jsx";
import VerifyEmail from "../pages/auth/VerifyEmail.jsx";
import ResetPassword from "../pages/auth/ResetPassword.jsx";
import VerifyResetOtp from "../pages/auth/VerifyResetOtp.jsx";
import CreateTempRoomPage from "../pages/Temp-Room/CreateTempRoomPage.jsx";
import JoinTempRoomPage from "../pages/Temp-Room/JoinTempRoomPage.jsx";
import TempChatRoom from "../pages/TempChatRoom.jsx";
import { RedirectIfAuthenticated } from "./AuthProtectedRoute.jsx";
import TempRoomProtectedRoute from "./TempRoomProtectedRoute.jsx";
import CreatePersistentRoomPage from "../pages/Persistent-Room/CreatePersistentRoomPage.jsx";
import JoinPersistentRoomPage from "../pages/Persistent-Room/JoinPersistentRoomPage.jsx";
import PersistentChatRoom from "../pages/Persistent-Room/PersistentChatRoom.jsx";
import { AuthProtectedRoute } from "./AuthProtectedRoute.jsx";
import RoomsDashboard from "../pages/Persistent-Room/RoomsDashboard.jsx";
import AboutPage from "../pages/AboutPage.jsx";
import ProfilePage from "../pages/ProfilePage.jsx";
import TermsOfService from "../pages/TermsOfService.jsx";
import LegalInfo from "../pages/LegalInfo.jsx";

import { AnimatePresence } from "framer-motion";
import PageWrapper from "../components/common/PageWrapper.jsx";

export default function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* PUBLIC */}
        <Route
          path="/"
          element={
            <PageWrapper>
              <LandingPage />
            </PageWrapper>
          }
        />
        <Route
          path="/verify-email"
          element={
            <PageWrapper>
              <VerifyEmail />
            </PageWrapper>
          }
        />
        <Route
          path="/verify-reset-otp"
          element={
            <PageWrapper>
              <VerifyResetOtp />
            </PageWrapper>
          }
        />
        <Route
          path="/about"
          element={
            <PageWrapper>
              <AboutPage />
            </PageWrapper>
          }
        />
        <Route
          path="/terms"
          element={
            <PageWrapper>
              <TermsOfService />
            </PageWrapper>
          }
        />
        <Route
          path="/legal-info"
          element={
            <PageWrapper>
              <LegalInfo />
            </PageWrapper>
          }
        />

        {/* AUTH ROUTES - blocked for already logged in users*/}
        <Route element={<RedirectIfAuthenticated />}>
          <Route
            path="/register"
            element={
              <PageWrapper>
                <Register />
              </PageWrapper>
            }
          />
          <Route
            path="/login"
            element={
              <PageWrapper>
                <Login />
              </PageWrapper>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PageWrapper>
                <ForgotPassword />
              </PageWrapper>
            }
          />
          <Route
            path="/reset-password"
            element={
              <PageWrapper>
                <ResetPassword />
              </PageWrapper>
            }
          />
        </Route>

        <Route element={<AuthProtectedRoute />}>
          <Route
            path="/persistent/create"
            element={
              <PageWrapper>
                <CreatePersistentRoomPage />
              </PageWrapper>
            }
          />
          <Route
            path="/persistent/join"
            element={
              <PageWrapper>
                <JoinPersistentRoomPage />
              </PageWrapper>
            }
          />
          <Route
            path="/persistent/:roomId"
            element={
              <PageWrapper>
                <PersistentChatRoom />
              </PageWrapper>
            }
          />
          <Route
            path="/rooms"
            element={
              <PageWrapper>
                <RoomsDashboard />
              </PageWrapper>
            }
          />
          <Route
            path="/profile"
            element={
              <PageWrapper>
                <ProfilePage />
              </PageWrapper>
            }
          />
        </Route>

        {/* TEMP ROOM ROUTES */}
        <Route
          path="/temp/create"
          element={
            <PageWrapper>
              <CreateTempRoomPage />
            </PageWrapper>
          }
        />
        <Route
          path="/temp/join"
          element={
            <PageWrapper>
              <JoinTempRoomPage />
            </PageWrapper>
          }
        />
        <Route
          path="/temp/join/:roomId"
          element={
            <PageWrapper>
              <JoinTempRoomPage />
            </PageWrapper>
          }
        />

        <Route element={<TempRoomProtectedRoute />}>
          <Route
            path="/temp/:roomId"
            element={
              <PageWrapper>
                <TempChatRoom />
              </PageWrapper>
            }
          />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}
