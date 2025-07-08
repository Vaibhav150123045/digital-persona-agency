import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, UserPlus, LogIn, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { clearOnboardingSession } from "@/utils/onboardingSession";

interface SignupPromptProps {
  userEmail: string;
  onSignupComplete: () => void;
}

const SignupPrompt = ({ userEmail, onSignupComplete }: SignupPromptProps) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginPassword, setLoginPassword] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    // Simply call the onSignupComplete callback which will hide the signup prompt
    // and return the user to the dashboard view
    onSignupComplete();
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive"
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/dashboard`;
      
      const { error } = await supabase.auth.signUp({
        email: userEmail,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (error) {
        if (error.message.includes("User already registered") || error.message.includes("already registered")) {
          toast({
            title: "Account Already Exists",
            description: "An account with this email already exists. Please sign in instead.",
            variant: "default"
          });
          setShowLogin(true);
        } else {
          toast({
            title: "Signup Failed",
            description: error.message,
            variant: "destructive"
          });
        }
      } else {
        // Clear the onboarding session since it's no longer needed
        clearOnboardingSession();
        
        toast({
          title: "Account Created! 🎉",
          description: "Please check your email to verify your account, then sign in."
        });
        onSignupComplete();
      }
    } catch (error) {
      toast({
        title: "Signup Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: loginPassword,
      });

      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        // Clear the onboarding session since user is now logged in
        clearOnboardingSession();
        
        toast({
          title: "Welcome Back! 🎬",
          description: "Successfully logged in to your SPAIS account."
        });
        // Let the auth context handle the redirect
        window.location.href = "/dashboard";
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(userEmail, {
        redirectTo: `${window.location.origin}/dashboard`
      });

      if (error) {
        toast({
          title: "Reset Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Reset Email Sent",
          description: "Check your email for password reset instructions.",
        });
      }
    } catch (error) {
      toast({
        title: "Reset Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader className="text-center">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToDashboard}
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
            <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center mb-4">
              <LogIn className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl text-white">Welcome Back</CardTitle>
            <CardDescription className="text-gray-300">
              Sign in to your existing account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={userEmail}
                  disabled
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="loginPassword" className="text-white">Password</Label>
                <Input
                  id="loginPassword"
                  type="password"
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-3">
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" 
                  disabled={isLoading}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-white/5 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/15 hover:border-white/50 hover:text-white"
                  onClick={handleForgotPassword}
                  disabled={isLoading}
                >
                  Forgot Password?
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-gray-400 hover:text-white"
                  onClick={() => setShowLogin(false)}
                >
                  ← Back to Sign Up
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/5 backdrop-blur-sm border-white/10">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToDashboard}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl text-white">Complete Your Signup</CardTitle>
          <CardDescription className="text-gray-300">
            You're almost done! Just set a password to secure your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                value={userEmail}
                disabled
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Create Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter a secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" 
              disabled={isLoading}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              {isLoading ? "Creating Account..." : "Complete Signup"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupPrompt;
