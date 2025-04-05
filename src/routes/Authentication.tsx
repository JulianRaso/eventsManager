import React, { useState } from "react";
import { logIn } from "../services/user";

export default function Authentication({ auth, setAuth, children }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handleLocalStore(account, password) {
    localStorage.setItem("account_email", account);
    localStorage.setItem("account_password", account);
  }

  const handleLogin = async () => {
    setAuth(await logIn({ email, password }));
  };

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (email === "" || password === "") {
      alert("Por favor, complete todos los campos obligatorios.");
      return;
    }
    handleLogin();
  }
  if (auth) return <div>{children}</div>;
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-50">
      <div className="border-2 p-8 rounded-2xl bg-white shadow-lg">
        <form className="flex flex-col gap-10" onSubmit={handleSubmit}>
          <div className="">
            <div className="flex flex-col gap-6">
              <div className="text-lg font-semibold flex items-center gap-1">
                Iniciar sesión
                <p className="text-red-500">*</p>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-semibold">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-2 border-gray-300 rounded-md p-2"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-sm font-semibold">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-2 border-gray-300 rounded-md p-2"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 border-gray-300 rounded-md"
                />
                <label htmlFor="remember" className="text-sm font-semibold">
                  Recordar contraseña
                </label>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-200"
                >
                  Iniciar sesión
                </button>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  className="bg-gray-200 text-gray-700 font-semibold py-2 rounded-md hover:bg-gray-300 transition duration-200"
                  onClick={() => {
                    setEmail("");
                    setPassword("");
                  }}
                >
                  Limpiar campos
                </button>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  className="text-blue-500 font-semibold hover:underline"
                  onClick={() => alert("Recuperar contraseña")}
                >
                  Olvidé mi contraseña
                </button>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  className="text-blue-500 font-semibold hover:underline"
                  onClick={() => alert("Crear cuenta")}
                >
                  Crear cuenta
                </button>
              </div>
            </div>
          </div>
          {errorMessage && (
            <div className="text-red-500 text-sm font-semibold">
              {errorMessage}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
