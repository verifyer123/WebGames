$(document).on('ready', function() {

    var optimized = optimizedGames.minigames;
    
    console.log(optimized);
    
    for(var i = 0; i<= optimized.length-1;i++){
        console.log(optimized.mapUrl);
        $("#optimizedGames").append(
    `<div id="btn`+i+`">
      <img src="../../newStructure/minigames/`+ optimized[i].mapUrl +`/images/fbpost.png">
    </div>
    `
    );
    }
    
    
  
    $(".regular").slick({
        dots: true,
        infinite: false,
        slidesToShow: 3,
        slidesToScroll: 1
      });    
    
   
    
});