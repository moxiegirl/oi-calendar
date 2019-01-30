import React, { Component } from "react";
import { connect } from "react-redux";
import App from "./App";

import ConnectedEventCalendar from "./redux-event-calendar";
import ConnectedEventDetails from "./redux-event-details";
import ConnectedUserProfile from "./redux-user-profile";
import ConnectedGuestList from "./redux-guest-list";

import registerServiceWorker from "./registerServiceWorker";
import { createInitialStore, storeAfterAppMount } from "../store/storeManager";
import { SET_VIEW } from "../store/ActionTypes";

let store = createInitialStore();

// #############################################################################################
// :NOTE: Declaring all views instead of blindly passing store to all subcomponents, even the dumb ones.
// This will make it possible to write alternative versions of the app with different stores for each component

const PlaceHolder = props => {
  return <div />;
};

let views = {
  EventCalendar: props => {
    return <ConnectedEventCalendar store={store} {...props} />;
  },
  UserProfile: props => {
    return <ConnectedUserProfile store={store} {...props} />;
  },
  EventDetails: PlaceHolder,
  GuestList: PlaceHolder
};
store.dispatch({ type: SET_VIEW, payload: views });

const ConnectedApp = connect((state, redux) => {
  const { EventCalendar, UserProfile } = state.view || {
    EventCalendar: PlaceHolder,
    UserProfile: PlaceHolder
  };
  return {
    views: {
      UserProfile,
      EventCalendar
    }
  };
})(App);

class DynamicApp extends Component {
  render() {
    return <ConnectedApp store={store} />;
  }
  componentDidMount() {
    storeAfterAppMount(store, () => {
      this.forceUpdate();
    });

    import("./redux-event-details").then(
      ({ default: ConnectedEventDetails }) => {
        const EventDetails = props => {
          return <ConnectedEventDetails store={store} {...props} />;
        };
        store.dispatch({ type: SET_VIEW, payload: { EventDetails } });
      }
    );
    import("./redux-guest-list").then(({ default: ConnectedGuestList }) => {
      const GuestList = props => {
        return <ConnectedGuestList store={store} {...props} />;
      };
      store.dispatch({ type: SET_VIEW, payload: { GuestList } });
    });

    import("../store/event/eventAction").then(({ initializeEvents }) => {
      store.dispatch(initializeEvents());
    });
  }
}

registerServiceWorker();

export default <DynamicApp />;