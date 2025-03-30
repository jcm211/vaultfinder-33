
import { Link } from "react-router-dom";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileText, ChevronLeft } from "lucide-react";

const TermsOfService = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      
      <main className="flex-1 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link to="/">
              <Button variant="ghost" size="sm" className="mb-4">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Home
              </Button>
            </Link>
            
            <div className="flex items-center mb-6">
              <FileText className="h-6 w-6 text-primary mr-2" />
              <h1 className="text-3xl font-bold">Terms of Service</h1>
            </div>
            
            <p className="text-gray-500 mb-6">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            
            <Separator className="mb-8" />
            
            <div className="prose prose-gray max-w-none">
              <h2>Agreement to Terms</h2>
              <p>
                By accessing or using Lumina Search, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this service.
              </p>
              
              <h2>Use License</h2>
              <p>
                Permission is granted to temporarily use Lumina Search for personal, non-commercial search purposes only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul>
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>Attempt to decompile or reverse engineer any software contained in Lumina Search</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              </ul>
              
              <h2>Disclaimer</h2>
              <p>
                The materials on Lumina Search are provided on an 'as is' basis. Lumina Search makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
              
              <h2>Limitations</h2>
              <p>
                In no event shall Lumina Search or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use Lumina Search, even if Lumina Search or a Lumina Search authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
              
              <h2>Security Measures</h2>
              <p>
                Lumina Search employs various security measures to protect against unauthorized access, including but not limited to:
              </p>
              <ul>
                <li>Firewall content filtering</li>
                <li>Automated security protocols</li>
                <li>Anti-malware protection</li>
                <li>System lockdown in case of suspected security breaches</li>
              </ul>
              <p>
                Users are prohibited from attempting to circumvent these security measures or to test the security vulnerabilities of the system.
              </p>
              
              <h2>Accuracy of Materials</h2>
              <p>
                The materials appearing on Lumina Search could include technical, typographical, or photographic errors. Lumina Search does not warrant that any of the materials on its service are accurate, complete or current. Lumina Search may make changes to the materials contained on its service at any time without notice.
              </p>
              
              <h2>Links</h2>
              <p>
                Lumina Search has not reviewed all of the sites linked to in its search results and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Lumina Search. Use of any such linked website is at the user's own risk.
              </p>
              
              <h2>Modifications</h2>
              <p>
                Lumina Search may revise these terms of service at any time without notice. By using this service you are agreeing to be bound by the then current version of these terms of service.
              </p>
              
              <h2>Governing Law</h2>
              <p>
                These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TermsOfService;
