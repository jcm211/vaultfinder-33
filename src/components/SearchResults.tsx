
import { useEffect, useRef, useState } from "react";
import { useSearch, SearchResult } from "@/context/SearchContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Globe, Calendar, Star, FileText, Video, ShoppingBag, FileCode } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";

const RESULTS_PER_PAGE = 5;

const SearchResults = () => {
  const { results, isLoading, query } = useSearch();
  const resultsRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate total pages and current page results
  const totalPages = Math.ceil(results.length / RESULTS_PER_PAGE);
  const paginatedResults = results.slice(
    (currentPage - 1) * RESULTS_PER_PAGE,
    currentPage * RESULTS_PER_PAGE
  );

  useEffect(() => {
    // Reset pagination when results change
    setCurrentPage(1);
    
    // Scroll to top when results change
    if (resultsRef.current) {
      resultsRef.current.scrollTop = 0;
    }
  }, [results]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of results when page changes
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-3xl mx-auto py-4 animate-fade-in">
        <div className="mb-6">
          <Skeleton className="h-7 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="mb-6">
          <Skeleton className="h-7 w-2/3 mb-2" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-4/5" />
        </div>
        <div className="mb-6">
          <Skeleton className="h-7 w-4/5 mb-2" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (results.length === 0 && query) {
    return (
      <div className="w-full max-w-3xl mx-auto py-8 text-center animate-fade-in">
        <div className="rounded-full bg-gray-100 h-16 w-16 flex items-center justify-center mx-auto mb-4">
          <Globe className="h-8 w-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold mb-2">No results found</h2>
        <p className="text-gray-500">
          We couldn't find any results for "{query}". Please try a different search term.
        </p>
      </div>
    );
  }

  return (
    <div ref={resultsRef} className="w-full max-w-3xl mx-auto">
      <p className="text-sm text-gray-500 mb-4">
        {results.length} results for "{query}"
      </p>
      
      <div className="space-y-6 mb-8">
        {paginatedResults.map((result) => (
          <ResultItem key={result.id} result={result} />
        ))}
      </div>
      
      {totalPages > 1 && (
        <Pagination className="my-6">
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} 
                  className="cursor-pointer" />
              </PaginationItem>
            )}
            
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => handlePageChange(i + 1)}
                  isActive={currentPage === i + 1}
                  className="cursor-pointer"
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext onClick={() => handlePageChange(currentPage + 1)} 
                  className="cursor-pointer" />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

const getContentTypeIcon = (contentType?: string) => {
  switch (contentType) {
    case 'article':
      return <FileText className="h-3 w-3" />;
    case 'video':
      return <Video className="h-3 w-3" />;
    case 'product':
      return <ShoppingBag className="h-3 w-3" />;
    case 'document':
      return <FileCode className="h-3 w-3" />;
    default:
      return <Globe className="h-3 w-3" />;
  }
};

const ResultItem = ({ result }: { result: SearchResult }) => {
  return (
    <div className="group animate-fade-in">
      <div className="flex items-start">
        {result.favicon ? (
          <img 
            src={result.favicon} 
            alt="Favicon" 
            className="h-5 w-5 mr-3 mt-1"
            onError={(e) => {
              e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23d1d5db' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cline x1='2' y1='12' x2='22' y2='12'%3E%3C/line%3E%3Cpath d='M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'%3E%3C/path%3E%3C/svg%3E";
            }}
          />
        ) : (
          <Globe className="h-5 w-5 mr-3 mt-1 text-gray-400" />
        )}
        
        <div className="flex-1">
          <a 
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <h3 className="text-lg font-medium text-primary group-hover:underline mb-1">
              {result.title}
            </h3>
            
            <div className="flex items-center text-sm text-gray-500 mb-1">
              <span className="truncate">{result.url}</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 mb-2 text-xs">
              {result.domain && (
                <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                  <Globe className="h-3 w-3 mr-1" />
                  {result.domain}
                </Badge>
              )}
              
              {result.date && (
                <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                  <Calendar className="h-3 w-3 mr-1" />
                  {result.date}
                </Badge>
              )}
              
              {result.contentType && (
                <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                  {getContentTypeIcon(result.contentType)}
                  <span className="ml-1 capitalize">{result.contentType}</span>
                </Badge>
              )}
              
              {result.relevanceScore && (
                <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                  <Star className="h-3 w-3 mr-1" />
                  {result.relevanceScore}%
                </Badge>
              )}
            </div>
            
            <p className="text-gray-700 text-sm">
              {result.description}
            </p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
