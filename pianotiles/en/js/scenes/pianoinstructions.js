var pianoInstructions = function(){

	var localizationData = {
		"EN":{
			"remove":"Remove",
			"badTeeth":"the bad teeth \nto play the song",
			"go":"OK",
			"assetInstructions":"instructionsen"
		},

		"ES":{
			"remove":"Quita",
			"badTeeth":"los dientes malos \npara tocar la canción",
			"go":"OK",
			"assetInstructions":"instructionses"
		}
	}

	var assets = {
		atlases: [
			{
				name: "atlas.instructionsScreen",
				json: "images/instructions/atlas.json",
				image: "images/instructions/atlas.png",},
                
            {   name: "atlas.pianotiles",
				json: "images/pianotiles/atlas.json",
				image: "images/pianotiles/atlas.png",
			}
		]
	}

	var sceneGroup

	function isMobileBrowser(){
		 var check = false;
		 (function(a) {
		   		if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
	      })(navigator.userAgent || navigator.vendor || window.opera);
		  return check;
	}


	function createInstructions(){

        var game = sceneGroup.game
		var circleGroup = new Phaser.Group(sceneGroup.game)

		if(isMobileBrowser()){
			 
			var fontStyle = {font: "150px VAGRounded", fill: "#ffffff", align: "center"}
        
	        var circle = circleGroup.create(0,-50,'atlas.instructionsScreen','circle')
	        circle.anchor.set(0.5,0.5)
	        
	        var tooth = circleGroup.create(0,circle.y,'atlas.pianotiles','toothnote')
	        tooth.anchor.set(0.5,0.5)
	        
			fontStyle.font = "100px VAGRounded"
			var topText = new Phaser.Text(sceneGroup.game, 0, 0, localization.getString(localizationData, "remove"), fontStyle)
			topText.anchor.setTo(0.5, 0.5)
	        topText.y = tooth.y - tooth.height * 1.8
			circleGroup.add(topText)

			fontStyle.font = "45px VAGRounded"

			var bottomText = new Phaser.Text(sceneGroup.game, 0, 0, localization.getString(localizationData, "badTeeth"), fontStyle)
			bottomText.anchor.setTo(0.5, 0.5)
	        bottomText.y = tooth.y + tooth.height * 1.8
			circleGroup.add(bottomText)
		}else{
			var imageInstructions = circleGroup.create(0, 0, "atlas.instructionsScreen", localization.getString(localizationData, "assetInstructions"))
			imageInstructions.anchor.setTo(0.5, 0.5)
		}

		return circleGroup
	}

	function startGame(){
        mixpanel.track(
            "enterGame",
            {"gameName": "pianoTiles"}
        );
        console.log(location.host + ' userIp')
		sceneloader.show("creatPianoTiles")
	}

	function createButton(){
		var buttonGroup = new Phaser.Group(sceneGroup.game)

		var buttonSprite = buttonGroup.create(0, 0, "atlas.instructionsScreen", "button")
		buttonSprite.anchor.setTo(0.5, 0.5)

		buttonSprite.inputEnabled = true
		buttonSprite.events.onInputUp.add(startGame, this)

		var fontStyle = {font: "60px VAGRounded", fill: "#ffffff", align: "center"}

		var label = new Phaser.Text(sceneGroup.game, 0, 0, localization.getString(localizationData, "go"), fontStyle)
		label.anchor.setTo(0.5, 0.5)
		buttonGroup.add(label)

		return buttonGroup
	}
    
    function myIP() {
    if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
    else xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");

    xmlhttp.open("GET","http://api.hostip.info/get_html.php",false);
    xmlhttp.send();

    hostipInfo = xmlhttp.responseText.split("\n");

    for (i=0; hostipInfo.length >= i; i++) {
        ipAddress = hostipInfo[i].split(":");
        if ( ipAddress[0] == "IP" ) return ipAddress[1];
    }

    return false;
}

	function createScene(){

		sceneGroup = game.add.group()

		var circleInstructions = createInstructions()
		circleInstructions.x = game.world.centerX
		circleInstructions.y = game.world.centerY 
		sceneGroup.add(circleInstructions)

		var buttonGo = createButton()
		buttonGo.x = game.world.centerX
		buttonGo.y = game.world.height * 0.8
		sceneGroup.add(buttonGo)
            
        mixpanel.track(
            "loadGame",
            {"gameName": "pianoTiles"}
        );
	}

	function initialize(){
		game.stage.backgroundColor = "#38b0f6"
        //game.stage.backgroundColor = "#aea1ff"
	}

	return {
		name: "pianoInstructions",
		assets: assets,
		create: createScene,
		init: initialize
	}
}()