
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useSearch } from "@/context/SearchContext";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Shield,
  History,
  RotateCcw,
  Trash2,
  AlertTriangle,
  ChevronRight,
  Settings,
  Lock,
  Users,
  Building,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Admin = () => {
  const { user, isAuthenticated, resetSystem } = useAuth();
  const { searchHistory, clearHistory } = useSearch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isResetting, setIsResetting] = useState(false);

  if (!isAuthenticated || user?.role !== "admin") {
    navigate("/login");
    return null;
  }

  // Check if the current user is the CEO (MWTINC)
  const isCEO = user?.username === "MWTINC";

  const handleSystemReset = async () => {
    // Only allow reset if user is CEO
    if (!isCEO) {
      toast({
        title: "Access Denied",
        description: "Only the CEO has permission to reset the system.",
        variant: "destructive",
      });
      return;
    }
    
    setIsResetting(true);
    try {
      const success = await resetSystem();
      if (success) {
        toast({
          title: "System Reset Successful",
          description: "All settings have been restored to defaults.",
        });
      } else {
        toast({
          title: "Reset Failed",
          description: "An error occurred during system reset.",
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
      setIsResetting(false);
    }
  };

  const handleClearHistory = () => {
    clearHistory();
    toast({
      title: "History Cleared",
      description: "Search history has been cleared successfully.",
    });
  };

  const adminTeam = [
    { username: "MWTINC", department: "Executive", title: "CEO", isOnline: true },
    { username: "LuminaAdmin", department: "Technology", title: "Lead Developer", isOnline: false },
    { username: "SecurityTeam", department: "Security", title: "Security Analyst", isOnline: true },
    { username: "ContentManager", department: "Content", title: "Content Director", isOnline: false },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      
      <main className="flex-1 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold mb-2">Admin Control Panel</h1>
              <p className="text-gray-500">
                Manage your search engine settings and security options
              </p>
            </div>
            
            <div className="mt-4 md:mt-0">
              {isCEO ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="space-x-2">
                      <RotateCcw className="h-4 w-4" />
                      <span>Reset System</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="animate-scale-in">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will reset all settings to their default values, clear search history,
                        and restore firewall configurations. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleSystemReset}
                        disabled={isResetting}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {isResetting ? "Resetting..." : "Reset System"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <Button 
                  variant="destructive" 
                  className="space-x-2"
                  disabled={true}
                  title="Only the CEO can reset the system"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Reset System</span>
                </Button>
              )}
            </div>
          </div>
          
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="history">Search History</TabsTrigger>
              <TabsTrigger value="team">Admin Team</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center text-lg">
                      <Shield className="h-5 w-5 mr-2 text-primary" />
                      Firewall Status
                    </CardTitle>
                    <CardDescription>Security system status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <span className="font-medium">Active & Protected</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full justify-between" 
                      onClick={() => navigate("/admin/firewall")}
                    >
                      <span>Manage Firewall</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center text-lg">
                      <History className="h-5 w-5 mr-2 text-primary" />
                      Search History
                    </CardTitle>
                    <CardDescription>Recent search activity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{searchHistory.length}</p>
                    <p className="text-sm text-gray-500">Total searches</p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full justify-between"
                      onClick={() => document.getElementById("history-tab")?.click()}
                    >
                      <span>View History</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center text-lg">
                      <Users className="h-5 w-5 mr-2 text-primary" />
                      Admin Team
                    </CardTitle>
                    <CardDescription>Team access management</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{adminTeam.length}</p>
                    <p className="text-sm text-gray-500">Team members</p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full justify-between"
                      onClick={() => document.getElementById("team-tab")?.click()}
                    >
                      <span>View Team</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
                    Security Notifications
                  </CardTitle>
                  <CardDescription>Recent security alerts and notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
                      <div className="flex items-start">
                        <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                          <Shield className="h-3 w-3 text-green-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-green-800">Firewall Active</h4>
                          <p className="text-xs text-green-600 mt-1">
                            Your firewall is active and protecting your search engine from threats.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                      <div className="flex items-start">
                        <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                          <Lock className="h-3 w-3 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-blue-800">Admin Access Secured</h4>
                          <p className="text-xs text-blue-600 mt-1">
                            Your admin panel is secured with multi-user password protection.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security" className="animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>Firewall Configuration</CardTitle>
                  <CardDescription>
                    Manage security settings and access controls
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Current Security Level</h3>
                      <div className="p-4 bg-green-50 border border-green-100 rounded-lg flex items-center">
                        <Shield className="h-5 w-5 text-green-600 mr-3" />
                        <div>
                          <p className="font-medium text-green-800">Medium</p>
                          <p className="text-xs text-green-600">Standard protection for most use cases</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Firewall Status</h3>
                      <div className="p-4 bg-green-50 border border-green-100 rounded-lg flex items-center">
                        <div className="h-3 w-3 rounded-full bg-green-500 mr-3"></div>
                        <div>
                          <p className="font-medium text-green-800">Active</p>
                          <p className="text-xs text-green-600">Providing protection since system startup</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Security Features</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
                          <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-sm">Content Filtering</span>
                      </li>
                      <li className="flex items-center">
                        <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
                          <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-sm">Allowed Domains Restriction</span>
                      </li>
                      <li className="flex items-center">
                        <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
                          <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-sm">Malicious Query Protection</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => navigate("/admin/firewall")}>
                    Advanced Configuration
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="history" className="animate-fade-in" id="history-tab">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Search History</CardTitle>
                    <CardDescription>
                      View and manage recent search queries
                    </CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={handleClearHistory}
                    disabled={searchHistory.length === 0}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear History
                  </Button>
                </CardHeader>
                <CardContent>
                  {searchHistory.length === 0 ? (
                    <div className="text-center py-8">
                      <History className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No search history found</p>
                    </div>
                  ) : (
                    <div className="rounded-lg border overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50 border-b">
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Query
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {searchHistory.map((query, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-4 py-3">
                                <span className="text-sm font-medium text-gray-900">
                                  {query}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => navigate(`/results?q=${encodeURIComponent(query)}`)}
                                  className="h-8 px-2"
                                >
                                  <ChevronRight className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="team" className="animate-fade-in" id="team-tab">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Admin Team</CardTitle>
                    <CardDescription>
                      Lumina Search administrative team members
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 border-b">
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Username
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Department
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Title
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {adminTeam.map((admin, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <span className="text-sm font-medium text-gray-900">
                                {admin.username}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                <Building className="h-3.5 w-3.5 text-gray-400 mr-1.5" />
                                <span className="text-sm text-gray-700">
                                  {admin.department}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm text-gray-700">
                                {admin.title}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                <div className={`h-2.5 w-2.5 rounded-full ${admin.isOnline ? 'bg-green-500' : 'bg-gray-300'} mr-2`}></div>
                                <span className="text-sm text-gray-700">
                                  {admin.isOnline ? 'Online' : 'Offline'}
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                    <h3 className="font-medium text-blue-800 mb-2">Admin Team Information</h3>
                    <p className="text-sm text-blue-600">
                      The Lumina Search administrative team consists of members from different departments,
                      each responsible for various aspects of the search engine's security and functionality.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin;
