var Habit = React.createClass({
  render: function() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return (
      <div className="habit">
      <h2 className="user_id">{this.props.user_id}</h2>
      <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
      </div>
      );
  }
});

//parent component
  //url references url declared in React.render ('/api/updateHabit')
  //on success, the state will be reset with new data from the db

var ProfileAddDisplayHab = React.createClass({ 
  loadHabitsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url);
        console.error(status);
        console.log(err.toString());
      }.bind(this)
    });
  },

  handleHabitSubmit: function(habitCategory) { // this is fired from the render function of this component
  // the argument, "habitCategory ", is the data submitted (value of the text-field AND the dropdown menu) by user that will be sent to the server via POST request
    var habits = this.state.data; // state of the data before the new habit is added
    var newHabits = habits.concat([habitCategory]); // add the new data to the data object
    this.setState({data: newHabits}); // re-set the state to include both the old and new data
    $.ajax({
      url: '/api/habits',
      dataType: 'json',
      type: 'POST',
      data: habitCategory,
      success: function(data) {
        this.setState({data: data}); 
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
    this.loadHabitsFromServer();
    setInterval(this.loadHabitsFromServer, this.props.pollInterval); // retrieves habits from db on interval
  },
  render: function() {
    return (
      <div className="habitBox">
      <h1>Habit Tracker</h1>
      <HabitList data={this.state.data} />
      <HabitForm onHabitSubmit={this.handleHabitSubmit} />
      </div>
      );
  }
});

var HabitList = React.createClass({ // updates the habits db with new entry and maps over the entire list of habits and displays to page

  updateHabit: function(habit, update){
    $.ajax({
      url: '/api/updateHabit',
      type: 'POST',
      data: habit,
      dataType: 'json',
      success: function(data) {
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });

  },

  deleteHabit: function(habit) {
    $.ajax({
      url: '/api/deleteHabit',
      type: 'DELETE',
      data: habit,
      dataType: 'json',
      success: function(data) {
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  // progressNumber: function(habitCount) {
  //   return Math.round(habitCount / 100) * 100;
  // },

  render: function() {

    var habitNodes = this.props.data.map(function(habit, index) {
      if (habit.count === undefined) {
        habit.count = 0;
      }
      return (
        <div className="row">
             <div className="page-section-heading"></div>
                <div className="panel panel-default">
                  <div className="table-responsive">

                    <table className="table v-middle">

                        <thead>

                          <tr>
                            <th width="20">
                            </th>
                            <th>Check in</th>
                            <th>Habit</th>
                            <th>Progress</th>
                            <th className="text-right">Delete</th>
                          </tr>

                        </thead>

                        <tbody id="responsive-table-body">
                          <tr>

                           <td></td>

                          <td><button className="btn btn-success" type="submit" formMethod="post" onClick={this.updateHabit.bind(this, habit)}>Check-in</button></td>

                          <td><Habit user_id={habit.user_id} key={index}>
                            {habit.habit} 
                            </Habit>
                          </td>

                          <td>
                            <center><div className="progress">{Math.round((habit.count-1) * 100/ 30, -2) +'%'}</div></center>
                          </td>

                          <td className="text-right">
                            <button type="button" className="btn btn-xs btn-danger" formmethod="post" onClick={this.deleteHabit.bind(this, habit)}>x</button> 
                          </td>

                          </tr>
                      </tbody>
                      </table>
                    </div>
                  </div>
              </div>

        );
    }.bind(this));
    return (
      <div className="HabitList">{habitNodes}</div>
      );
  }
});

var HabitForm = React.createClass({ // form to enter new habits
  handleSubmit: function(e) {
    e.preventDefault();
    // Both habit and category are the 2 pieces of info being sent in the handleSubmit function, they are referenced here with this.refs, which refer to the values of the DOM element that have a ref-attribute of "habit" and "category"
    var habit = React.findDOMNode(this.refs.habit).value.trim();
    var category = React.findDOMNode(this.refs.category).value.trim();
    if (!habit) {
      return;
    }
    this.props.onHabitSubmit({habit: habit, category: category}); // with every new habit object, it will have 2 key-val pairs; one for the habit-string and one string from the category dropdown menu
    React.findDOMNode(this.refs.habit).value = '';
  },

  render: function() {
    return (
      <form className="habitForm" onSubmit={this.handleSubmit}>
      <input type="text" placeholder="Enter a new habit" ref="habit" />
      <div class="dropdown">
        <select name="Categories" id='something' ref="category">
        <option value="null">Please select a category</option>
          <option value="Exercise">Exercise</option>
          <option value="Nutrition">Nutrition</option>
          <option value="Relationship">Relationship</option>
          <option value="Finance">Finance</option>
          <option value="Professional">Professional</option>
          <option value="Learning">Learning</option>
          <option value="Relaxation">Relaxation</option>
          <option value="Kick a Habit">Kick a Habit</option>
        </select>
      </div>
      <input type="submit" value="Post" />
      </form>
      );
  }
});

React.render(<ProfileAddDisplayHab url={'/api/updateHabit'} pollInterval={500} categories={['Fitness', 'Education', 'Addiction', 'Overall Cool Catness']} habitsObj={{}}/>, document.getElementById("adddisplayhab"));

