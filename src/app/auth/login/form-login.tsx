"use client";

import { useForm } from "react-hook-form";
import API from "@/utils/axios";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertDanger } from "@/components/ui/alert";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GoogleIcon } from "@/assets/icons";
import { useAuth } from "@/hooks/useAuth";

const FormLogin = () => {
  const { register, handleSubmit } = useForm();
  const router = useRouter()
  const [error, setError] = useState(undefined);
  const [theme, setTheme] = useState<string | null>("light");
  const {setUser} = useAuth()

  const submitLogin = async (data: any) => {
    console.log(data);
    try {
      const res = await API.post("/authorization/login", data);
      if (res.data.role === "customer") {
        setUser(res.data.username)
        router.push("/dashboard/boards");
      }
    } catch (error: any) {
      if (error.status === 429) {
        router.push("/error/429");
      }
      setError(error.response?.data?.message);
    }
  };

  useEffect(() => {
    const getTheme = () => {
      setTheme(localStorage.getItem("theme"));
    };

    getTheme();
  }, []);

  return (
    <div
      className="h-screen shadow-lg flex items-center justify-center bg-cover"
      style={
        theme === "dark"
          ? { backgroundImage: `url("/bg-login-light.jpg")` }
          : { backgroundImage: `url("/bg-login-dark.jpg")` }
      }
    >
      <div className="w-100 min-h-[100px] rounded-xl bg-white dark:bg-transparent dark:backdrop-blur-md dark:ring dark:ring-gray-500 shadow-md flex overflow-hidden">
        <form className="w-full p-5" onSubmit={handleSubmit(submitLogin)}>
          <div className="text-center mb-5">
            <h1 className="font-bold text-2xl">Welcome back</h1>
            <p className="font-light">Login to your trello account</p>
          </div>
          {error && <AlertDanger title={error} />}
          <div className="grid gap-2 mb-5">
            <label>Email</label>
            <Input
              type="email"
              placeholder="m@example.com"
              {...register("email", { required: "Email cannot be blank" })}
            />
          </div>
          <div className="grid gap-2 mb-5 relative">
            <label>Password</label>
            <Input
              required
              type="password"
              {...register("password", {
                required: "Password cannot be blank",
              })}
            />
            <Link className="absolute top-0 right-0" href={"/restpassword"}>
              Forgot your password ?
            </Link>
          </div>
          <Button
            type="submit"
            className="w-full justify-center rounded-sm"
            variant="dark"
            size="md"
            title="Login"
          />
          <div className="relative border-t border-gray-200 w-full mt-10 dark:border-transparent">
            <p className="absolute -top-3.5 px-2 right-[50%] translate-x-[50%] bg-white font-light dark:bg-transparent">
              Or continue with
            </p>
            <div className="pt-10 pb-5">
              <Button
                type="button"
                onClick={() =>
                  (window.location.href =
                    "http://localhost:5024/v1/auth/google")
                }
                className="justify-center w-full"
                size="lg"
                variant="outline"
                title="Login with Google"
                icon={<GoogleIcon />}
              />
            </div>
            <p className="text-center">
              {`Don't have an account?`}{" "}
              <Link className="underline" href={"/auth/signup"}>
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormLogin;
