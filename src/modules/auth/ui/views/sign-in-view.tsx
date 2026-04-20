"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: "Password is required" }),
});

export const SignInView = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSocialLoading, setIsSocialLoading] = useState<string | null>(null);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        callbackURL: "/dashboard"
      });
      
      if (response.error) {
        setError(response.error.message || "Sign in failed");
      } else {
        setError(null);
        // Let the auth client handle the redirect
        window.location.href = response.data?.url || "/dashboard";
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-5xl overflow-hidden shadow-2xl border-0 rounded-2xl">
        <CardContent className="grid p-0 lg:grid-cols-2 grid-cols-1 min-h-[700px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 sm:p-8 lg:p-10 space-y-6">
              <div className="space-y-6 sm:space-y-8">
                <div className="text-center space-y-3">
                  <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Welcome Back</h2>
                  <p className="text-slate-600 text-base sm:text-lg">Sign in to your account</p>
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-medium">Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="manager@tech.com" 
                          {...field} 
                          className="h-12 sm:h-14 border-0 focus:border-0 focus:ring-0 rounded-lg text-base sm:text-lg px-4 bg-yellow-50 shadow-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-medium">Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="**********"
                          {...field}
                          type="password"
                          className="h-12 sm:h-14 border-0 focus:border-0 focus:ring-0 rounded-lg text-base sm:text-lg px-4 bg-yellow-50 shadow-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {error && (
                <Alert
                  variant="destructive"
                  className="mt-4 bg-destructive/10 border-none"
                >
                  <AlertTitle className="text-red-500">{error}</AlertTitle>
                </Alert>
              )}
                <Button 
                  className="w-full h-12 sm:h-14 bg-black hover:bg-gray-800 text-white font-semibold rounded-lg transition-all duration-200 text-base sm:text-lg"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-200"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-slate-500">OR CONTINUE WITH</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="h-11 sm:h-12 border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-lg transition-all duration-200 text-sm sm:text-base font-medium flex items-center justify-center gap-2"
                    onClick={async () => {
                      setIsSocialLoading('google');
                      try {
                        await authClient.signIn.social({
                          provider: 'google',
                          callbackURL: '/dashboard'
                        });
                      } catch {
                        setError('Google sign in failed');
                        setIsSocialLoading(null);
                      }
                    }}
                    disabled={isSocialLoading !== null}
                  >
                    {isSocialLoading === 'google' ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    )}
                    {isSocialLoading === 'google' ? 'Connecting...' : 'Google'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="h-11 sm:h-12 border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-lg transition-all duration-200 text-sm sm:text-base font-medium flex items-center justify-center gap-2"
                    onClick={async () => {
                      setIsSocialLoading('github');
                      try {
                        await authClient.signIn.social({
                          provider: 'github',
                          callbackURL: '/dashboard'
                        });
                      } catch {
                        setError('GitHub sign in failed');
                        setIsSocialLoading(null);
                      }
                    }}
                    disabled={isSocialLoading !== null}
                  >
                    {isSocialLoading === 'github' ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    )}
                    {isSocialLoading === 'github' ? 'Connecting...' : 'Github'}
                  </Button>
                </div>
                
                <p className="text-center text-sm sm:text-base text-slate-600">
                  Don&apos;t have an account?{' '}
                  <Link
                    href="/sign-up"
                    className="font-semibold text-slate-900 hover:text-slate-700 transition-colors"
                  >
                    Sign up
                  </Link>
                </p>
            </form>
          </Form>
          <div className="bg-gradient-to-br from-slate-900 to-slate-700 relative hidden lg:flex flex-col items-center justify-center p-8 lg:p-12 text-white">
            <div className="text-center space-y-8 lg:space-y-10">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
                <Image 
                  src="/logo.svg" 
                  alt="Meet.Ai Logo" 
                  width={100} 
                  height={100}
                  className="mx-auto drop-shadow-lg"
                />
              </div>
              <div className="space-y-4">
                <h3 className="text-4xl lg:text-5xl font-bold">Meet.Ai</h3>
                <p className="text-slate-200 text-lg lg:text-xl">Your AI-powered meeting assistant</p>
              </div>
              <div className="space-y-6 text-slate-300 text-base lg:text-lg">
                <div className="flex items-center gap-4 justify-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="font-medium">Smart meeting summaries</span>
                </div>
                <div className="flex items-center gap-4 justify-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="font-medium">AI-powered insights</span>
                </div>
                <div className="flex items-center gap-4 justify-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="font-medium">Seamless collaboration</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-center text-xs sm:text-sm text-slate-600 mt-6 lg:mt-8 px-4 max-w-md mx-auto">
        By continuing, you agree to our{' '}
        <Link href="/privacy" className="text-slate-900 hover:text-slate-700 font-semibold underline-offset-4 hover:underline break-words">
          Privacy Policy
        </Link>{' '}
        and{' '}
        <Link href="/terms" className="text-slate-900 hover:text-slate-700 font-semibold underline-offset-4 hover:underline break-words">
          Terms of Service
        </Link>
      </div>
    </div>
  );
};
