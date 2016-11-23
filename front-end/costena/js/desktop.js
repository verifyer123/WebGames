 var gameContainer = document.getElementById("game-container")
 var gameFrame = document.createElement("iframe")
 gameFrame.src= amazing.config.minigameUrl
 gameFrame.style.borderStyle = "none"
 gameFrame.scrolling = "no"
 gameFrame.width = "100%"
 gameFrame.height = "100%"
 gameContainer.appendChild(gameFrame)