import { Suspense, lazy } from "react";
import { Route, Switch } from "wouter";

const Room = lazy(() => import("@/pages/room"));
const Home = lazy(() => import("@/pages/home"));

import Loading from "@/components/ui/loading";
import Header from "@/components/header/header";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import RoomControls from "@/components/room/room-controls";
import { ThemeProvider } from "@/components/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <TooltipProvider>
        <Header />
        <Suspense fallback={<Loading />}>
          <Switch>
            <Route path="/:roomId" component={Room} />
            <Route component={Home} />
          </Switch>
        </Suspense>
        <RoomControls />
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
