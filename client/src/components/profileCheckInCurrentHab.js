var ProfileCheckInCurrentHab = React.createClass({

    incrementCount: function(){
      this.setState({
        count: this.state.count + 1
      })
    },

    render: function() {
      return (
        <div className="counter">
          <h1>{this.state.count}</h1>
          <button type="button" onClick={this.incrementCount}>Increment</button>
          <table><tbody>
            <thead><h3>Check in For Today</h3></thead>
            <form action="" method="get">
              {this.props.currentHabits.map(function(cell) {
                return <tr><td><input type="checkbox" name="" value="" onChange={function(){console.log('function called')} }/>{cell}</td></tr>
              })}
            </form>
          </tbody></table>
        </div>
      )
    }
});




