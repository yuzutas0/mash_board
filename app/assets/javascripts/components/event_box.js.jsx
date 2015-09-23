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
        if(this.state.data['days'][day][i] >= 95){
          color = "x-large-score";
        } else if (this.state.data['days'][day][i] >= 90) {
          color = "large-score";
        } else if (this.state.data['days'][day][i] >= 80) {
          color = "middle-score";
        } else if (this.state.data['days'][day][i] >= 65) {
          color = "small-score";
        } else if (this.state.data['days'][day][i] >= 50) {
          color = "x-small-score";
        } else {
          color = "none-score";
        }
        tableContent = tableContent + "<td class='clearText tableLine " + color + "'>.</td>";
      }
      tableContent = tableContent + "<td class='clearText'>.</td></tr>"
    }
    tableContent = tableContent + "<tr><td class='clearText'>.</td>"
    for (var day in this.state.data['days']) {
      tableContent = tableContent + "<td>" + day + "</td>"
    }
    tableContent = tableContent + "<td class='clearText'>.</td></tr>";
    return(
      <div id="wrap">
        <div className="eventBox">
          <header>
            <h1><i className="fa fa-bar-chart"></i>MashSearch</h1>
          </header>
          <div id="container">
            <div id="descriptionBox">
              <h2>Visualizing Statistical Data About Events</h2>
              <p>from ATND, Doorkeeper, Zusaar, Connpass</p>
            </div>
            <div className="formBox">
              <EventForm onEventSubmit={this.handleEventSubmit} />
              <EventResetForm onEventSubmit={this.handleEventSubmit} />
            </div>
            <div id="menuBox">
              <p>Events: {this.state.data['information']['length']}</p>
              <p>From: {this.state.data['information']['oldest']} , To: {this.state.data['information']['newest']}</p>
              <p>Keyword: {this.state.data['information']['keyword']}</p>
            </div>
            <div id="statisticBox">
              <table>
                <tbody dangerouslySetInnerHTML={{__html: tableContent}} />
              </table>
            </div>
          </div>
          <footer>
            <p>presented by <a href='http://twitter.com/yuzutas0'>@yuzutas0</a></p>
          </footer>
        </div>
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
