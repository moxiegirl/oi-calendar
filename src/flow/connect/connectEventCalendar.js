import { connect } from "react-redux";

import { setCurrentEvent } from "../store/event/eventAction";

export default connect(
  (state, redux) => {
    const { events, auth } = state;
    const { EventDetails } = state.lazy;
    const signedIn = !!auth.user;
    console.log("[CALENDAR_REDUX]", events);
    const { currentEvent, currentEventType } = events || {};
    let eventModal;
    if (currentEvent) {
      const eventType = currentEventType || "view"; // "add", "edit", "read-only"
      const eventInfo = currentEvent;
      eventModal = { eventType, eventInfo };
    }

    return {
      events,
      signedIn,
      views: {
        EventDetails
      },
      eventModal
    };
  },
  dispatch => {
    return {
      initializeEvents: () => {},
      pickEventModal: eventModal => {
        console.log("[pickEventModal]", eventModal);
        const {
          eventType: currentEventType,
          eventInfo: currentEvent
        } = eventModal;
        dispatch(setCurrentEvent({ currentEvent, currentEventType }));
      }
    };
  }
);
