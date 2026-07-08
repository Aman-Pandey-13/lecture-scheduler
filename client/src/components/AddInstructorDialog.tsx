import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useAddInstructor } from "@/hooks/useInstructors";
import { getApiErrorMessage } from "@/api/axios";
import {
  addInstructorSchema,
  type AddInstructorValues,
} from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function AddInstructorDialog() {
  const [open, setOpen] = useState(false);
  const addInstructor = useAddInstructor();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddInstructorValues>({
    resolver: zodResolver(addInstructorSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = (values: AddInstructorValues) => {
    addInstructor.mutate(values, {
      onSuccess: (created) => {
        toast.success(`${created.name} added as an instructor`);
        reset();
        setOpen(false);
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error, "Could not add instructor"));
      },
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger
        render={
          <Button>
            <Plus className="size-4" />
            Add instructor
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add instructor</DialogTitle>
          <DialogDescription>
            Create an instructor account. They can sign in to view their
            assigned lectures.
          </DialogDescription>
        </DialogHeader>

        <form
          id="add-instructor-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="instructor-name">Full name</Label>
            <Input
              id="instructor-name"
              placeholder="Jane Doe"
              aria-invalid={Boolean(errors.name)}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructor-email">Email</Label>
            <Input
              id="instructor-email"
              type="email"
              placeholder="jane@example.com"
              aria-invalid={Boolean(errors.email)}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructor-password">Temporary password</Label>
            <Input
              id="instructor-password"
              type="password"
              placeholder="At least 6 characters"
              aria-invalid={Boolean(errors.password)}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>
        </form>

        <DialogFooter showCloseButton>
          <Button
            type="submit"
            form="add-instructor-form"
            disabled={addInstructor.isPending}
          >
            {addInstructor.isPending && (
              <Loader2 className="size-4 animate-spin" />
            )}
            {addInstructor.isPending ? "Adding…" : "Add instructor"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
