import { useAuth } from '../context/AuthContext.jsx';

const PrivateRoute = ({ children, fallback = null }) => {
  const { token } = useAuth();
  if (!token) return fallback;
  return children;
};

export default PrivateRoute;
