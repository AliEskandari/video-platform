import { lazy, Suspense } from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import * as ROUTES from "./constants/routes";
import Navbar from "./components/navbar";
import Video from "./pages/video";
import Channel from "./pages/channel";

const Home = lazy(() => import("./pages/home"));

function App() {
  return (
    <Container className="App">
      <Router>
        <Navbar />
        <Suspense fallback={<p>Loading...</p>}>
          <Switch>
            <Route exact path={ROUTES.HOME} component={Home} />
            <Route exact path={ROUTES.VIDEO} component={Video} />
            <Route exact path={ROUTES.CHANNEL} component={Channel} />
          </Switch>
        </Suspense>
      </Router>
    </Container>
  );
}

export default App;
