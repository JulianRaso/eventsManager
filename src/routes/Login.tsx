import { useForm } from "react-hook-form";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/Input";
import useLogin from "../hooks/useLogin";
import companyLogo from "../assets/ShowRental.png";
import { cn } from "../lib/utils";

export default function Login() {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    email: string;
    password: string;
  }>();
  const { login, isPending } = useLogin();

  function onSubmit(data: { email: string; password: string }) {
    if (!data.email || !data.password) return;
    login(data);
  }

  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-muted/30 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-border bg-card p-6 shadow-lg sm:p-8 lg:p-10">
          {/* Logo y título */}
          <div className="mb-8 flex flex-col items-center gap-4">
            <div className="flex h-20 w-20 overflow-hidden rounded-xl border-2 border-border shadow-md">
              <img
                src={companyLogo}
                alt="Show Rental"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Iniciar sesión
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Ingresá con tu correo y contraseña
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Correo electrónico <span className="text-destructive">*</span>
              </label>
              <Input
                type="email"
                id="email"
                placeholder="tu@email.com"
                autoComplete="email"
                {...register("email", {
                  required: "El correo es requerido",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Correo electrónico inválido",
                  },
                })}
                className={cn(errors.email && "border-destructive focus-visible:ring-destructive/20")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Contraseña <span className="text-destructive">*</span>
              </label>
              <Input
                type="password"
                id="password"
                placeholder="••••••••"
                autoComplete="current-password"
                {...register("password", {
                  required: "La contraseña es requerida",
                })}
                className={cn(errors.password && "border-destructive focus-visible:ring-destructive/20")}
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="mt-2 flex flex-col gap-3 sm:flex-row-reverse sm:gap-2">
              <Button
                type="submit"
                className="flex-1"
                disabled={isPending}
              >
                {isPending ? "Entrando..." : "Iniciar sesión"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => reset()}
              >
                Limpiar campos
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
