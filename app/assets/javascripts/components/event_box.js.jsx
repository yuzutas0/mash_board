var EventBox = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  render: function() {
    return(
      <div className="eventBox">
        <h1>Events</h1>
        <EventList data={this.state.data} />
        <EventForm />
      </div>
    );
  }
});

var EventList = React.createClass({
  render: function() {
    var eventNodes = this.props.data.map(function (event) {
      return (
        <Event author={event.author}>
          {event.text}
        </Event>
      );
    });
    return(
      <div className="eventList">
        {eventNodes}
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
