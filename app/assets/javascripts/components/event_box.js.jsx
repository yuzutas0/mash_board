var EventBox = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(result) {
        this.setState({data: result.data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
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
