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
    sortByPrice() {
        var arr = this.state.ships;
        if (this.state.priceSort > 0) {
            arr.sort((x,y) => {
                if (Number.isNaN(Number(x.cost_in_credits))) 
                    return 1;
                return Number(x.cost_in_credits) - Number(y.cost_in_credits);
            });
            this.state.priceSort = -1;
        } else {
            arr.sort((x,y) => {
                if (Number.isNaN(Number(x.cost_in_credits)))
                    return 1;
                return Number(y.cost_in_credits) - Number(x.cost_in_credits);
            })
            this.state.priceSort = 1;
        }
        this.setState({ships : arr});
    },
    render() {
        var arr = this.state.ships;        
        var rows = arr.map((x)=> <Ship key={x.name} ship={x} />);
        return (            
            <div>
            <table>
            <thead>
            <td>Name</td><td>Model</td><td onClick={this.sortByPrice}>Price</td>  
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
