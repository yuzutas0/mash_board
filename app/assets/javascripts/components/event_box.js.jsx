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
    return {
      data: {
        information: [],
        days: {
          Sun: [],
          Mon: [],
          Tue: [],
          Wed: [],
          Thu: [],
          Fri: [],
          Sat: []
        }
      }
    };
  },
  componentDidMount: function() {
    this.loadEventsFromServer(this.props.url);
  },
  handleEventSubmit: function(keyword) {
    var url = this.props.url + '/' + keyword;
    this.loadEventsFromServer(url);
  },
  render: function() {
    var tableContent = ""
    for (var i = 0; i < 24; i++) {
      tableContent = tableContent + "<tr><td>" + i.toString() + "</td>"
      for (var day in this.state.data['days']) {
        var color = "";
        if(this.state.data['days'][day][i] >= 90){
          color = "red";
        } else if (this.state.data['days'][day][i] >= 80) {
          color = "red-orange";
        } else if (this.state.data['days'][day][i] >= 70) {
          color = "orange";
        } else if (this.state.data['days'][day][i] >= 60) {
          color = "orange-yellow";
        } else if (this.state.data['days'][day][i] >= 50) {
          color = "yellow";
        } else {
          color = "white";
        }
        tableContent = tableContent + "<td class='" + color + "'>.</td>";
      }
      tableContent = tableContent + "</tr>"
    }
    tableContent = tableContent + "<tr><td>.</td>"
    for (var day in this.state.data['days']) {
      tableContent = tableContent + "<td>" + day + "</td>"
    }
    tableContent = tableContent + "</tr>";
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
            <p>Events: {this.state.data['information']['length']}</p>
            <p>From: {this.state.data['information']['oldest']} , To: {this.state.data['information']['newest']}</p>
            <p>Keyword: {this.state.data['information']['keyword']}</p>
            <p>{this.state.data['days']['Sun']['1']}</p>
          </div>
          <div id="statisticBox">
            <table>
              <tbody dangerouslySetInnerHTML={{__html: tableContent}} />
            </table>
          </div>
          <EventList data={this.state.data} />
        </div>
      </div>
    );
  }
});

var EventList = React.createClass({
  render: function() {
    var eventNodes = null;
    /**var eventNodes = this.props.data.map(function (event) {
      return (
        <Event author={event.author}>
          {event.text}
        </Event>
      );
    });*/
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
