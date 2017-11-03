window.mobilecheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};



	var Yogotars = {
		"eagle":"img/yogotars/yogotar1.png",
		"luna":"img/yogotars/yogotar2.png"
	}

    function showYogotar(event){
    	console.log(event)
    	var numPlayer = event.numPlayer, player = event.player
    	var img = Yogotars[player.avatar];
    	if(numPlayer === 1){
			$("#selectP1").find("img").attr("src", img);
			$("#nickNameP1").text(player.nickname)
        }else{
            $("#selectP2").find("img").attr("src", img);
//            $("#selectP2").find("img").css("width", "-100%");
            $("#nickNameP2").text(player.nickname)

        }
    }

    $("#selectLevel").hide();
    $("#waitingPlayers").hide();
    var blurElement = {a:0};
    var gameReady = false;
//TweenMax.to(blurElement, 1, {a:10, onUpdate:applyBlur});

    function onPlayersReady(){
        gameReady = true;
		$("#beginGame").css("opacity", 1);
        
    }

    function applyBlur(){
    TweenMax.set(['#backgroundBody'], {webkitFilter:"blur(" + blurElement.a + "px)",filter:"blur(" + blurElement.a + "px)"});  };

	$("#beginGame").mousedown(function(){
		//lanzar el juego
        if(gameReady) {
			server.removeEventListener('onPlayersReady', onPlayersReady);
			server.removeEventListener('onInitPlayer', showYogotar);
        	window.open("battle.html", "_self")
		}

	});

    $("#startGameButton").mousedown(function(){
        $("#startGameButton").toggleClass("onBgButton");
        $("#startGameButton").prop( "disabled", false );
        createGame();
    });

    function createGame(){
        TweenMax.fromTo($("#startGameButton"),0.5,{scale:1},{scale:0,ease:Back.easeIn});
        TweenMax.fromTo($(".left-monster"),0.5,{x:0},{x:"50%",ease:Back.easeIn});
        TweenMax.fromTo($(".right-monster"),0.5,{x:0},{x:"-50%",ease:Back.easeIn});
        TweenMax.fromTo($("#cortainBlack"),0.5,{alpha:0},{alpha:1,delay:0.5,onComplete:NextScene1});
    }
    
    
function NextScene1(){
        $(".left-monster").hide();
        $(".right-monster").hide(); 
        $("#cortainBlack").css("background-color","rgba(0,0,0,1)");
        $("#cortainBlack").css("z-index",0);
        TweenMax.fromTo($("#cortainBlack"),0.5,{alpha:0},{alpha:0.5});
        TweenMax.fromTo($("#logoMath"),0.5,{scale:1,y:0},{scale:0.6,y:-20});
    TweenMax.to(blurElement, 1, {a:5, onUpdate:applyBlur});
        SelectLevel();
}
    
function SelectLevel(){
    $("#selectLevel").show();
    $("#levelBasicButton,#levelMediumButton,#leveladvanceButton").show();
    $("#levelBasicButton").attr("level",1);
    $("#levelMediumButton").attr("level",2);
    $("#leveladvanceButton").attr("level",3);    
    $("#levelBasicButton,#levelMediumButton,#leveladvanceButton").css("position","relative");
    $("#levelBasicButton,#levelMediumButton,#leveladvanceButton").css("opacity",1);
    TweenMax.to($("#levelBasicButton,#levelMediumButton,#leveladvanceButton"),0.2,{css:{transform:"matrix(1, 0, 0, 1, 0, 0)"}});
    TweenMax.to($("#levelBasicButton,#levelMediumButton,#leveladvanceButton"),0.2,{left:'0%'}); 
    TweenMax.fromTo($("#levelBasicButton"),0.5,{scale:0,alpha:0},{scale:1,alpha:1,ease:Back.easeOut});
    TweenMax.fromTo($("#levelMediumButton"),0.5,{scale:0,alpha:0},{scale:1,alpha:1,ease:Back.easeOut,delay:0.2});
    TweenMax.fromTo($("#leveladvanceButton"),0.5,{scale:0,alpha:0},{scale:1,alpha:1,ease:Back.easeOut,delay:0.4});
    $("#levelBasicButton,#levelMediumButton,#leveladvanceButton").mouseover(function(){TweenMax.to($(this),0.5,{scale:1.1});});
    $("#levelBasicButton,#levelMediumButton,#leveladvanceButton").mouseout(function(){TweenMax.to($(this),0.5,{scale:1});});
        $("#levelBasicButton,#levelMediumButton,#leveladvanceButton").click(function(){
			var level = parseInt($(this).attr("level"));
			server.start(level);
			server.addEventListener("onInitPlayer", showYogotar);
			server.addEventListener('onPlayersReady', onPlayersReady);
        	$("#levelBasicButton,#levelMediumButton,#leveladvanceButton").unbind("mouseover");
            $("#levelBasicButton,#levelMediumButton,#leveladvanceButton").unbind("mouseout");
            TweenMax.to($("#levelBasicButton,#levelMediumButton,#leveladvanceButton"),0.5,{scale:0,onComplete:hideLevels});
            //$(this).css("position","absolute");
            TweenMax.to($(this),0.2,{scale:1}); 
            //TweenMax.to($(this),0.2,{css:{transform:"matrix(1, 0, 0, 1, -300, 0)"}}); 
            var object = this;
            function hideLevels(){
                //$("#levelBasicButton,#levelMediumButton,#leveladvanceButton").hide();
                //$(object).show();
                TweenMax.to(object,0.5,{scale:3,alpha:0,delay:1,onComplete:NextScene2});
            }
        });   
    }
    
function NextScene2(){
    $("#selectLevel").hide();
    $("#waitingPlayers").show();
    $("#pinNumber").text(server.getIdGame())
}

function checkOrientation(){
        if (window.matchMedia("(orientation: portrait)").matches) {
            $("#selectLevel").addClass("selectLevel-portrait"); 
            $(".optionLevel").addClass("optionLevel-portrait"); 
            $(".imageLevel").addClass("imageLevel-portrait"); 
            $("#basicLevel").addClass("basicLevel-portrait"); 
            $("#mediumLevel").addClass("basicLevel-portrait"); 
            $("#avanceLevel").addClass("basicLevel-portrait"); 
            $("#selectLevel").find("p").addClass("parrafo-portrait");
            console.log("es portrait");
            
    }

    if (window.matchMedia("(orientation: landscape)").matches) {
            $("#selectLevel").removeClass("selectLevel-portrait"); 
            $(".optionLevel").removeClass("optionLevel-portrait"); 
            $(".imageLevel").removeClass("imageLevel-portrait"); 
            $("#basicLevel").removeClass("basicLevel-portrait"); 
            $("#mediumLevel").removeClass("basicLevel-portrait"); 
            $("#avanceLevel").removeClass("basicLevel-portrait"); 
            $("#selectLevel").find("p").removeClass("parrafo-portrait");
            console.log("es landscape");
    }
}

checkOrientation();

$( window ).on( "orientationchange", function( event ) {
    checkOrientation();
});   