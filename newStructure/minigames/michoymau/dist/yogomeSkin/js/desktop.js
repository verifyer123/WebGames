var gameContainer = document.getElementById("game-container")
 var gameFrame = document.createElement("iframe")
      gameFrame.src= amazing.config.minigameUrl
     gameFrame.style.borderStyle = "none"
     gameFrame.scrolling = "no"
     gameFrame.width = "100%"
     gameFrame.height = "100%"  
     gameContainer.appendChild(gameFrame); 

 function loadGame(){
     gameContainer.removeChild(gameFrame); 
     gameFrame.src= amazing.config.minigameUrl
     gameFrame.style.borderStyle = "none" 
     gameFrame.scrolling = "no"
     gameFrame.width = "100%"
     gameFrame.height = "100%"  
     gameContainer.appendChild(gameFrame); 
}



window.addEventListener("resize", loadGame);

    var link = document.createElement('link');
    link.id = 'id2';
    link.rel = 'stylesheet';
    link.href = 'css/main.css';
    document.head.appendChild(link);