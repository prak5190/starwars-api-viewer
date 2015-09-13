import React from 'react'


function get(url) {
    return $.ajax({url,type: 'json',method:'get'})
}


var URL = {
    "starships" : "http://swapi.co/api/starships/",
    "pilot": (id) => `http://swapi.co/api/people/${id}/`,    
}


const Ship = React.createClass({
    render() {
        var x = this.props.ship ;
        return (
            <tr>
            <td onClick={this.props.onClick}>{x.name}</td><td>{x.model}</td><td>{x.cost_in_credits}</td>
            </tr>)
    }
});

const StarWarsShips = React.createClass({
    getInitialState() {        
        return { priceSort : 0, ships : []};
    },
    componentDidMount() {
        var self = this ;
        this.state.ships
        // Get all data in one go - Need it for sorting and filtering
        var update = function(url) {            
            get(url).then(function(x) {                
                var arr = self.state.ships ;
                arr.push.apply(arr,x.results);
                self.setState({ships : arr});
                if (x.next)
                    update(x.next);
            });
        };
        update(URL.starships);
    },
    render() {
        var arr = this.state.ships;        
        var rows = arr.map((x)=> <Ship key={x.name} ship={x} />);
        return (            
            <div>
            <table>
            <thead>
            <td>Name</td><td>Model</td><td>Price</td>  
            </thead>
            <tbody>
            {rows}
            </tbody>
            </table>            
            </div>
        )            
    }
});

const StartWars = React.createClass({
  render() {
      return (
          <div>
          <h1>Make me do Star Wars stuff!</h1>
          <StarWarsShips />
          </div>
    )
  }
})

React.render(<StartWars />, document.querySelector('.app'))
