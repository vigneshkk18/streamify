import { Route, Switch } from "wouter";
import Room from "@/pages/room";
import home from "@/pages/home";

function App() {
  return (
    <Switch>
      <Route path="/:roomId" component={Room} />
      <Route component={home} />
    </Switch>
  );
}

export default App;
