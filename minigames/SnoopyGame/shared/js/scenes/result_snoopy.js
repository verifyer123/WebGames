var soundsPath = "../sounds/"
var imagesUrl = "../shared/images/"

var result = function(){
    var lan = "ES"
    if(window.location.search!=""){
        var s = window.location.search.split('=')
        if(s.length>1){
            if(s[1]=="pt" || s[1]=="PT"){
                lan ="PT"
            }
        }
    }

	localizationData = {
		"PT":{
            "compartir":"Compartilhe",
            "genial":"Ótimo!",
            "puntuacion":"Sua Pontuação",
            "reintentar": "De Novo",
            "juegaEnApp": "Jogue no app!",
            "obtenRecompensas": "E obtenha ótimas recompensas",
            "descargar": "Baixar"
		},

		"ES":{
            "compartir":"Compartir",
            "genial":"¡Genial!",
            "puntuacion":"Tu Puntuación",
            "reintentar":"Reintentar",
            "juegaEnApp": "¡Juega en la app!",
            "obtenRecompensas": 'Y obtén grandes recompensas',
            "descargar": "Descargar"

		}
	}

	var assets = {
		atlases: [
			{
				name: 'atlas.resultScreen',
				json: imagesUrl + "atlas.json",
				image: imagesUrl + "atlas.png"},
		],
		images: [

		],
		sounds: [
            {	name: "click",
				file: soundsPath + "pop.mp3"},
        ],
	}

    var DELTA_ASWERS = 50
    var DELTA_QUESTION = 400
    var DELTA_DOTS = 30
    var INITIAL_HEIGTH = 700

    var DELTA_SPECIAL_CUPON_SLIDER = 420

	var sceneGroup

	var totalScore, totalTime, totalGoal
    var win
    var pivotRank
    var iconsGroup
    var buttonsActive
    var haveCoupon
    var goalScore
    var gameNumbers = null
    var icons
    var gameIndex
    var gameName
    var gameIcon
    var couponData
    var rankMinigame
    var minigameId
    var skinTable
	var overlayGroup
	var pollOverlay
    var currentCouponId

	var timeGoal = null
    var webCoupon

    var pollOptions = []
    var currentQuestion
    var questionsGroup
    var dotsGroup
    var inSlide, firstTouchX
    var inPoll
    var currentOpenQuestion

    var topStandarheigth, buttonSendHeigth
    var inSlideMovement

    var specialCupon
    var slideNumber
    var cuponSliderGroup

	function setScore(didWin,score,index) {


        gameName = "snoopy"
		totalScore = score
		totalGoal = 1
		totalTime = 0
        win = didWin
        
                //mixPanelTrack(gameName,"finishGame",didWin,score)
            

        var fontStyle = {font: "23px Gotham bold", fill: "#808080"}
        var text = new Phaser.Text(game, -100, -100,"test", fontStyle)
        fontStyle = {font: "23px Gotham", fill: "#808080"}
        text = new Phaser.Text(game, -100, -100,"test", fontStyle)
        fontStyle = {font: "23px Gotham light", fill: "#808080"}
        text = new Phaser.Text(game, -100, -100,"test", fontStyle)
        fontStyle = {font: "23px Gotham Book", fill: "#808080"}
        text = new Phaser.Text(game, -100, -100,"test", fontStyle)

	}


    function changeImage(index,group){

        for (var i = 0;i< group.length; i ++){
            group.children[i].alpha = 0
            if( i == index){
                group.children[i].alpha = 1
            }
        }
    }

    function loadSounds(){
		sound.decode(assets.sounds)
	}



	function shareEvent(){
        /*if(icons[gameIndex].demo!=null){
            if(!icons[gameIndex].demo){*/
                //mixPanelTrack(gameName,"pressFacebook")
            /*}
        }*/

        //if(!minigameId){
            FB.ui({
		    method: 'share',
		    href: icons[gameIndex].url,
		    mobile_iframe: true,
		    title: "Mi score es: " + totalScore
            }, function(response){
                //console.log(button)
            });
        /*}else{
            amazing.share(totalScore,gameName)
        }*/

	}

    function inputButton(obj){

		//console.log('pressed')

        if(obj.active == false){
            return
        }

        obj.active = false

        var parent = obj.parent

        changeImage(0,parent)
        sound.play("click")

        var scaleTween = game.add.tween(parent.scale).to({x:0.8,y:0.8}, 200, Phaser.Easing.Cubic.In, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(parent.scale).to({x:1,y:1}, 200, Phaser.Easing.Cubic.Out, true)
            changeImage(1,parent)

            if(parent.tag == 'compartir'){

                shareEvent()
                game.time.events.add(2000,function(){

                    obj.active = true
                },this)

            }else if(parent.tag == 'reintentar'){

               
                        //mixPanelTrack(gameName,"retryGame")
                    
                        //mixPanelTrack(gameName,"enterGame")
                   

                var alphaTween = game.add.tween(sceneGroup).to({alpha:0},400, Phaser.Easing.Cubic.Out, true,200)
                    alphaTween.onComplete.add(function(){
                        sceneloader.show("snoopyEnBuscaDelSabor")
                    })
            }
        })

    }

    function createButtons(pivot){

        var buttonsGroup = game.add.group()
        sceneGroup.add(buttonsGroup)

        var buttonNames = ['compartir','reintentar']

        var pivotX = game.world.centerX - 120
        var pivotY = pivot-10
        for(var i = 0;i<buttonNames.length;i++){

            var group = game.add.group()
            group.x = pivotX
            group.y = pivotY
            buttonsGroup.add(group)

            group.tag = buttonNames[i]

            var button1 = group.create(0,0,'atlas.resultScreen',buttonNames[i])
            button1.anchor.setTo(0.5,0.5)

            button1.inputEnabled = true
            button1.events.onInputDown.add(inputButton)
            button1.active = true
            pivotX += 240
        }

    }

    

    function addRank(){

        //rankMinigame = 50

        var group = game.add.group()
        group.x = game.world.centerX
        group.y = pivotRank-10
        rankGroup.add(group)


        var fontStyle = {font: "30px Gotham Book", fill: "#808080",align:"center"}
        var text = new Phaser.Text(sceneGroup.game, 0, 0,localizationData[lan]["puntuacion"], fontStyle)
        text.anchor.setTo(0.5)
        group.add(text)
        
        var pivotY = 80
        
        var pivotX = -110
        var coin = group.create(pivotX,pivotY,'atlas.resultScreen','coin')
        coin.anchor.setTo(0.5,0.5)
        coin.scale.setTo(0.8)

        var textAdd = totalScore

        if(totalScore == 0){
            textAdd = '' + totalScore
        }

        fontStyle = {font: "35px Gotham light", fill: "#e0792b",align:"center"}
        text = new Phaser.Text(sceneGroup.game, coin.x + coin.width * 0.75,pivotY,textAdd, fontStyle)
        text.anchor.setTo(0,0.5)
        group.add(text)

        pivotX+=195
        var gameImage = group.create(pivotX, pivotY,"atlas.resultScreen","icon")
        gameImage.scale.setTo(0.4,0.4)
        gameImage.anchor.setTo(0.5,0.5)

        var graphics = game.add.graphics(pivotX,pivotY)
        graphics.beginFill(0xff0000)
        graphics.drawRoundedRect(-gameImage.width/2,-gameImage.height/2,gameImage.width,gameImage.height,20)
        graphics.endFill()
        group.add(graphics)

        gameImage.mask = graphics

        
	    game.add.tween(group).from({alpha:0},500,Phaser.Easing.linear,true)
	    

    }


	function createScene(){


        loadSounds()


        var showIcons = true

        var background = new Phaser.Graphics(game)
        background.beginFill(0xffffff);
        background.drawRect(0, 0, game.world.width, game.world.height);
        background.endFill();
        background.anchor.setTo(0,0)
        sceneGroup.add(background)


        //setRank()
        //rankMinigame = 10
        

    
        //haveCoupon = true
        //win = false
        
        var textToUse = localizationData[lan]["genial"]
        var colorTint = 0xad0209
        var topHeight = 1.05
        //scaleSpine = 1.3
        var pivotButtons = game.world.height * 0.68


        var topRect = sceneGroup.create(0,0,'atlas.resultScreen','fondo_result')
        topRect.width = game.world.width
        topRect.height*= topHeight
        topRect.tint = colorTint
        sceneGroup.topRect = topRect


        var fontStyle = {font: "30px Gotham", fill: "#ffffff",align:"center"}
        var text = new Phaser.Text(sceneGroup.game, game.world.centerX, topRect.height * 0.145,textToUse, fontStyle)
        text.anchor.setTo(0.5)
        sceneGroup.add(text)

        var buddy = game.add.spine(game.world.centerX,topRect.height * 0.87, "snoopy");
        buddy.scale.setTo(0.9,0.9)
        buddy.setSkinByName("normal")
        buddy.setAnimationByName(0, "dance", true);
        sceneGroup.add(buddy)

        var backImages = sceneGroup.create(game.world.centerX,topRect.height*0.5,"atlas.resultScreen","onomatopeyas")
        backImages.anchor.setTo(0.5)


        /*var buddy = sceneGroup.create(game.world.centerX,topRect.height * 0.5,"atlas.resultScreen","snoopy_dance")
        buddy.anchor.setTo(0.5)*/


		tweenScene = game.add.tween(sceneGroup).to({alpha: 1}, 500, Phaser.Easing.Cubic.In, 500, true)

        createButtons(pivotButtons)

        sceneGroup.add(rankGroup)

        addRank()

        var amazing = sceneGroup.create(game.world.centerX,game.world.centerY+300,"atlas.resultScreen","amazing")
        amazing.tint = 0x808080
        amazing.anchor.setTo(0.5)

        var backMark = game.add.graphics()
        backMark.x = 0
        backMark.y = game.world.height-30
        backMark.beginFill(0x000000)
        backMark.drawRect(0,0,game.world.width,30)
        backMark.endFill()
        sceneGroup.add(backMark)
        backMark.alpha = 0.7

        var fontStyle = {font: "15px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "right"}
        var waterMark =  new Phaser.Text(sceneGroup.game, game.world.width-10, game.world.height-2, "©2018 PEANUTS WORLDWIDE LLC", fontStyle)
        waterMark.anchor.setTo(1,1)
        waterMark.alpha = 0.8
        sceneGroup.add(waterMark)

        var waterMark =  new Phaser.Text(sceneGroup.game, 10, game.world.height-2, "COME BIEN", fontStyle)
        waterMark.anchor.setTo(0,1)
        waterMark.alpha = 0.8
        sceneGroup.add(waterMark)


        
	}

	function initialize(){

		totalScore = totalScore || 0
		totalTime = totalTime || 99.99
		totalGoal = 1

        game.stage.backgroundColor = "#ffffff"
        currentQuestion = -1


	}

    

    function preload(){

        pivotRank = game.world.centerY - 10
        //console.log(couponData)

        sceneGroup = game.add.group()
		sceneGroup.alpha = 0

        game.load.spine('snoopy','images/spine/snoopy/snoopy.json')


        rankGroup = game.add.group()
        game.load.bitmapFont('gotham', imagesUrl + 'bitfont/gotham.png', imagesUrl + 'bitfont/gotham.fnt');
        game.load.bitmapFont('gothamMedium', imagesUrl + 'bitfont/gothamMedium.png', imagesUrl + 'bitfont/gothamMedium.fnt');

        //couponData = {scoreGoal:1}
        specialCoupon = false
        
        haveCoupon = false

        game.load.bitmapFont('gotham', imagesUrl + 'bitfont/gotham.png', imagesUrl + 'bitfont/gotham.fnt');
        game.load.bitmapFont('gothamMedium', imagesUrl + 'bitfont/gothamMedium.png', imagesUrl + 'bitfont/gothamMedium.fnt');



        game.load.start()

    }

	return {
		assets: assets,
		name: "result",
		create: createScene,
        preload: preload,
		setScore: setScore,
		init: initialize,
	}
}()



function detectmob() {
 if( navigator.userAgent.match(/Android/i)
 || navigator.userAgent.match(/webOS/i)
 || navigator.userAgent.match(/iPhone/i)
 || navigator.userAgent.match(/iPad/i)
 || navigator.userAgent.match(/iPod/i)
 || navigator.userAgent.match(/BlackBerry/i)
 || navigator.userAgent.match(/Windows Phone/i)
 ){
     //document.body.style.zoom = "100%"
    return true;
  }
 else {
     //document.body.style.zoom = "100%"
    return false;
  }
}

var isMobile = detectmob();
