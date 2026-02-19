import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DemoProvider } from "@/lib/demo-context";
import { TransactionStoreProvider } from "@/lib/transaction-store";
import Index from "./pages/Index";
import Simulate from "./pages/Simulate";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DemoProvider>
        <TransactionStoreProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/simulate" element={<Simulate />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TransactionStoreProvider>
      </DemoProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
