var React = require("react");
var Grid = require("react-bootstrap").Grid;
var SessionStore = require("../../stores/session_store");
var DiscoverStore = require("../../stores/discover_store");
var DiscoverActions = require("../../actions/discover_actions");
var Hero = require("./hero");
var RandomTracks = require("./random_tracks");
var Join = require("./join");

var HomePage = React.createClass({
  getInitialState: function () {
    return this.getStateFromStore();
  },

  getStateFromStore: function () {
    return {
      tracks: DiscoverStore.all(),
      isLoggedIn: SessionStore.isLoggedIn()
    };
  },

  componentWillMount: function () {
    var isLoggedIn = SessionStore.isLoggedIn();

    if (isLoggedIn) { this.goToDiscover(); }

    DiscoverActions.fetchTracks();
  },

  componentDidMount: function () {
    this.sessionListener = SessionStore.addListener(this._onChange);
    this.discoverListener = DiscoverStore.addListener(this._onChange);
  },

  componentWillUpdate: function (nextProps, nextState) {
    if (nextState.isLoggedIn) { this.goToDiscover(); }
  },

  componentWillUnmount: function () {
    this.sessionListener.remove();
    this.discoverListener.remove();
  },

  _onChange: function () {
    this.setState(this.getStateFromStore());
  },

  goToDiscover: function () {
    this.props.history.pushState(null, "/discover");
  },

  render: function () {
    return (
      <main className="home-page">
        <Hero goToDiscover={ this.goToDiscover } />

        <RandomTracks tracks={ this.state.tracks }
          goToDiscover={ this.goToDiscover } />

        <Join />
      </main>
    );
  }
});

module.exports = HomePage;