var ruta = "minigames/openEnglish/index.html";
var inicio = false;


    
            $("body").append("<div id='iconMovil'><img src='images/rotatemobile_480.jpg'/></div>");
            $("body").css("background-color","#424242");

    if(window.orientation == 90 || window.orientation == -90){
    $(".main-content").hide();     
        $("body").css("background-color","#424242");    
    }else{
        
        if(!inicio){
        inicio=true;
        $("#myCanvas").append('<iframe id="game-frame" src='+ruta+' scrolling="no" width="100%" height="100%" style="border-style: none; width: 100%; height: 100%"></iframe>')    
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
        $("#myCanvas").append('<iframe id="game-frame" src='+ruta+' scrolling="no" width="100%" height="100%" style="border-style: none; width: 100%; height: 100%"></iframe>')    
            
        }
        $(".main-content").show();  
        $("#iconMovil").hide();
        $("body").css("background-color","#FFFF");
    }
   
    
  });  
    