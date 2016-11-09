    var inicio = false;
    var ancho = $("body").css("width");
    var ruta = "zombieCrush"

    $(".game-canvas").attr('id', 'myCanvas');   
    $( "iframe" ).remove();    

          $("body").append("<div id='iconMovil' style='position: absolute;top: 0;bottom: 0;left: 0;width: 50%;right: 0;margin: auto;'><img src='images/rotatemobile_480.jpg'/></div>");

    if(window.orientation == 90 || window.orientation == -90){
    $(".main-content").hide();     
        $("body").css("background-color","#424242");    
    }else{
        
        if(!inicio){
        inicio=true;
        $("#myCanvas").append('<iframe id="game-frame" src="minigames/' + ruta + '/index.html" scrolling="no" width="100%" height="100%" style="border-style: none; width: 100%; height: 100%"></iframe>')    
          $("body").css("background-color","#FFF");  
        }
        

        $(".main-content").show();  
        $("#iconMovil").hide();
        $("body").css("background-color","#FFFF");   
    }
    
$(window).on("orientationchange",function(){
    
    if(window.orientation == 90 || window.orientation == -90){
    
        $(".main-content").hide();  
        $("#iconMovil").show();
        $("body").css("background-color","#424242"); 

    }else{
    if(!inicio){
        inicio=true;
        $("#myCanvas").append('<iframe id="game-frame" src="minigames/' + ruta + '/index.html" scrolling="no" width="100%" height="100%" style="border-style: none; width: 100%; height: 100%"></iframe>')    
            
        }
        $("#game-frame").css("width",ancho);
        
        $(".main-content").show();  
        $("#iconMovil").hide();
        $("body").css("background-color","#FFFF");
    }
   
    
  });  

