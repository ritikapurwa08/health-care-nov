import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AuthSignInSchema, AuthSignInSchemaType } from "./auth.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthActions } from "@convex-dev/auth/react";
import { Form } from "@/components/ui/form";

import { LockIcon, MailIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import CustomInput from "@/features/form-provider/custom-input";
import CustomPasswordInput from "@/features/form-provider/custom-password-input";
import SubmitButton from "@/features/form-provider/submit-button";

export default function SignInInputs() {
  const [pending, setPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  const { signIn } = useAuthActions();

  const form = useForm<AuthSignInSchemaType>({
    resolver: zodResolver(AuthSignInSchema),
  });

  const onPasswordSignIn = async (values: AuthSignInSchemaType) => {
    setPending(true);
    setErrorMessage(""); // Clear any previous errors

    try {
      await signIn("password", {
        email: values.email,
        password: values.password,
        flow: "signIn",
      });

      toast.success("sign in succcessfully");

      router.push("/");
    } catch (error) {
      // Handle different types of errors
      // const errorMsg =
      //   error instanceof Error
      //     ? error.message
      //     : "An unexpected error occurred. Please try again.";

      setErrorMessage("user email or password is incorrect");

      toast.error("user email or password is incorrect");

      console.error("Sign in error:", error);
    } finally {
      setPending(false);
    }
  };

  return (
    <Form {...form}>
      <form
        className="w-full flex flex-col gap-y-3"
        onSubmit={form.handleSubmit(onPasswordSignIn)}
      >
        <CustomInput
          control={form.control}
          name="email"
          label="Email"
          placeholder="Enter your Email"
          disabled={pending}
          icon={MailIcon}
        />

        <CustomPasswordInput
          control={form.control}
          name="password"
          label="Password"
          placeholder="Enter your Password"
          disabled={pending}
          icon={LockIcon}
        />

        {errorMessage && (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <SubmitButton isLoading={pending}>get started</SubmitButton>
      </form>
    </Form>
  );
}
