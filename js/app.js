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
            <tr style={{cursor:"pointer"}} onClick={this.props.onClick}>
            <td>{x.name}</td><td>{x.model}</td><td>{x.cost_in_credits}</td>
            </tr>)
    }
});

const Pilot = React.createClass({
    render() {
        var x = this.props.data ;
        return (            
            <tr>
            <td onClick={this.props.onClick}>{x.name}</td><td>{x.height}</td><td>{x.gender}</td>
            </tr>)
    }
});

const PilotLists = React.createClass({
    getInitialState() {        
        return { data : []};
    },
    setPilotData() {
        var pilots = this.props.data;
        var arr = pilots.map((x) => get(x));
        var data = [];
        var self = this;
        arr.forEach((x) => {
            x.then((y) => {
                data.push(y);
                self.setState({data : data});
            })
        });
    },
    componentDidMount() {
        this.setPilotData();
    },
    componentWillReceiveProps() {
        this.setPilotData();
    },
    render() {
        if (this.props.data.length == 0)
            return (<div> No Pilots present </div>)
        var rows = this.state.data.map((x) => <Pilot data={x} key={x.name}/>);
        return (
            <div>            
            <table className="table table-striped">
            <thead>
            <td>Name</td><td>Height</td><td>Gender</td>  
            </thead>
            <tbody>
            {rows}
            </tbody>
            </table>
            </div>
        )
    }
});

const ShipFullDetails = React.createClass({
    render() {
        var x = this.props.data;
        if (!x)
            return (<div>Nothing selected</div>)
        return (
            <div>
            <div> Name : {x.name}</div>
            <div> Model : {x.model}</div>
            <div> Max Atmosphere Speed : {x.max_atmosphering_speed}</div>
            <div> Passengers : {x.passengers}</div>
            <PilotLists data={x.pilots} />
            </div>)
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
    search(event) {
        var val = event.target.value;
        this.setState({search : val });
    },
    setMaxPrice(event) {
        var val = Number(event.target.value) || 99999999;  
        this.setState({maxPrice : val});
    },
    setMinPrice(event) {
        var val = Number(event.target.value) || 0;  
        this.setState({minPrice : val});
    },
    select(x) {
        this.setState({ selectedShip : x});
    },
    applySearchQuery(arr,val) {
        var reg = new RegExp(val.split("").join(".*"),"i");        
        return  arr.filter((x) => reg.test(x.name));
    },
    applyMaxPrice(arr,val) {
        return arr.filter((x) => Number(x.cost_in_credits) <= val);
    },
    applyMinPrice(arr,val) {
        return arr.filter((x) => Number(x.cost_in_credits) >= val);
    },
    render() {
        var arr = this.state.ships;
        // Applying search parameter
        if (this.state.search)
            arr = this.applySearchQuery(arr,this.state.search);

        // Applying price filters
        if (this.state.maxPrice)
            arr = this.applyMaxPrice(arr,this.state.maxPrice);
        if (this.state.minPrice)
            arr = this.applyMinPrice(arr,this.state.minPrice);
        
        var rows = arr.map((x)=> <Ship onClick={this.select.bind(this,x)} key={x.name} ship={x} />);
        
        var selectedShip;
        if(this.state.selectedShip)
            selectedShip =(<ShipFullDetails data={this.state.selectedShip} />);
        
        return (            
            <div>
            <div className="col-md-6">
            <form className="form-inline">
            <div className="form-group">
            <label>Search <input type='text' placeholder="Search By name" className="form-control" onChange={this.search} /></label>
            </div>
            <div className="form-group">
            <label>Enter Max Price <input type='text' placeholder="Enter Max Price" className="form-control" onChange={this.setMaxPrice} /></label>
            </div>
            <div className="form-group">
            <label>Enter Min Price <input type='text' placeholder="Enter Min Price" className="form-control" onChange={this.setMinPrice} /></label>
            </div>
            </form>
            <table className="pull-left table table-striped">
            <thead>
            <td>Name</td><td>Model</td><td onClick={this.sortByPrice}>Price</td>  
            </thead>
            <tbody>
            {rows}
            </tbody>
            </table>            
            </div>
            <div className="col-md-6" style={{position:"fixed",right : 0}}>
            {selectedShip}
            </div>
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
