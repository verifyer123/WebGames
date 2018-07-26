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
           $("#bannerGame").html("<img src='https://yogome.github.io/WebGames/newStructure/minigames/" +optimized[place].mapUrl+ "/images/fbpost.png' />")
            console.log(optimized[place].type.TARGET);
            previewSong.src ="../songs/" + songs[optimized[place].song] + ".mp3";
            previewSong.play();
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
   
    $("#bannerGame").append("<img src='https://yogome.github.io/WebGames/newStructure/minigames/" +optimized[0].mapUrl+ "/images/fbpost.png' />")
    previewSong.src ="../songs/" + songs[optimized[0].song] + ".mp3";
    previewSong.play();
    getSorted('.container-gameSelect', 'data-order')

var randomScalingFactor = function() {
			return Math.round(Math.random() * 1);
		};

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
					backgroundColor: color(window.chartColors.blue).alpha(0.8).rgbString(),
					borderColor: window.chartColors.blue,
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
                        max: 1,
                        stepSize: 1,
                        display:false
                        
                        
					},
                    pointLabels: {
                        fontSize: 15,
                        fontColor:"#FFF"
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
