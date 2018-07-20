$(document).on('ready', function() {

    var optimized = optimizedGames.minigames;
    var onGoing = onGoingGames.minigames;
    var countOptimizedGames = 1;
    var totalOptimizedLess = 1;

    
    for(var i = 0; i<= optimized.length-1;i++){
        $("#optimizedGames").append(
    `<div id="btn`+i+`">
      <img src="../../newStructure/minigames/`+ optimized[i].mapUrl +`/images/fbpost.png">
    </div>
    `);
    }   
    
    for(var i = 0; i<= onGoing.length-1;i++){
        $("#onGoingGames").append(
    `<div id="btn`+i+`">
      <img src="../../newStructure/minigames/`+ onGoing[i].url +`images/fbpost.png">
    </div>
    `);
    }    
    
    $("#totalOptimized").text(" (" + optimized.length +")")
    $("#totalOptimizedLess").text(" (" +  onGoing.length +")")
    
    $("#optimizedGames").find(".slick-next").click(function(){
    });


    $("#optimizedGames").slick({
        dots: false,
        infinite: false,
        slidesToShow: 2,
        slidesToScroll: 1
      }); 
    
  
    $("#onGoingGames").slick({
        dots: false,
        infinite: false,
        slidesToShow: 3,
        slidesToScroll: 1
      });    
    
   
    
});