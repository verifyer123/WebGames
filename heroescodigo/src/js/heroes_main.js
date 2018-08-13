$(document).on('ready', function() {
var choiceGames = [
100,25,98,13,15,76,7,26,38,40,60,62,81,83,95,53,102,57,77,29,5,11,51,105,111,113,144,148,158,138];
    var optimized = optimizedGames.minigames;
    var countOptimizedGames = 1;
    var totalOptimizedLess = 1;
    var minigameHref;
    var previewSong = document.getElementById("previewSong"); 
    var gameList = new Array;
    var songs = 
        [
            "chemical_electro",
            "8-bit-Video-Game",
            "wormwood",
            "jungle_fun",
            "running_game",
            "marioSong",
            "upbeat_casual",
            "melodic_basss"
        ]
    
    function getSorted(selector, attrName) {
        return $($(selector).toArray().sort(function(a, b){
        var aVal = parseInt(a.getAttribute(attrName)),
            bVal = parseInt(b.getAttribute(attrName));
        return aVal - bVal;
        console.log($(selector).attr(attrName));
        
    }));
}
    function levelDifficulty(dificulty){
        var textW = parseInt(dificulty - 4) * 10 + "%";
        $("#gradientDifficulty").width(textW);
    }
    
    function _updateBanner(num){
        var banner = $("#bannerGame");
            TweenMax.fromTo(banner,0.2,{rotationX:0},{rotationX:90,onComplete:changeImage});
            TweenMax.fromTo(banner,0.2,{rotationX:90},{rotationX:0,delay:0.2});
            function changeImage(){
              banner.find("img").attr("src","https://yogome.github.io/WebGames/newStructure/minigames/" +optimized[num].mapUrl+ "/images/fbpost.png");
                banner.css("background-image","url(images/bgbanner"+optimized[num].subject+".png)");  
            }   
    }
    
for(var i = 0; i<= choiceGames.length-1;i++){
  $("#carrousel").append(
    `<div class="btnOptimized`+i+` orderSelect`+i+` container-gameSelect" data-order="`+optimized[choiceGames[i]].mapUrl+`">
    
    <div id="name-select`+ i +`" class="name-select">`+optimized[choiceGames[i]].name+`<p>`+optimized[[choiceGames[i]]].subject+`</p></div>
<div  class="bgGame`+i+` bg-selectgGame"></div>
    </div>`);
        $(".btnOptimized" + i).attr("number",choiceGames[i]);
        $(".bgGame" + i).css( "background-image","url(https://yogome.github.io/WebGames/newStructure/minigames/"+optimized[[choiceGames[i]]].mapUrl+"/images/fbpost.png)");

        $("#name-select" + i).css("background-image","url(images/selectgame"+optimized[[choiceGames[i]]].subject+".png)");

        $(".btnOptimized" + i).click(function(){
            var place = $(this).attr("number");
            var texto = optimized[place].name.replace(/\s/g, "")
           _updateBanner(place);
            //previewSong.src ="../songs/" + songs[optimized[place].song] + ".mp3";
            levelDifficulty(optimized[place].age);
            updateRadar(optimized[place].type, optimized[place].age);
            window.myRadar.update();
            for(var i = 0; i<= choiceGames.length-1;i++){
                $(".container-gameSelect").removeClass("game-active"); 
            }
            $(this).addClass("game-active");    
            minigameHref ="https://play.yogome.com/playweb/gamesite/#/minigames/" + texto + "?language=EN";    
            
            
        });   
    }   
    

        var ctx = document.getElementById('canvas').getContext("2d");
        var gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
        gradientStroke.addColorStop(0, "rgba(128, 182, 244, 0.6)");
        gradientStroke.addColorStop(1, "rgba(244, 144, 128, 0.6)");
    
        var gradientFill = ctx.createLinearGradient(500, 0, 100, 0);
        gradientFill.addColorStop(0, "rgba(252, 238, 0, 0.6)");
        gradientFill.addColorStop(1, "rgba(102, 198, 63,0.3)");

		var color = Chart.helpers.color;
		var config = {
			type: 'radar',
			data: {
				labels: [
                    'TARGET',
		'COUNT',
		'CHOOSE',
		'MATCH',
        'GRAB',
        'SEQUENCE',
        'TRACE']
                
                     
                
                ,
				datasets: [{
                    
					label: 'Subject difficulty',
					backgroundColor: gradientFill,
					borderColor: false,
                    pointBackgroundColor:"rgba(0,0,0,0)",
					data: [
						0.1,
                        1,
                        1,
                        1,
                        1,
                        0.1,
                        0.1
                        
					]
				}]
			},
			options: {
				legend: {
					position: 'bottom',
                    display:false
				},
				title: {
					display: false,
					text: 'Subject'
				},
				scale: {
                    angleLines: { 
                        color: 'white', 
                        display:false
                    },
                    gridLines: { 
                        color: "white", 
                        display:false 
                    }, 
					ticks: {
						beginAtZero: true,
                        min: 0,
                        max: 1.3,
                        stepSize: 1,
                        display:false
                        
                        
					},
                    pointLabels: {
                        fontSize: 15,
                        fontColor:"#FFF",
                    }
				}
			}
		};


        function updateRadar(typeRadar,age){
            console.log("type: " + typeRadar)
            config.data.datasets.forEach(function(dataset) {
                
                dataset.data[0] = 0;
                dataset.data[1] = 0;
                dataset.data[2] = 0;
                dataset.data[3] = 0;
                dataset.data[4] = 0;
                dataset.data[5] = 0;
                dataset.data[6] = 0;
                switch(typeRadar){
                    case 5 :
                    dataset.data[0] = 1;
                    break;
                    case 1 :
                    dataset.data[1] = 1;
                    break;
                    case 0 :
                    dataset.data[2] = 1;
                    break;
                    case 3 :
                    dataset.data[3] = 1;
                    break;
                    case 2 :
                    dataset.data[4] = 1;
                    break;
                    case 4 :
                    dataset.data[5] = 1;
                    break;
                    case 6 :
                    dataset.data[6] = 1;
                    break;
                }
                
                        for(var i = 0; i<=6;i++){
                            if(dataset.data[i] == 1){
                                console.log(age)
                                if(age >= 10){
                                    
                               dataset.data[i] = 1.3;
                               }else if(age < 10 && age > 7){
                                   dataset.data[i] = 1;
                                }else{
                                    
                                  dataset.data[i] = 0.8;  
                                }
                            }
                            if(dataset.data[i] === 0){
                                dataset.data[i] = 0.3
                            }
                        }
            });
            
        }
       /*EASTER EGGS*/
    var codeCheats = 0;
    function startCheat(enterCodeCheat){
        switch(enterCodeCheat){
            case 32:
                console.log("cherryParrot!");
                //cherryParrot 
                //3 izq, 2 abajo, 1 derecha, 3 arriba, 1 abajo
                $("#container").append(`<img id="cherry" src="images/cherryparrot.gif">`);
                TweenMax.to($("#cherry"),2,{bottom:"0%",delay:2});
                TweenMax.to($("#cherry"),2,{bottom:"-40%",delay:8,onComplete:songStopCheat});
                function songStopCheat(){previewSong.pause();}
                previewSong.src ="songs/" + songs[7] + ".mp3";
                previewSong.play();
            break;
        }
    }

    
    $(document).keydown(function(e){
    if (e.keyCode == 13) { 
          if(codeCheats != 0){
              startCheat(codeCheats);
              codeCheats = 0;
          }
       return false;
    }
    if (e.keyCode == 37) { 
            //izq
          codeCheats = codeCheats  + 10;
          console.log(codeCheats);
       return false;
    }
    if (e.keyCode == 38) { 
        //arriba
          codeCheats = codeCheats  + 2;
          console.log(codeCheats);
       return false;
    }
    if (e.keyCode == 39) { 
        //der
          codeCheats = codeCheats  + 5;
          console.log(codeCheats);
       return false;
    }
    if (e.keyCode == 40) { 
        //abajo
          codeCheats = codeCheats  - 3;
          console.log(codeCheats);
       return false;
    }
    
    
    });

    //INIT
    window.onload = function() {
			window.myRadar = new Chart(document.getElementById('canvas'), config);
            window.myRadar.update();
    };
    $("#playGameButton").click(function(){
         window.open(minigameHref,"_blank");
    });
    $("#bannerGame").append("<img src='https://yogome.github.io/WebGames/newStructure/minigames/" +optimized[choiceGames[0]].mapUrl+ "/images/fbpost.png' />");
    $("#bannerGame").css("background-image","url(images/bgbanner"+optimized[choiceGames[0]].subject+".png)");
    minigameHref ="https://play.yogome.com/playweb/gamesite/#/minigames/" + optimized[choiceGames[0]].name.replace(/\s/g, "") + "?language=EN";
    levelDifficulty(optimized[choiceGames[0]].age);
    updateRadar(optimized[choiceGames[0]].type ,optimized[choiceGames[0]].age);
        
});
