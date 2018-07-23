$(document).on('ready', function() {

    var optimized = optimizedGames.minigames;
    var onGoing = onGoingGames.minigames;
    var countOptimizedGames = 1;
    var totalOptimizedLess = 1;

    
    for(var i = 0; i<= optimized.length-1;i++){
        $("#optimizedGames").append(
    `<div id="btnOptimized`+i+`">
      <img src="../../newStructure/minigames/`+ optimized[i].url +`/images/fbpost.png">
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
            var texto = optimized[place].name.replace(/\s/g, "")
           window.location = "../../newStructure/gamesite/#/minigames/" + texto
        });   
    }   
    
    
    for(var i = 0; i<= onGoing.length-1;i++){
        $("#onGoingGames").append(
    `<div id="btnGoing`+i+`">
      <img src="../../newStructure/minigames/`+ onGoing[i].url +`images/fbpost.png">
    </div>
    `);
        $("#btnGoing" + i).attr("number",i);
        $("#btnGoing" + i).css("opacity",0.5);
        $("#btnGoing" + i).mouseover(function(){
            $(this).css("opacity",1);
        });
        $("#btnGoing" + i).mouseout(function(){
            $(this).css("opacity",0.5);
        });
           
        $("#btnGoing" + i).click(function(){
            var place = $(this).attr("number")
            var texto = onGoing[place].name.replace(/\s/g, "")
           window.location = "../../newStructure/gamesite/#/minigames/" + texto
        });   
    }    
    
    $("#totalOptimized").text(" (" + optimized.length +")")
    $("#totalOptimizedLess").text(" (" +  onGoing.length +")")
    



    $("#optimizedGames").slick({
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