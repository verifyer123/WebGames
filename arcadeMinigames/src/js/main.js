$(document).on('ready', function() {
    var optimized = optimizedGames.minigames;
    var countOptimizedGames = 1;
    var totalOptimizedLess = 1;
    var pop = document.getElementById("pop"); 
    var gameList = new Array;
    var urlGame;
    var songs = 
        [
            "chemical_electro",
            "8-bit-Video-Game",
            "wormwood",
            "jungle_fun",
            "running_game",
            "marioSong"
        ]
   
for(var i = 0; i<= optimized.length-1;i++){
  $("#carrousel").append(
    `<div class="btnOptimized`+i+` container-gameSelect" data-order="`+optimized[i].mapUrl+`"><div  class="bgGame`+i+` bg-selectgGame"></div><div class="name-select">`+optimized[i].mapUrl+`<p>`+optimized[i].subject+`</p></div></div>`);
        $(".btnOptimized" + i).attr("number",i);
        $(".bgGame" + i).css( "background-image","url(https://yogome.github.io/WebGames/newStructure/minigames/"+optimized[i].mapUrl+"/images/fbpost.png)");

        $(".btnOptimized" + i).mouseover(function(){
            $(this).css("opacity",1);
        });   
        $("#btnOptimized" + i).mouseout(function(){
            $(this).css("opacity",0.5);
        });   
        
        
    
        $(".btnOptimized" + i).click(function(){
            var place = $(this).attr("number")
            var texto = optimized[place].name.replace(/\s/g, "")
           $("#bannerGame").html("<img src='https://yogome.github.io/WebGames/newStructure/minigames/" +optimized[place].mapUrl+ "/images/fbpost.png' />");
            urlGame = "https://play.yogome.com/playweb/gamesite/#/minigames/" + texto;
            $("#StartGame").show();
            pop.play();
        });   
    }   
   
    $("#bannerGame").append("<img src='https://yogome.github.io/WebGames/newStructure/minigames/" +optimized[0].mapUrl+ "/images/fbpost.png' />")
    $("#StartGame").hide();
    $("#StartGame").click(function(){
        window.open(urlGame,"_blank");
    });
 
    
});
