import { Navigate, Route, Routes, Outlet } from "react-router-dom";

import HomePage from "./Pages/Home.jsx";

const ProtectedRoute = ({ children }) => {
  const { authUser, isLoading } = useAuthUser();
  const isOnboarded = authUser?.isOnboarded;

  // While loading, do NOT decide routing
  if (isLoading) return <PageLoader overlay={true} />;

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  if (!isOnboarded) {
    return <Navigate to="/onboarding" replace />;
  }

  return children ? children : <Outlet />;
};


import SignUpPage from "./Pages/SignUpPage.jsx";
import LoginPage from "./Pages/LoginPage.jsx";
import NotificationsPage from "./Pages/NotificationsPage.jsx";
import CallPage from "./Pages/CallPage.jsx";
import ChatPage from "./Pages/Chatpage.jsx";
import OnboardingPage from "./Pages/OnboardingPages.jsx";

import { Toaster } from "react-hot-toast";

import PageLoader from "./components/PageLoarder.jsx";
import useAuthUser from "./hooks/useAuthUser.js";
import Layout from "./components/Layout.jsx";
import { useThemeStore } from "./store/themeStore.js";

const App = () => {
  const { isLoading, authUser } = useAuthUser();
  const { theme } = useThemeStore();

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;
  
  if (isLoading) return <PageLoader />;

  return (
    <div className="h-screen" data-theme={theme}>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout showSidebar={true}>
                <HomePage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/signup"
          element={
            !isAuthenticated ? <SignUpPage /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />
          }
        />
        <Route
          path="/login"
          element={
            !isAuthenticated ? <LoginPage /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Layout showSidebar={true}>
                <NotificationsPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/call/:id"
          element={
            <ProtectedRoute>
              <CallPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat/:id"
          element={
            <ProtectedRoute>
              <Layout showSidebar={false}>
                <ChatPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/onboarding"
          element={
            isAuthenticated ? (
              !isOnboarded ? (
                <OnboardingPage />
              ) : (
                <Navigate to="/" replace />
              )
            ) : (
              <Navigate to="/login" state={{ from: "/onboarding" }} replace />
            )
          }
        />
      </Routes>

      <Toaster />
    </div>
  );
};
export default App;