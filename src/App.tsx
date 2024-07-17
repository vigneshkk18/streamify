import { Route, Switch } from "wouter";

import Room from "@/pages/room";
import Home from "@/pages/home";

import Header from "@/components/header/header";
import Background from "@/components/ui/background";
import { TooltipProvider } from "@/components/ui/tooltip";
import RoomControls from "@/components/room/room-controls";
import { ThemeProvider } from "@/components/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
      <TooltipProvider>
        {/* <Background /> */}
        <Header />
        <Switch>
          <Route path="/:roomId/:peerType" component={Room} />
          <Route component={Home} />
        </Switch>
        {/* <RoomControls /> */}
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
