$(document).on('ready', function() {

    var optimized = optimizedGames.minigames;

    //var optimized = onGoingGames.minigames;
    var countOptimizedGames = 1;
    var totalOptimizedLess = 1;
    var previewSong = document.getElementById("previewSong"); 
    var gameList = new Array;
    var songs = 
        [
            "chemical_electro",
            "8-bit-Video-Game",
            "wormwood",
            "jungle_fun",
            "running_game",
            "marioSong"
        ]
    
    function getSorted(selector, attrName) {
         console.log(selector.attrName);
        return $($(selector).toArray().sort(function(a, b){
        var aVal = parseInt(a.getAttribute(attrName)),
            bVal = parseInt(b.getAttribute(attrName));
        return aVal - bVal;
        console.log($(selector).attr(attrName));
        
    }));
}
    function levelDifficulty(dificulty){
        var textW = parseInt(optimized[dificulty].age - 4) * 10 + "%"
        $("#gradientDifficulty").width(textW);
    }
    
    function _updateBanner(num){
        var banner = $("#bannerGame");
            TweenMax.fromTo(banner,0.2,{scale:1.2},{scale:1});
            banner.html("<img src='https://yogome.github.io/WebGames/newStructure/minigames/" +optimized[num].mapUrl+ "/images/fbpost.png' />");
            banner.css("background-image","url(images/bgbanner"+optimized[num].subject+".png)");
    }
    
for(var i = 0; i<= optimized.length-1;i++){
  $("#carrousel").append(
    `<div class="btnOptimized`+i+` orderSelect`+i+` container-gameSelect" data-order="`+optimized[i].mapUrl+`">
    
    <div id="name-select`+ i +`" class="name-select">`+optimized[i].name+`<p>`+optimized[i].subject+`</p></div>
<div  class="bgGame`+i+` bg-selectgGame"></div>
    </div>`);
        $(".btnOptimized" + i).attr("number",i);
        $(".bgGame" + i).css( "background-image","url(https://yogome.github.io/WebGames/newStructure/minigames/"+optimized[i].mapUrl+"/images/fbpost.png)");

        $("#name-select" + i).css("background-image","url(images/selectgame"+optimized[i].subject+".png)");
    
        $(".btnOptimized" + i).mouseover(function(){
            $(this).css("opacity",1);
        });   
        $("#btnOptimized" + i).mouseout(function(){
            $(this).css("opacity",0.5);
        });   
        
        
    
        $(".btnOptimized" + i).click(function(){
            var place = $(this).attr("number");
            var texto = optimized[place].name.replace(/\s/g, "")
           _updateBanner(place);
            previewSong.src ="../songs/" + songs[optimized[place].song] + ".mp3";
            levelDifficulty(place);
            //previewSong.play();
            
            updateRadar(
                optimized[place].type.TARGET,
                optimized[place].type.COUNT,
                optimized[place].type.CHOOSE,
                optimized[place].type.MATCH,
                optimized[place].type.GRAB,
                optimized[place].type.SEQUENCE,
                optimized[place].type.TRACE
            );
        });   
    }   
   
    
    
    
    $("#bannerGame").append("<img src='https://yogome.github.io/WebGames/newStructure/minigames/" +optimized[0].mapUrl+ "/images/fbpost.png' />");
    $("#bannerGame").css("background-image","url(images/bgbanner"+optimized[0].subject+".png)");
    previewSong.src ="songs/" + songs[optimized[0].song] + ".mp3";
    previewSong.play();
    levelDifficulty(0);
    getSorted('.container-gameSelect', 'data-order')

        var randomScalingFactor = function() {
			return Math.round(Math.random() * 1);
		};
        var ctx = document.getElementById('canvas').getContext("2d");
        var gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
        gradientStroke.addColorStop(0, "rgba(128, 182, 244, 0.6)");
        gradientStroke.addColorStop(1, "rgba(244, 144, 128, 0.6)");
    
        var gradientFill = ctx.createLinearGradient(500, 0, 100, 0);
        gradientFill.addColorStop(0.3, "rgba(252, 238, 0.3)");
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
                    /*
                    
                    borderColor: gradientStroke,
            pointBorderColor: gradientStroke,
            pointBackgroundColor: gradientStroke,
           pointHoverBackgroundColor: gradientStroke,
            pointHoverBorderColor: gradientStroke,
            pointBorderWidth: 10,
            pointHoverRadius: 10,
            pointHoverBorderWidth: 1,
            pointRadius: 3,
            fill: false,
            borderWidth: 4,*/
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

		window.onload = function() {
			window.myRadar = new Chart(document.getElementById('canvas'), config);
		};

        function updateRadar(a,b,c,d,e,f,g){
            config.data.datasets.forEach(function(dataset) {
				dataset.data[0] = a;
                dataset.data[1] = b;
                dataset.data[2] = c;
                dataset.data[3] = d;
                dataset.data[4] = e;
                dataset.data[5] = f;
                dataset.data[6] = g;
                        for(var i = 0; i<=6;i++){
                            if(dataset.data[i] === 0){
                                dataset.data[i] = 0.1
                            }
                        }
            });
			window.myRadar.update();
        }
        updateRadar(
                optimized[0].type.TARGET,
                optimized[0].type.COUNT,
                optimized[0].type.CHOOSE,
                optimized[0].type.MATCH,
                optimized[0].type.GRAB,
                optimized[0].type.SEQUENCE,
                optimized[0].type.TRACE
            );
		var colorNames = Object.keys(window.chartColors);

    
});
