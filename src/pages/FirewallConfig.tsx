
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Shield,
  Save,
  ChevronLeft,
  Plus,
  Trash2,
  RefreshCw,
  Lock,
  AlertTriangle,
  Check,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface FirewallSettings {
  enabled: boolean;
  blockUnauthorizedIps: boolean;
  allowedDomains: string[];
  blockWords: string[];
  securityLevel: "low" | "medium" | "high";
  malwareProtection: boolean;
  intrusionDetection: boolean;
  autoUpdateDefinitions: boolean;
  lastUpdated: string;
}

const FirewallConfig = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Early return BEFORE any hooks are used if not authenticated
  // This fixes the "rendered more hooks than previous render" error
  if (!isAuthenticated || user?.role !== "admin") {
    // Using useEffect here instead of direct navigation to avoid hooks rule violation
    useEffect(() => {
      navigate("/login");
    }, [navigate]);
    
    return null;
  }
  
  const [settings, setSettings] = useState<FirewallSettings>({
    enabled: true,
    blockUnauthorizedIps: true,
    allowedDomains: ["*.google.com", "*.bing.com", "*.duckduckgo.com"],
    blockWords: ["malware", "phishing", "exploit"],
    securityLevel: "medium",
    malwareProtection: true,
    intrusionDetection: true,
    autoUpdateDefinitions: true,
    lastUpdated: new Date().toISOString(),
  });
  
  const [newDomain, setNewDomain] = useState("");
  const [newBlockWord, setNewBlockWord] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem("firewallSettings");
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error("Failed to parse firewall settings:", error);
      }
    }
  }, []);

  const handleSaveSettings = () => {
    setIsSaving(true);
    
    // Simulate API delay
    setTimeout(() => {
      try {
        localStorage.setItem("firewallSettings", JSON.stringify({
          ...settings,
          lastUpdated: new Date().toISOString()
        }));
        
        toast({
          title: "Settings Saved",
          description: "Firewall configuration has been updated successfully.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to save settings. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSaving(false);
      }
    }, 800);
  };

  const updateMalwareDefinitions = () => {
    setIsUpdating(true);
    
    // Simulate API delay
    setTimeout(() => {
      try {
        setSettings({
          ...settings,
          lastUpdated: new Date().toISOString()
        });
        
        localStorage.setItem("firewallSettings", JSON.stringify({
          ...settings,
          lastUpdated: new Date().toISOString()
        }));
        
        toast({
          title: "Definitions Updated",
          description: "Malware protection definitions have been updated to the latest version.",
        });
      } catch (error) {
        toast({
          title: "Update Failed",
          description: "Failed to update malware definitions. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsUpdating(false);
      }
    }, 1500);
  };

  const addDomain = () => {
    if (!newDomain) return;
    
    if (!settings.allowedDomains.includes(newDomain)) {
      setSettings({
        ...settings,
        allowedDomains: [...settings.allowedDomains, newDomain],
      });
    }
    
    setNewDomain("");
  };

  const removeDomain = (domain: string) => {
    setSettings({
      ...settings,
      allowedDomains: settings.allowedDomains.filter(d => d !== domain),
    });
  };

  const addBlockWord = () => {
    if (!newBlockWord) return;
    
    if (!settings.blockWords.includes(newBlockWord)) {
      setSettings({
        ...settings,
        blockWords: [...settings.blockWords, newBlockWord],
      });
    }
    
    setNewBlockWord("");
  };

  const removeBlockWord = (word: string) => {
    setSettings({
      ...settings,
      blockWords: settings.blockWords.filter(w => w !== word),
    });
  };

  const formatLastUpdated = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      
      <main className="flex-1 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/admin")}
                className="mr-4"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold mb-2">Firewall & Security</h1>
                <p className="text-gray-500">
                  Advanced protection settings for your search engine
                </p>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Button
                variant="outline"
                onClick={() => navigate("/admin")}
                className="space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Cancel</span>
              </Button>
              <Button 
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{isSaving ? "Saving..." : "Save Changes"}</span>
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="filter">Content Filter</TabsTrigger>
              <TabsTrigger value="domains">Allowed Domains</TabsTrigger>
              <TabsTrigger value="malware">Malware Protection</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="animate-fade-in">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Shield className="h-5 w-5 mr-2 text-primary" />
                    Firewall Status
                  </CardTitle>
                  <CardDescription>Enable or disable the firewall protection</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="firewall-status" className="text-base">Firewall Protection</Label>
                      <p className="text-sm text-gray-500">
                        Enable comprehensive protection for your search engine
                      </p>
                    </div>
                    <Switch
                      id="firewall-status"
                      checked={settings.enabled}
                      onCheckedChange={(checked) => setSettings({ ...settings, enabled: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="block-ips" className="text-base">Block Unauthorized IPs</Label>
                      <p className="text-sm text-gray-500">
                        Restrict access based on IP address
                      </p>
                    </div>
                    <Switch
                      id="block-ips"
                      checked={settings.blockUnauthorizedIps}
                      onCheckedChange={(checked) => setSettings({ ...settings, blockUnauthorizedIps: checked })}
                      disabled={!settings.enabled}
                    />
                  </div>
                  
                  <div className="pt-2">
                    <Label htmlFor="security-level" className="text-base mb-2 block">Security Level</Label>
                    <Select
                      value={settings.securityLevel}
                      onValueChange={(value: "low" | "medium" | "high") => 
                        setSettings({ ...settings, securityLevel: value })
                      }
                      disabled={!settings.enabled}
                    >
                      <SelectTrigger id="security-level" className="w-full">
                        <SelectValue placeholder="Select security level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - Basic Protection</SelectItem>
                        <SelectItem value="medium">Medium - Standard Protection</SelectItem>
                        <SelectItem value="high">High - Maximum Protection</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-500 mt-2">
                      {settings.securityLevel === "low" && 
                        "Basic protection with minimal filtering. Suitable for trusted environments."}
                      {settings.securityLevel === "medium" && 
                        "Standard protection with balanced filtering. Recommended for most users."}
                      {settings.securityLevel === "high" && 
                        "Maximum protection with strict filtering. May block some legitimate content."}
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Protection Status</CardTitle>
                  <CardDescription>Current security configuration overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
                      <h3 className="font-medium text-green-800 mb-2">Active Protections</h3>
                      <ul className="space-y-2">
                        <li className="flex items-center">
                          <div className="h-4 w-4 rounded-full bg-green-200 flex items-center justify-center mr-2">
                            <svg className="h-2 w-2 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-sm text-green-800">Content filtering: {settings.blockWords.length} blocked terms</span>
                        </li>
                        <li className="flex items-center">
                          <div className="h-4 w-4 rounded-full bg-green-200 flex items-center justify-center mr-2">
                            <svg className="h-2 w-2 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-sm text-green-800">Allowed domains: {settings.allowedDomains.length} whitelisted</span>
                        </li>
                        <li className="flex items-center">
                          <div className="h-4 w-4 rounded-full bg-green-200 flex items-center justify-center mr-2">
                            <svg className="h-2 w-2 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-sm text-green-800">Security level: {settings.securityLevel}</span>
                        </li>
                        <li className="flex items-center">
                          <div className="h-4 w-4 rounded-full bg-green-200 flex items-center justify-center mr-2">
                            <svg className="h-2 w-2 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-sm text-green-800">Malware protection: {settings.malwareProtection ? 'Enabled' : 'Disabled'}</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                      <h3 className="font-medium text-blue-800 mb-1">Security Recommendations</h3>
                      <p className="text-sm text-blue-600">
                        {settings.securityLevel === "low" ? 
                          "Consider increasing your security level for better protection." : 
                          "Your security configuration is at a good level."}
                        {!settings.malwareProtection && " Enable malware protection for comprehensive security."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="filter" className="animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Content Filtering</CardTitle>
                  <CardDescription>
                    Block searches containing specific keywords or phrases
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="blocked-words" className="text-base mb-2 block">Blocked Keywords</Label>
                    <p className="text-sm text-gray-500 mb-4">
                      Searches containing these words will be blocked from displaying results
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {settings.blockWords.map((word) => (
                        <div 
                          key={word}
                          className="flex items-center bg-gray-100 rounded-full pl-3 pr-2 py-1"
                        >
                          <span className="text-sm text-gray-700 mr-1">{word}</span>
                          <button
                            type="button"
                            onClick={() => removeBlockWord(word)}
                            className="h-5 w-5 rounded-full flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                      
                      {settings.blockWords.length === 0 && (
                        <p className="text-sm text-gray-500 italic">No blocked words added yet</p>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Input
                        id="blocked-words"
                        placeholder="Enter keyword to block"
                        value={newBlockWord}
                        onChange={(e) => setNewBlockWord(e.target.value)}
                        className="flex-1"
                        disabled={!settings.enabled}
                      />
                      <Button 
                        onClick={addBlockWord}
                        disabled={!newBlockWord || !settings.enabled}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg">
                    <h3 className="font-medium text-amber-800 mb-1">Content Filtering Tips</h3>
                    <p className="text-sm text-amber-700">
                      Add specific words that should trigger content blocking. For best results, use exact 
                      keywords related to harmful or unwanted content.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="domains" className="animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Allowed Domains</CardTitle>
                  <CardDescription>
                    Manage domains that are allowed to appear in search results
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="allowed-domains" className="text-base mb-2 block">Whitelisted Domains</Label>
                    <p className="text-sm text-gray-500 mb-4">
                      Only these domains will be allowed in search results when security level is set to high
                    </p>
                    
                    <div className="rounded-lg border overflow-hidden mb-4">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50 border-b">
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Domain Pattern
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {settings.allowedDomains.map((domain) => (
                            <tr key={domain} className="hover:bg-gray-50">
                              <td className="px-4 py-3">
                                <span className="text-sm font-medium text-gray-900">
                                  {domain}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => removeDomain(domain)}
                                  className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                          
                          {settings.allowedDomains.length === 0 && (
                            <tr>
                              <td colSpan={2} className="px-4 py-6 text-center text-sm text-gray-500 italic">
                                No domains added yet
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Input
                        id="allowed-domains"
                        placeholder="Enter domain (e.g., *.example.com)"
                        value={newDomain}
                        onChange={(e) => setNewDomain(e.target.value)}
                        className="flex-1"
                        disabled={!settings.enabled}
                      />
                      <Button 
                        onClick={addDomain}
                        disabled={!newDomain || !settings.enabled}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                    <h3 className="font-medium text-blue-800 mb-1">Domain Pattern Tips</h3>
                    <p className="text-sm text-blue-600">
                      Use wildcards for subdomains. For example, <code className="bg-blue-100 px-1 rounded">*.example.com</code> will 
                      match any subdomain of example.com.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <p className="text-sm text-gray-500">
                    Domains are enforced when security level is set to "High"
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="malware" className="animate-fade-in">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Shield className="h-5 w-5 mr-2 text-red-500" />
                    Malware Protection
                  </CardTitle>
                  <CardDescription>
                    Advanced protection against malicious software and intrusions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="malware-protection" className="text-base">Malware Protection</Label>
                      <p className="text-sm text-gray-500">
                        Block access to domains known for hosting malware
                      </p>
                    </div>
                    <Switch
                      id="malware-protection"
                      checked={settings.malwareProtection}
                      onCheckedChange={(checked) => setSettings({ ...settings, malwareProtection: checked })}
                      disabled={!settings.enabled}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="intrusion-detection" className="text-base">Intrusion Detection</Label>
                      <p className="text-sm text-gray-500">
                        Detect and block suspicious access patterns
                      </p>
                    </div>
                    <Switch
                      id="intrusion-detection"
                      checked={settings.intrusionDetection}
                      onCheckedChange={(checked) => setSettings({ ...settings, intrusionDetection: checked })}
                      disabled={!settings.enabled || !settings.malwareProtection}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-update" className="text-base">Auto-Update Definitions</Label>
                      <p className="text-sm text-gray-500">
                        Automatically update protection against the latest threats
                      </p>
                    </div>
                    <Switch
                      id="auto-update"
                      checked={settings.autoUpdateDefinitions}
                      onCheckedChange={(checked) => setSettings({ ...settings, autoUpdateDefinitions: checked })}
                      disabled={!settings.enabled || !settings.malwareProtection}
                    />
                  </div>
                  
                  <div className="pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <Label className="text-base mb-1 block">Definitions Last Updated</Label>
                      <div className="flex items-center">
                        <Badge variant="secondary" className="mr-2">
                          {formatLastUpdated(settings.lastUpdated)}
                        </Badge>
                        {settings.autoUpdateDefinitions && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <Check className="h-3 w-3 mr-1" />
                            Auto-updates enabled
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      onClick={updateMalwareDefinitions}
                      disabled={isUpdating || !settings.enabled || !settings.malwareProtection}
                      className="space-x-2"
                    >
                      <RefreshCw className={`h-4 w-4 ${isUpdating ? 'animate-spin' : ''}`} />
                      <span>{isUpdating ? "Updating..." : "Update Now"}</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Threat Statistics</CardTitle>
                  <CardDescription>
                    Summary of detected and blocked threats
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4">
                      <div className="text-3xl font-bold text-red-500 mb-1">24</div>
                      <p className="text-sm text-gray-500">Malware attempts blocked</p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="text-3xl font-bold text-amber-500 mb-1">18</div>
                      <p className="text-sm text-gray-500">Suspicious queries detected</p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="text-3xl font-bold text-green-500 mb-1">99.8%</div>
                      <p className="text-sm text-gray-500">Security effectiveness</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-amber-50 border border-amber-100 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                      <h3 className="font-medium text-amber-800">Recent Threats</h3>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                          <Lock className="h-3 w-3 text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Malicious File Detected</p>
                          <p className="text-xs text-gray-500">
                            Blocked attempt to serve malicious JavaScript from external domain.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                          <AlertTriangle className="h-3 w-3 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Suspicious Query Pattern</p>
                          <p className="text-xs text-gray-500">
                            Multiple automated queries detected from single IP source.
                          </p>
                        </div>
                      </div>
                    </div>
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

export default FirewallConfig;
