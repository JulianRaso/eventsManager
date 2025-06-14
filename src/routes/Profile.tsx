import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/Input";
import useUpdateUser from "../hooks/useUpdateUser";
import { useUser } from "../hooks/useUser";

type ProfileForm = {
  fullName: string;
  password: string;
  picture: FileList;
  passwordConfirm: string;
};

export default function Profile() {
  const navigate = useNavigate();
  const { user, isLoading } = useUser();
  let email = "";
  const { register, reset, handleSubmit, setValue, getValues } =
    useForm<ProfileForm>();
  const { isUpdating, updateUser } = useUpdateUser();

  if (user) {
    if (user.user_metadata.fullName) {
      setValue("fullName", user.user_metadata?.fullName);
    }
    email = user.email || "";
  }

  if (isLoading) return <Spinner />;

  function onSubmitProfile(data: ProfileForm) {
    const { fullName, password, picture } = data || [];
    const avatar = picture[0];

    if (fullName) updateUser({ fullName, avatar });
    if (password) updateUser({ password });
    reset();
  }

  function handleCancel() {
    navigate("/reservas");
    reset();
  }

  return (
    <div className="flex items-center justify-center h-dvh sm:text-xl bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmitProfile)}
        className="border-2 rounded-3xl bg-white shadow-lg flex flex-col items-center justify-center p-6 "
      >
        {/* Profile Information */}
        <div className="flex flex-col w-full gap-5 p-4 sm:p-8">
          <div className="flex flex-col gap-2">
            <p>Nombre completo</p>
            <Input
              type="text"
              id="name"
              {...register("fullName")}
              required
              disabled={isUpdating}
            />
          </div>
          <div className="flex flex-col gap-2">
            <p>Email</p>
            <Input type="text" id="email" defaultValue={email} disabled></Input>
          </div>
          <div className="flex flex-col gap-2">
            <p>Foto de perfil</p>
            <Input
              id="picture"
              type="file"
              {...register("picture")}
              disabled={isUpdating}
            />
          </div>
          <div className="flex flex-col gap-2">
            <p>Contraseña</p>
            <Input
              type="password"
              id="password"
              required
              {...register("password", {
                minLength: {
                  value: 8,
                  message: "Password needs a minimum of 8 characters",
                },
              })}
              disabled={isUpdating}
            />
          </div>
          <div className="flex flex-col gap-2">
            <p>Repetir contraseña</p>
            <Input
              type="password"
              id="passwordCheck"
              required
              {...register("passwordConfirm", {
                validate: (value) =>
                  getValues().password === value ||
                  "Las contraseñas no coinciden",
              })}
              disabled={isUpdating}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex w-full flex-wrap justify-between items-center gap-2">
          <Button onClick={handleCancel}>Cancelar</Button>
          <Button variant="outline" disabled={isUpdating}>
            Guardar cambios
          </Button>
        </div>
      </form>
    </div>
  );
}
