import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { useForm } from "react-hook-form";
import useInviteUser from "../hooks/useInviteUser";
import { Button } from "./ui/button";
import { Input } from "./ui/Input";

export default function AddUser() {
  const { handleSubmit, reset, register, getValues } = useForm();
  const { isInviting, inviteUser } = useInviteUser();

  function onSubmit(data) {
    const { email } = data;

    inviteUser(email);
    reset();
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">+</Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit border p-4 rounded-xl bg-gray-100">
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Usuario</h4>
            <p className="text-sm text-muted-foreground">
              Ingrese el email del usuario
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <label htmlFor="width">Email</label>
              <Input
                id="email"
                placeholder="test@example.com"
                className="col-span-2 h-8"
                {...register("email")}
                required
              />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <Button variant="outline" disabled={isInviting}>
              Agregar
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
