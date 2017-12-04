import React from 'react';

export class Login extends React.Component{

	onNavigateHome(){
		this.props.history.push("/home")
	}

	render() {
		return(
				<div>
					Welcome to login
					<button onClick={this.onNavigateHome.bind(this)}>Go Home</button>
				</div>
		);
	}
}