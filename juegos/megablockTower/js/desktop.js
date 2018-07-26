 var gameContainer = document.getElementById("game-container")
 var gameFrame = document.createElement("iframe")
     var search = ""
     if(window.location.search!=""){
          search = window.location.search
     }
     gameFrame.src= amazing.config.minigameUrl+search
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

