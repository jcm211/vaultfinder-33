
import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSearch } from "@/context/SearchContext";
import NavBar from "@/components/NavBar";
import SearchBar from "@/components/SearchBar";
import SearchResults from "@/components/SearchResults";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Results = () => {
  const { search, query, setQuery } = useSearch();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryParam = searchParams.get("q");

  useEffect(() => {
    if (queryParam && queryParam !== query) {
      setQuery(queryParam);
      search(queryParam);
    } else if (!queryParam && !query) {
      // If no query parameter and no current query, redirect to home
      navigate("/");
    }
  }, [queryParam, search, query, setQuery, navigate]);

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavBar />
      
      <div className="border-b border-gray-100 py-4 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <SearchBar size="md" />
        </div>
      </div>
      
      <main className="flex-1 py-6 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-500 hover:text-gray-700"
              onClick={handleBackToHome}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
          
          <SearchResults />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Results;
