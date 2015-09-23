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
        <header>
          <h1><i className="fa fa-bar-chart"></i>MashSearch</h1>
        </header>
        <div id="container">
          <div className="descriptionBox">
            <h2>Visualizing Statistical Data About Events</h2>
          </div>
          <div className="formBox">
            <EventForm onEventSubmit={this.handleEventSubmit} />
            <EventResetForm onEventSubmit={this.handleEventSubmit} />
          </div>
          <div id="menuBox">
            <p>Events: 1000</p>
            <p>From: 2015-07-01 , To: 2015-09-01</p>
            <p>Keyword: rails</p>
          </div>
          <EventList data={this.state.data} />
        </div>
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
        <input type="text" placeholder="Keyword" className="form-control" ref="keyword" />
        <input type="submit" className="btn" value="Search" />
      </form>
    );
  }
});

var EventResetForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    this.props.onEventSubmit("");
    return;
  },
  render: function() {
    return(
      <form className="eventResetForm" onSubmit={this.handleSubmit}>
        <input type="submit" className="btn" value="Reset" />
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
