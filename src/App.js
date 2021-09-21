import { lazy, Suspense } from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import * as ROUTES from "./constants/routes";

import Navbar from "./components/navbar";
import Video from "./pages/video";
import Channel from "./pages/channel";
import Upload from "./pages/upload";
import SignIn from "./pages/sign-in";
import SignUp from "./pages/sign-up";
import Profile from "./pages/profile";
import Settings from "./pages/settings";
import Payments from "./pages/payments";
import Banking from "./pages/banking";
import ScrollToTop from "./components/scroll-to-top";

const Home = lazy(() => import("./pages/home"));

function App() {
  return (
    <Container className="App">
      <Router>
        <ScrollToTop />
        <Suspense fallback={<p>Loading...</p>}>
          <Switch>
            <Route exact path={ROUTES.SIGN_IN} component={SignIn} />
            <Route exact path={ROUTES.SIGN_UP} component={SignUp} />
            <Route path={ROUTES.HOME}>
              <Navbar />
              <Switch>
                <Route exact path={ROUTES.HOME} component={Home} />
                <Route exact path={ROUTES.VIDEO} component={Video} />
                <Route exact path={ROUTES.CHANNEL} component={Channel} />
                <Route exact path={ROUTES.UPLOAD} component={Upload} />
                <Route exact path={ROUTES.PROFILE} component={Profile} />
                <Route exact path={ROUTES.SETTINGS} component={Settings} />
                <Route exact path={ROUTES.PAYMENTS} component={Payments} />
                <Route exact path={ROUTES.BANKING} component={Banking} />
              </Switch>
            </Route>
          </Switch>
        </Suspense>
      </Router>
    </Container>
  );
}

export default App;
