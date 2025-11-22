import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { lazy, Suspense } from "react";

// Layout components
import Layout from "./components/Layout";
import LoadingScreen from "./components/LoadingScreen";
import { RequireAuth } from "./components/RequireAuth";

// Pages
const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Goals = lazy(() => import("./pages/Goals"));
const Courses = lazy(() => import("./pages/Courses"));
const Roadmap = lazy(() => import("./pages/Roadmap"));
const Certificates = lazy(() => import("./pages/Certificates"));
const Guidance = lazy(() => import("./pages/Guidance"));
const Internships = lazy(() => import("./pages/Internships"));
const University = lazy(() => import("./pages/University"));
const Payment = lazy(() => import("./pages/Payment"));
const Admin = lazy(() => import("./pages/Admin"));
const UserManagement = lazy(() => import("./pages/UserManagement"));
const AdminSupport = lazy(() => import("./pages/AdminSupport"));
const Support = lazy(() => import("./pages/Support"));
const Mentor = lazy(() => import("./pages/Mentor"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Premium route component
const PremiumRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  return user?.premium ? <>{children}</> : <Navigate to="/payment" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster position="bottom-right" />

        <BrowserRouter>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected routes */}
              <Route path="/dashboard" element={
                <RequireAuth>
                  <Layout><Dashboard /></Layout>
                </RequireAuth>
              } />
              <Route path="/goals" element={
                <RequireAuth>
                  <Layout><Goals /></Layout>
                </RequireAuth>
              } />
              <Route path="/courses" element={
                <RequireAuth>
                  <Layout><Courses /></Layout>
                </RequireAuth>
              } />
              <Route path="/certificates" element={
                <RequireAuth>
                  <Layout><Certificates /></Layout>
                </RequireAuth>
              } />
              <Route path="/payment" element={
                <RequireAuth>
                  <Layout><Payment /></Layout>
                </RequireAuth>
              } />
              <Route path="/support" element={
                <RequireAuth>
                  <Layout><Support /></Layout>
                </RequireAuth>
              } />
              <Route path="/mentor" element={
                <RequireAuth>
                  <Layout><Mentor /></Layout>
                </RequireAuth>
              } />

              {/* Admin routes */}
              <Route path="/admin" element={
                <RequireAuth role="admin">
                  <Layout><Admin /></Layout>
                </RequireAuth>
              } />
              <Route path="/admin/users" element={
                <RequireAuth role="admin">
                  <Layout><UserManagement /></Layout>
                </RequireAuth>
              } />
              <Route path="/admin/support" element={
                <RequireAuth role="admin">
                  <Layout><AdminSupport /></Layout>
                </RequireAuth>
              } />

              {/* Premium routes */}
              <Route path="/roadmap" element={
                <RequireAuth>
                  <PremiumRoute>
                    <Layout><Roadmap /></Layout>
                  </PremiumRoute>
                </RequireAuth>
              } />
              <Route path="/guidance" element={
                <RequireAuth>
                  <PremiumRoute>
                    <Layout><Guidance /></Layout>
                  </PremiumRoute>
                </RequireAuth>
              } />
              <Route path="/internships" element={
                <RequireAuth>
                  <PremiumRoute>
                    <Layout><Internships /></Layout>
                  </PremiumRoute>
                </RequireAuth>
              } />
              <Route path="/university" element={
                <RequireAuth>
                  <PremiumRoute>
                    <Layout><University /></Layout>
                  </PremiumRoute>
                </RequireAuth>
              } />

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;