var EventBox = React.createClass({
  render: function() {
    return(
      <div className="eventBox">
        <h1>Events</h1>
        <EventList />
        <EventForm />
      </div>
    );
  }
});

var EventList = React.createClass({
  render: function() {
    return(
      <div className="eventList">
        I am a EventList!
      </div>
    );
  }
});

var EventForm = React.createClass({
  render: function() {
    return(
      <div className="eventForm">
        I am a EventForm!
      </div>
    );
  }
});
