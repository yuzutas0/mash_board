var EventBox = React.createClass({
  loadEventsFromServer: function(url) {
    $.ajax({
      url: url,
      dataType: 'json',
      success: function(result) {
        this.setState({data: result.data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadEventsFromServer(this.props.url);
  },
  handleEventSubmit: function(keyword) {
    var url = this.props.url + '/' + keyword;
    this.loadEventsFromServer(url);
  },
  render: function() {
    return(
      <div className="eventBox">
        <h1>Events</h1>
        <EventList data={this.state.data} />
        <EventForm onEventSubmit={this.handleEventSubmit} />
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
  handleSubmit: function(e) {
    e.preventDefault();
    var keyword = React.findDOMNode(this.refs.keyword).value.trim();
    if(!keyword){return;}
    this.props.onEventSubmit(keyword);
    React.findDOMNode(this.refs.keyword).value = '';
    return;
  },
  render: function() {
    return(
      <form className="eventForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Keyword" ref="keyword" />
        <input type="submit" value="Search" />
      </form>
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
