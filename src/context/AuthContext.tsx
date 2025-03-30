
import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface User {
  username: string;
  role: "admin" | "user";
  department?: string;
  title?: string;
}

interface AdminUser {
  username: string;
  password: string;
  role: "admin";
  department: string;
  title: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  resetSystem: () => Promise<boolean>;
  loginAttempts: number;
  systemLocked: boolean;
  lockoutEndTime: Date | null;
  resetLoginAttempts: () => void;
}

// Add multiple admin credentials
const adminUsers: AdminUser[] = [
  {
    username: "MWTINC",
    password: "JC222@Vemous$24",
    role: "admin",
    department: "Executive",
    title: "Chief Security Officer"
  },
  {
    username: "LuminaAdmin",
    password: "Lumina#2024!",
    role: "admin",
    department: "Technology",
    title: "Lead Developer"
  },
  {
    username: "SecurityTeam",
    password: "Secure@Lumina789",
    role: "admin",
    department: "Security",
    title: "Security Analyst"
  },
  {
    username: "ContentManager",
    password: "Content$2024#",
    role: "admin",
    department: "Content",
    title: "Content Director"
  }
];

const MAX_LOGIN_ATTEMPTS = 3;
const LOCKOUT_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [systemLocked, setSystemLocked] = useState(false);
  const [lockoutEndTime, setLockoutEndTime] = useState<Date | null>(null);
  const { toast } = useToast();

  // Initialize system state
  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
      }
    }

    // Check if system is locked
    const storedLockState = localStorage.getItem("systemLocked");
    const storedLockoutEndTime = localStorage.getItem("lockoutEndTime");
    
    if (storedLockState === "true" && storedLockoutEndTime) {
      const endTime = new Date(storedLockoutEndTime);
      
      if (endTime > new Date()) {
        // System is still locked
        setSystemLocked(true);
        setLockoutEndTime(endTime);
        
        // Set a timeout to unlock the system when the lockout period ends
        const timeRemaining = endTime.getTime() - new Date().getTime();
        setTimeout(() => {
          unlockSystem();
        }, timeRemaining);
      } else {
        // Lockout period has ended
        unlockSystem();
      }
    }

    // Check login attempts
    const storedLoginAttempts = localStorage.getItem("loginAttempts");
    if (storedLoginAttempts) {
      setLoginAttempts(parseInt(storedLoginAttempts, 10));
    }
  }, []);

  const unlockSystem = () => {
    setSystemLocked(false);
    setLockoutEndTime(null);
    localStorage.removeItem("systemLocked");
    localStorage.removeItem("lockoutEndTime");
    
    toast({
      title: "System Unlocked",
      description: "The system is now unlocked and operational.",
    });
  };

  const activateSelfDestruct = () => {
    setSystemLocked(true);
    const endTime = new Date(new Date().getTime() + LOCKOUT_DURATION);
    setLockoutEndTime(endTime);
    
    // Store lockout state and end time in localStorage
    localStorage.setItem("systemLocked", "true");
    localStorage.setItem("lockoutEndTime", endTime.toISOString());
    
    toast({
      title: "Security Alert",
      description: "Too many failed login attempts. System is now locked for 5 minutes.",
      variant: "destructive",
    });
    
    // Set a timeout to unlock the system when the lockout period ends
    setTimeout(() => {
      unlockSystem();
    }, LOCKOUT_DURATION);
  };

  const resetLoginAttempts = () => {
    setLoginAttempts(0);
    localStorage.setItem("loginAttempts", "0");
  };

  const incrementLoginAttempts = () => {
    const newAttempts = loginAttempts + 1;
    setLoginAttempts(newAttempts);
    localStorage.setItem("loginAttempts", newAttempts.toString());
    
    if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
      activateSelfDestruct();
    }
    
    return newAttempts;
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    // Don't allow login if system is locked
    if (systemLocked) {
      toast({
        title: "System Locked",
        description: "The system is currently in lockdown mode. Please try again later.",
        variant: "destructive",
      });
      return false;
    }
    
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Check against all admin users
    const matchedUser = adminUsers.find(
      admin => admin.username === username && admin.password === password
    );

    if (matchedUser) {
      const user = { 
        username: matchedUser.username, 
        role: matchedUser.role,
        department: matchedUser.department,
        title: matchedUser.title
      };
      setUser(user);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(user));
      resetLoginAttempts();
      return true;
    }

    // Increment login attempts on failed login
    incrementLoginAttempts();
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  };

  const resetSystem = async (): Promise<boolean> => {
    // Simulate system reset
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Clear stored settings
    localStorage.removeItem("firewallSettings");
    localStorage.removeItem("searchSettings");
    localStorage.removeItem("searchHistory");
    
    // Reset security state
    resetLoginAttempts();
    if (systemLocked) {
      unlockSystem();
    }
    
    // Re-initialize with defaults
    const defaultFirewallSettings = {
      enabled: true,
      blockUnauthorizedIps: true,
      allowedDomains: ["*.google.com", "*.bing.com", "*.duckduckgo.com"],
      blockWords: ["malware", "phishing", "exploit"],
      securityLevel: "medium",
    };
    
    localStorage.setItem("firewallSettings", JSON.stringify(defaultFirewallSettings));
    
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        resetSystem,
        loginAttempts,
        systemLocked,
        lockoutEndTime,
        resetLoginAttempts,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
