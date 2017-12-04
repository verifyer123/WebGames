import React from 'react';
import {epicModel} from "../models/epicModel";
import {startGame} from "../minigames/swampShape/main";

export class Map extends React.Component{

	config = {
		name: "Epic Map",
		language: "es",
		minigameUrl: "../epicMap/index.html?language=" + "en",
		desktopUrl: "./desktop.html",
	}

	componentDidMount () {
		var element = this.refs.gameContainer
		console.log(element)
		epicModel.loadPlayer(function(){startGame(element)})
		console.log(game)
		element.innerText = "Hola mundo";
		// console.log(this.refs, "refs")
	}

	render() {
		console.log(this.config, this.gameContainer)
		return(
			<section className="content-game middle-content">
				<div id="game-container" className="game-canvas" ref="gameContainer">
				</div>
			</section>
		);
	}
}