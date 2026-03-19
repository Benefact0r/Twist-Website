import { Link } from "react-router-dom";
import { Home, Search, ArrowLeft } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <Layout>
      <div className="container py-20">
        <div className="max-w-md mx-auto text-center">
          {/* 404 illustration */}
          <div className="relative mb-8">
            <div className="text-[120px] md:text-[180px] font-bold text-muted/30 leading-none select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                <span className="text-4xl">🔍</span>
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-3">Page Not Found</h1>
          <p className="text-muted-foreground mb-8">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Link>
            </Button>
            <Button asChild>
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>

          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-4">
              Looking for something specific?
            </p>
            <Button variant="secondary" asChild>
              <Link to="/search">
                <Search className="h-4 w-4 mr-2" />
                Search Items
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
