// console.log("test")

import React from 'react';
import { render } from 'react-dom'
import _ from 'lodash'
// import Router from 'react-router';
//
// import {Minigames} from "./components/Minigames";
// import {Map} from "./components/Map";
import {Continue} from "./components/continue";
import {Login} from "./components/Login";
import {Pin} from "./components/Pin";

export let showContinue

class App extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			showModal: false  // set a value in state to store whether or
							  // not to show the Modal
		};

		this.handleClick = this.handleClick.bind(this)

	}

	handleClick() {  // switch the value of the showModal state
		this.setState({
			showModal: !this.state.showModal
		});
	}

	getComponent() {
		return this.state.showModal ? <Login closeModal={this.handleClick}/> : null
	}

	render() {
		showContinue = this.handleClick
		return(
			<div>
				<button onClick={this.handleClick}>Continue</button>
				{this.getComponent()}
			</div>
		)
	}
};

// export function showContinue() {
// 	console.log(App)
// 	// App.state.showModal = !App.state.showModal
// }

// var routes = (
// 	<Route name="app" path="/" handler={App}>
// 	<Route name="login" path="/login" handler={LoginHandler}/>
// </Route>
// );

render(<App/>, window.document.getElementById("app"))
// Router.run(routes, function (Handler) {
// 	React.render(<Handler/>, document.body);
// });