import { Route, Switch } from "wouter";

import Room from "@/pages/room";
import Home from "@/pages/home";

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
        <Switch>
          <Route path="/:roomId" component={Room} />
          <Route component={Home} />
        </Switch>
        <RoomControls />
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
