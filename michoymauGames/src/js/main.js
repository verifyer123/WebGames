$(document).on('ready', function() {

    var minigame = gameList.minigames;
    
    
    for(var i = 0; i<= minigame.length-1;i++){
        $("#Games").append(
    `<div id="btnOptimized`+i+`">
      <img src="images/`+ minigame[i].sceneName +`.png">
    </div>
    `);
        $("#btnOptimized" + i).attr("number",i);
        $("#btnOptimized" + i).css("opacity",0.5);
        $("#btnOptimized" + i).mouseover(function(){
            $(this).css("opacity",1);
        });   
        $("#btnOptimized" + i).mouseout(function(){
            $(this).css("opacity",0.5);
        });   
        
        $("#btnOptimized" + i).click(function(){
            var place = $(this).attr("number")
            var texto = minigame[place].url//minigame[place].name.replace(/\s/g, "")
           window.location = "../../newStructure/minigames/michoymau/dist/" + texto //"https://yogome.github.io/WebGames/newStructure/gamesite/#/minigames/" + texto
        });   
    }
    
    $("#Games").slick({
        dots: false,
        infinite: false,
        slidesToShow: 2,
        slidesToScroll: 1
      }); 
    
  
    /*$("#onGoingGames").slick({
        dots: false,
        infinite: false,
        slidesToShow: 3,
        slidesToScroll: 1,
        vertical:true
      });    */
    
});