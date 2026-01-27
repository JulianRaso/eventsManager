import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { useUser } from "../hooks/useUser";

export default function Authentication({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const { isLoading, authenticated } = useUser();

  useEffect(() => {
    if (!authenticated && !isLoading) navigate("/login");
  }, [authenticated, isLoading, navigate]);

  if (isLoading) return <Spinner />;

  if (authenticated) return children;

  return null;
}
