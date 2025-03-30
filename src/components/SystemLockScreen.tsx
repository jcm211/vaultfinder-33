
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Clock, Lock, Shield } from "lucide-react";

const SystemLockScreen = () => {
  const { lockoutEndTime } = useAuth();
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (lockoutEndTime) {
      const updateTimeRemaining = () => {
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
  }, [lockoutEndTime]);

  const formatTimeRemaining = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const percentRemaining = (timeRemaining / (5 * 60 * 1000)) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-background border border-red-500 rounded-lg overflow-hidden animate-pulse-slow">
        <div className="bg-red-500 p-6 text-white text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center">
              <AlertTriangle className="h-10 w-10 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-2">SYSTEM LOCKED</h2>
          <p className="text-white/80">Security protocol activated</p>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-center">
            <Shield className="h-6 w-6 text-red-500 mr-2" />
            <h3 className="text-xl font-semibold text-red-500">Security Alert</h3>
          </div>
          
          <p className="text-center">
            Multiple unauthorized access attempts have been detected.
            The system has entered self-destruct mode and is temporarily locked.
          </p>
          
          <div className="border border-red-200 bg-red-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-4 justify-center">
              <Lock className="h-5 w-5 text-red-600" />
              <span className="font-semibold text-red-600">Lockdown Active</span>
            </div>
            
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center">
                <Clock className="h-5 w-5 mr-2 text-gray-700" />
                <span className="text-2xl font-mono font-bold">{formatTimeRemaining(timeRemaining)}</span>
              </div>
              
              <Progress value={percentRemaining} className="h-2" />
              
              <p className="text-sm text-gray-500">
                Time remaining until system reactivation
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate("/")}
            >
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemLockScreen;
