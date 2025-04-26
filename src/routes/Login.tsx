import { useForm } from "react-hook-form";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/Input";
import useLogin from "../hooks/useLogin";

export default function Login() {
  const { register, reset, handleSubmit } = useForm();
  const { login, isPending } = useLogin();

  function onSubmit(data) {
    if (!data.email || !data.password) return;
    login(data);
  }

  return (
    <div className="h-dvh w-dvw flex items-center justify-center bg-gray-50">
      <div className="border-2 p-8 rounded-2xl bg-white shadow-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <div className="text-lg font-semibold flex items-center gap-1">
              Iniciar sesión
              <p className="text-red-500">*</p>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-semibold">
                Correo electrónico
              </label>
              <Input
                type="email"
                id="email"
                {...register("email")}
                className="border-2 border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-semibold">
                Contraseña
              </label>
              <Input
                type="password"
                id="password"
                {...register("password")}
                className="border-2 border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Button
                type="submit"
                className="bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-200"
                disabled={isPending}
              >
                Iniciar sesión
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                type="button"
                className="bg-gray-200 text-gray-700 font-semibold py-2 rounded-md hover:bg-gray-300 transition duration-200"
                onClick={() => reset()}
              >
                Limpiar campos
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
