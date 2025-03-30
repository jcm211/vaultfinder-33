
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Shield, Eye, EyeOff, Lock, AlertTriangle, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const { login, loginAttempts, systemLocked, lockoutEndTime } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const MAX_LOGIN_ATTEMPTS = 3;
  const attemptsRemaining = MAX_LOGIN_ATTEMPTS - loginAttempts;

  useEffect(() => {
    if (systemLocked && lockoutEndTime) {
      const updateTimeRemaining = () => {
        if (!lockoutEndTime) return;
        
        const now = new Date();
        const remaining = Math.max(0, lockoutEndTime.getTime() - now.getTime());
        setTimeRemaining(remaining);
        
        if (remaining <= 0) {
          clearInterval(interval);
        }
      };
      
      updateTimeRemaining();
      const interval = setInterval(updateTimeRemaining, 1000);
      
      return () => clearInterval(interval);
    }
  }, [systemLocked, lockoutEndTime]);

  const formatTimeRemaining = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (systemLocked) {
      toast({
        title: "System Locked",
        description: "The system is currently in self-destruct mode. Please wait for the lockout period to end.",
        variant: "destructive",
      });
      return;
    }
    
    if (!username || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both username and password.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await login(username, password);
      
      if (success) {
        toast({
          title: "Login Successful",
          description: "Welcome to Lumina Search admin panel.",
        });
        navigate("/admin");
      } else {
        toast({
          title: "Access Denied",
          description: `Authentication failed. You have ${attemptsRemaining} attempt${attemptsRemaining !== 1 ? 's' : ''} remaining.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-blue-900 px-4">
      {systemLocked ? (
        <Card className="w-full max-w-md mx-auto animate-pulse-slow border-red-500">
          <CardHeader className="bg-red-500 text-white">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-center text-2xl">SYSTEM LOCKED</CardTitle>
            <CardDescription className="text-center text-white/80">
              Security self-destruct protocol activated
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Lock className="h-5 w-5 text-red-500" />
              <span className="text-lg font-bold text-red-500">Security Lockdown</span>
            </div>
            
            <p className="mb-6">
              Too many failed login attempts detected. The system is locked for security reasons.
            </p>
            
            <div className="mb-6">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-5 w-5 mr-2 text-gray-500" />
                <span className="text-xl font-mono">{formatTimeRemaining(timeRemaining)}</span>
              </div>
              <Progress value={(timeRemaining / (5 * 60 * 1000)) * 100} className="h-2" />
              <p className="text-sm text-gray-500 mt-2">
                Time remaining until system unlock
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center pb-6">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate("/")}
            >
              Return to Home
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="w-full max-w-md mx-auto shadow-xl border-primary/20">
          <CardHeader className="pb-4">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-glow">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
            <CardDescription className="text-center">
              Access the secure control panel
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-12"
                  autoComplete="off"
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 pr-10"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              
              {loginAttempts > 0 && (
                <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
                  <div className="flex items-center text-amber-800">
                    <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
                    <p className="text-sm">
                      Warning: {attemptsRemaining} login {attemptsRemaining === 1 ? 'attempt' : 'attempts'} remaining before system lockdown
                    </p>
                  </div>
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Log In"}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex justify-center pb-6">
            <Button 
              variant="link" 
              onClick={() => navigate("/")}
              className="text-gray-500 hover:text-primary"
            >
              Return to Home Page
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default Login;
