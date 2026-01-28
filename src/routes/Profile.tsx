import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/Input";
import useUpdateUser from "../hooks/useUpdateUser";
import { useUser } from "../hooks/useUser";
import { cn } from "../lib/utils";

type ProfileForm = {
  fullName: string;
  password: string;
  picture: FileList;
  passwordConfirm: string;
};

export default function Profile() {
  const navigate = useNavigate();
  const { user, isLoading } = useUser();
  const {
    register,
    reset,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ProfileForm>();
  const { isUpdating, updateUser } = useUpdateUser();

  const email = user?.email ?? "";

  useEffect(() => {
    if (user?.user_metadata?.fullName) {
      setValue("fullName", user.user_metadata.fullName);
    }
  }, [user, setValue]);

  if (isLoading) return <Spinner />;

  function onSubmitProfile(data: ProfileForm) {
    const { fullName, password, picture } = data;
    const avatar = picture?.length ? picture[0] : undefined;

    if (fullName) updateUser({ fullName, avatar });
    if (password?.trim()) updateUser({ password });
    reset(undefined, { keepValues: true });
  }

  function handleCancel() {
    navigate("/configuracion");
    reset();
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-xl border border-border bg-card p-6 shadow-lg sm:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Mi perfil
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Actualizá tu nombre, foto o contraseña
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmitProfile)}
            className="flex flex-col gap-5"
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="fullName" className="text-sm font-medium text-foreground">
                Nombre completo <span className="text-destructive">*</span>
              </label>
              <Input
                type="text"
                id="fullName"
                placeholder="Tu nombre y apellido"
                {...register("fullName", { required: "El nombre es requerido" })}
                disabled={isUpdating}
                className={cn(errors.fullName && "border-destructive focus-visible:ring-destructive/20")}
              />
              {errors.fullName && (
                <p className="text-xs text-destructive">{errors.fullName.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Correo electrónico
              </label>
              <Input
                type="email"
                id="email"
                defaultValue={email}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                El correo no se puede modificar
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-foreground">
                Foto de perfil
              </span>
              <div className="flex items-center gap-3">
                <input
                  id="picture"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  {...register("picture")}
                  disabled={isUpdating}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isUpdating}
                  onClick={() => document.getElementById("picture")?.click()}
                >
                  Elegir foto
                </Button>
                <span className="text-xs text-muted-foreground">
                  JPG, PNG o similar
                </span>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <p className="mb-3 text-sm font-medium text-foreground">
                Cambiar contraseña (opcional)
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="password" className="text-sm font-medium text-muted-foreground">
                    Nueva contraseña
                  </label>
                  <Input
                    type="password"
                    id="password"
                    placeholder="Mínimo 8 caracteres"
                    autoComplete="new-password"
                    {...register("password", {
                      minLength: {
                        value: 8,
                        message: "La contraseña debe tener al menos 8 caracteres",
                      },
                    })}
                    disabled={isUpdating}
                    className={cn(errors.password && "border-destructive focus-visible:ring-destructive/20")}
                  />
                  {errors.password && (
                    <p className="text-xs text-destructive">{errors.password.message}</p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="passwordConfirm" className="text-sm font-medium text-muted-foreground">
                    Repetir contraseña
                  </label>
                  <Input
                    type="password"
                    id="passwordConfirm"
                    placeholder="Repetí la contraseña"
                    autoComplete="new-password"
                    {...register("passwordConfirm", {
                      validate: (value) => {
                        const pwd = getValues("password");
                        if (!pwd) return true;
                        return value === pwd || "Las contraseñas no coinciden";
                      },
                    })}
                    disabled={isUpdating}
                    className={cn(errors.passwordConfirm && "border-destructive focus-visible:ring-destructive/20")}
                  />
                  {errors.passwordConfirm && (
                    <p className="text-xs text-destructive">{errors.passwordConfirm.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-2 flex flex-col gap-3 sm:flex-row-reverse sm:gap-2">
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Guardando..." : "Guardar cambios"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
