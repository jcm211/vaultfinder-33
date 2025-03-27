
import React, { createContext, useContext, useState, useEffect } from "react";

export interface SearchResult {
  id: string;
  title: string;
  url: string;
  description: string;
  favicon?: string;
  date?: string;
  domain?: string;
  relevanceScore?: number;
  contentType?: "article" | "video" | "product" | "service" | "document";
}

interface SearchContextType {
  query: string;
  results: SearchResult[];
  isLoading: boolean;
  setQuery: (query: string) => void;
  search: (query: string) => Promise<void>;
  searchHistory: string[];
  clearHistory: () => void;
}

interface FirewallSettings {
  enabled: boolean;
  blockUnauthorizedIps: boolean;
  allowedDomains: string[];
  blockWords: string[];
  securityLevel: "low" | "medium" | "high";
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [firewallSettings, setFirewallSettings] = useState<FirewallSettings>({
    enabled: true,
    blockUnauthorizedIps: true,
    allowedDomains: ["*.google.com", "*.bing.com", "*.duckduckgo.com"],
    blockWords: ["malware", "phishing", "exploit"],
    securityLevel: "medium",
  });

  // Load search history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem("searchHistory");
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error("Failed to parse search history:", error);
      }
    }

    const savedFirewallSettings = localStorage.getItem("firewallSettings");
    if (savedFirewallSettings) {
      try {
        setFirewallSettings(JSON.parse(savedFirewallSettings));
      } catch (error) {
        console.error("Failed to parse firewall settings:", error);
      }
    } else {
      // Store default settings
      localStorage.setItem("firewallSettings", JSON.stringify(firewallSettings));
    }
  }, []);

  // Save search history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  }, [searchHistory]);

  // Function to extract domain from URL
  const extractDomain = (url: string): string => {
    try {
      const hostname = new URL(url).hostname;
      return hostname.startsWith("www.") ? hostname.substring(4) : hostname;
    } catch (e) {
      return url.split('/')[0];
    }
  };

  // Enhanced mock search results with high-quality domains and more detailed information
  const mockSearchResults = (query: string): SearchResult[] => {
    // Filter out blocked words if firewall is enabled
    if (firewallSettings.enabled) {
      const isBlocked = firewallSettings.blockWords.some(word => 
        query.toLowerCase().includes(word.toLowerCase())
      );
      
      if (isBlocked) {
        return [];
      }
    }
    
    // Top-tier domains and trusted sources
    const highQualityDomains = [
      { domain: "github.com", favicon: "https://github.com/favicon.ico", relevance: 95 },
      { domain: "stackoverflow.com", favicon: "https://stackoverflow.com/favicon.ico", relevance: 92 },
      { domain: "developer.mozilla.org", favicon: "https://developer.mozilla.org/favicon.ico", relevance: 98 },
      { domain: "w3schools.com", favicon: "https://www.w3schools.com/favicon.ico", relevance: 90 },
      { domain: "harvard.edu", favicon: "https://www.harvard.edu/favicon.ico", relevance: 97 },
      { domain: "mit.edu", favicon: "https://www.mit.edu/favicon.ico", relevance: 96 },
      { domain: "stanford.edu", favicon: "https://www.stanford.edu/favicon.ico", relevance: 95 },
      { domain: "nature.com", favicon: "https://www.nature.com/favicon.ico", relevance: 94 },
      { domain: "cdc.gov", favicon: "https://www.cdc.gov/favicon.ico", relevance: 99 },
      { domain: "who.int", favicon: "https://www.who.int/favicon.ico", relevance: 99 },
      { domain: "nasa.gov", favicon: "https://www.nasa.gov/favicon.ico", relevance: 98 },
      { domain: "wikipedia.org", favicon: "https://en.wikipedia.org/favicon.ico", relevance: 91 },
      { domain: "nytimes.com", favicon: "https://www.nytimes.com/favicon.ico", relevance: 88 },
      { domain: "bbc.com", favicon: "https://www.bbc.com/favicon.ico", relevance: 89 },
      { domain: "economist.com", favicon: "https://www.economist.com/favicon.ico", relevance: 92 },
      { domain: "reuters.com", favicon: "https://www.reuters.com/favicon.ico", relevance: 93 },
      { domain: "nationalgeographic.com", favicon: "https://www.nationalgeographic.com/favicon.ico", relevance: 91 },
      { domain: "apple.com", favicon: "https://www.apple.com/favicon.ico", relevance: 87 },
      { domain: "microsoft.com", favicon: "https://www.microsoft.com/favicon.ico", relevance: 88 },
      { domain: "google.com", favicon: "https://www.google.com/favicon.ico", relevance: 90 },
    ];
    
    const queryTerms = query.toLowerCase().split(' ');
    
    // Generate dynamic results based on query
    let baseResults: SearchResult[] = [
      {
        id: "1",
        title: `${query} - Official Resource Guide`,
        url: `https://www.${query.toLowerCase().replace(/\s+/g, '-')}.org/resources`,
        description: `Comprehensive resource guide about ${query}. Includes expert analysis, research papers, and community contributions on all aspects of ${query}.`,
        favicon: "https://www.example.org/favicon.ico",
        date: "2023-10-15",
        contentType: "document",
        domain: `${query.toLowerCase().replace(/\s+/g, '-')}.org`,
        relevanceScore: 98
      },
      {
        id: "2",
        title: `${query} - Wikipedia, The Free Encyclopedia`,
        url: `https://en.wikipedia.org/wiki/${query.toLowerCase().replace(/\s+/g, '_')}`,
        description: `${query} is a term referring to various concepts across different fields. Learn more about the history, development, and contemporary applications of ${query}.`,
        favicon: "https://en.wikipedia.org/favicon.ico",
        date: "2023-11-02",
        contentType: "article",
        domain: "wikipedia.org",
        relevanceScore: 95
      },
      {
        id: "3",
        title: `Understanding ${query}: A Comprehensive Guide - MIT Press`,
        url: `https://mitpress.mit.edu/topics/${query.toLowerCase().replace(/\s+/g, '-')}`,
        description: `MIT Press presents a detailed exploration of ${query}, addressing its fundamental principles, historical development, and future implications across various disciplines.`,
        favicon: "https://mitpress.mit.edu/favicon.ico",
        date: "2023-09-18",
        contentType: "article",
        domain: "mitpress.mit.edu",
        relevanceScore: 97
      },
      {
        id: "4",
        title: `${query} Research Repository - Harvard University`,
        url: `https://research.harvard.edu/topics/${query.toLowerCase().replace(/\s+/g, '-')}`,
        description: `Harvard University's authoritative collection of research papers, studies, and academic resources related to ${query}. Features peer-reviewed contributions from leading experts.`,
        favicon: "https://harvard.edu/favicon.ico",
        date: "2023-10-22",
        contentType: "document",
        domain: "research.harvard.edu",
        relevanceScore: 96
      },
      {
        id: "5",
        title: `The Latest Developments in ${query} - Nature Journal`,
        url: `https://www.nature.com/subjects/${query.toLowerCase().replace(/\s+/g, '-')}`,
        description: `Nature Journal presents cutting-edge research, scientific breakthroughs, and expert analysis on ${query}. Stay informed with the most recent developments in this rapidly evolving field.`,
        favicon: "https://www.nature.com/favicon.ico",
        date: "2023-10-30",
        contentType: "article",
        domain: "nature.com",
        relevanceScore: 94
      },
      {
        id: "6",
        title: `${query} Documentation and Tutorials - MDN Web Docs`,
        url: `https://developer.mozilla.org/en-US/docs/${query.toLowerCase().replace(/\s+/g, '/')}`,
        description: `Comprehensive documentation, tutorials, and examples related to ${query}. MDN Web Docs provides reliable, developer-approved resources for understanding and implementing ${query} concepts.`,
        favicon: "https://developer.mozilla.org/favicon.ico",
        date: "2023-11-05",
        contentType: "document",
        domain: "developer.mozilla.org",
        relevanceScore: 98
      },
      {
        id: "7",
        title: `${query} Community Forum - Stack Exchange`,
        url: `https://stackexchange.com/questions/tagged/${query.toLowerCase().replace(/\s+/g, '-')}`,
        description: `Join discussions, ask questions, and share knowledge about ${query} with a community of experts and enthusiasts. Find solutions to common problems and insights on best practices.`,
        favicon: "https://stackexchange.com/favicon.ico",
        date: "2023-11-01",
        contentType: "service",
        domain: "stackexchange.com",
        relevanceScore: 92
      },
      {
        id: "8",
        title: `${query} Video Courses and Tutorials - EDX`,
        url: `https://www.edx.org/learn/${query.toLowerCase().replace(/\s+/g, '-')}`,
        description: `Learn ${query} through structured video courses, interactive tutorials, and practical examples. EDX offers courses from top universities and institutions worldwide.`,
        favicon: "https://www.edx.org/favicon.ico",
        date: "2023-10-12",
        contentType: "video",
        domain: "edx.org",
        relevanceScore: 91
      },
      {
        id: "9",
        title: `${query} Products and Solutions - Industry Leaders`,
        url: `https://www.industry-solutions.com/products/${query.toLowerCase().replace(/\s+/g, '-')}`,
        description: `Discover industry-leading products, services, and solutions related to ${query}. Compare features, specifications, and pricing to find the perfect match for your needs.`,
        favicon: "https://www.industry-solutions.com/favicon.ico",
        date: "2023-10-25",
        contentType: "product",
        domain: "industry-solutions.com",
        relevanceScore: 88
      },
      {
        id: "10",
        title: `${query} Open Source Projects - GitHub`,
        url: `https://github.com/topics/${query.toLowerCase().replace(/\s+/g, '-')}`,
        description: `Explore open-source projects, libraries, and tools related to ${query}. GitHub hosts thousands of community-contributed resources that you can use, modify, and learn from.`,
        favicon: "https://github.com/favicon.ico",
        date: "2023-11-07",
        contentType: "service",
        domain: "github.com",
        relevanceScore: 95
      },
      {
        id: "11",
        title: `${query} News and Updates - Reuters`,
        url: `https://www.reuters.com/topics/${query.toLowerCase().replace(/\s+/g, '-')}`,
        description: `Stay updated with the latest news, developments, and trends related to ${query}. Reuters provides accurate, timely, and unbiased coverage of events worldwide.`,
        favicon: "https://www.reuters.com/favicon.ico",
        date: "2023-11-08",
        contentType: "article",
        domain: "reuters.com",
        relevanceScore: 89
      },
      {
        id: "12",
        title: `${query} Standards and Guidelines - W3C`,
        url: `https://www.w3.org/standards/${query.toLowerCase().replace(/\s+/g, '-')}`,
        description: `Official standards, guidelines, and best practices for ${query}. The World Wide Web Consortium (W3C) develops and maintains internationally recognized standards to ensure compatibility and quality.`,
        favicon: "https://www.w3.org/favicon.ico",
        date: "2023-09-29",
        contentType: "document",
        domain: "w3.org",
        relevanceScore: 97
      },
    ];
    
    // Enhance results with randomly selected high-quality domains
    baseResults = baseResults.map((result, index) => {
      if (index % 3 === 0) { // Apply to every third result to maintain variety
        const randomDomain = highQualityDomains[Math.floor(Math.random() * highQualityDomains.length)];
        const path = result.url.split('/').slice(3).join('/');
        
        return {
          ...result,
          url: `https://${randomDomain.domain}/${path || ''}`,
          domain: randomDomain.domain,
          favicon: randomDomain.favicon,
          relevanceScore: randomDomain.relevance
        };
      }
      
      // For others, extract domain if not already set
      if (!result.domain) {
        result.domain = extractDomain(result.url);
      }
      
      return result;
    });
    
    // Apply security filtering based on security level
    if (firewallSettings.enabled) {
      switch (firewallSettings.securityLevel) {
        case "high":
          // Only return results from explicitly allowed domains
          return baseResults.filter(result => 
            firewallSettings.allowedDomains.some(domain => {
              const domainPattern = domain.replace("*.", "");
              return result.domain?.includes(domainPattern) || false;
            })
          ).slice(0, 7);
        case "medium":
          // Return most results but limit potentially risky ones
          return baseResults.slice(0, 9);
        case "low":
          // Return all results
          return baseResults;
        default:
          return baseResults;
      }
    }
    
    return baseResults;
  };

  const search = async (searchQuery: string): Promise<void> => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    
    // Add to search history if not already present
    if (!searchHistory.includes(searchQuery)) {
      setSearchHistory(prev => [searchQuery, ...prev].slice(0, 20));
    }

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const searchResults = mockSearchResults(searchQuery);
      setResults(searchResults);
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    setSearchHistory([]);
  };

  return (
    <SearchContext.Provider
      value={{
        query,
        results,
        isLoading,
        setQuery,
        search,
        searchHistory,
        clearHistory,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};
