// console.log("test")

import React from 'react';
import { render } from 'react-dom'
// import Router from 'react-router';
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom'
//
import {Minigames} from "./components/Minigames";
import {Map} from "./components/Map";
import {Root} from "./components/Root";

class App extends React.Component{
	render() {
		return(
			<BrowserRouter>
				<Switch>
					<Root>
						<Route path="/minigames/:id" component={Minigames}/>
						<Route path="/map" component={Map}/>
					</Root>
				</Switch>
			</BrowserRouter>

		)
	}
	// 	return (
	// 		<div className="nav">
	// 		<Link to="app">Home</Link>
	// 		<Link to="login">Login</Link>
	//
	// 	{/* this is the importTant part */}
	// <RouteHandler/>
	// 	</div>
	// );
	// }
};

// var routes = (
// 	<Route name="app" path="/" handler={App}>
// 	<Route name="login" path="/login" handler={LoginHandler}/>
// </Route>
// );

render(<App/>, window.document.getElementById("app"))
// Router.run(routes, function (Handler) {
// 	React.render(<Handler/>, document.body);
// });