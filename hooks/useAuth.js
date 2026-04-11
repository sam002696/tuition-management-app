import { useSelector } from "react-redux";
import { useMemo } from "react";

export default function useAuth() {
  const user = useSelector((s) => s.auth.user);
  const role = useSelector((s) => s.auth.role);
  const token = useSelector((s) => s.auth.token);
  const loading = useSelector((s) => s.auth.loading);
  const error = useSelector((s) => s.auth.error);
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);

  // stable identity unless one of the fields actually changes
  return useMemo(
    () => ({ user, role, token, loading, error, isAuthenticated }),
    [user, role, token, loading, error, isAuthenticated]
  );
}
