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
        <Event author="Foobar1">This is one</Event>
        <Event author="Foobar2">This is two</Event>
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

var Event = React.createClass({
  render: function() {
    return(
      <div className="event">
        <h2 className="eventAuthor">
          {this.props.author}
        </h2>
        {this.props.children}
      </div>
    );
  }
});
