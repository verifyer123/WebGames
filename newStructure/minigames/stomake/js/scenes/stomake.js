
var soundsPath = "../../shared/minigames/sounds/"
var particlesPath="../../shared/minigames/images/particles/battle/"
var stomake = function(){
    
    var localizationData = {
		"EN":{
            "howTo":"How to Play?",
            "moves":"Moves left",
			"stop":"Stop!"
		},

		"ES":{
            "moves":"Movimientos extra",
            "howTo":"¿Cómo jugar?",
            "stop":"¡Detener!"
		}
	}
    

	assets = {
        atlases: [
            {   
                name: "atlas.stomake",
                json: "images/stomake/atlas.json",
                image: "images/stomake/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/stomake/timeAtlas.json",
                image: "images/stomake/timeAtlas.png",
            },
        ],
        images: [

		],
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "cut",
				file: soundsPath + "cut.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrongAnswer.mp3"},
            {	name: "explosion",
				file: soundsPath + "laserexplode.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "shoot",
				file: soundsPath + "shoot.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {	name: "eathealthy",
				file: soundsPath + "drag.mp3"},
            {	name: "eatunhealthy",
				file: soundsPath + "flesh.mp3"},
            {	name: "lost",
				file: soundsPath + "growlDeep.mp3"},
            {	name: "falling",
				file: soundsPath + "falling.mp3"},
            
			
		],
        jsons: [
			{
				name: 'pickedEnergy', 
				file:  particlesPath + 'pickedEnergy/specialBar1.json'
			}
		],
    }
    
        
    var lives = null
	var sceneGroup = null
	var background
    var gameActive = true
	var shoot
	var particlesGroup, particlesUsed
    var gameIndex = 135
	var indexGame
    var overlayGroup
    var spaceSong
    
    var backgroundGroup=null
    
    var charRight,charLeft
    var speed,dificulty,howMany,howMany2,howMany3
    var food=new Array(10)
    var activeFood=new Array(10)
    var foodTweens=new Array(10)
    var food2=new Array(10)
    var activeFood2=new Array(10)
    var foodTweens2=new Array(10)
    var food3=new Array(10)
    var activeFood3=new Array(10)
    var foodTweens3=new Array(10)
    var tweenTiempo
    var clock, timeBar
    var emitter
    var wall

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#000000"
        lives = 3
        emitter=""
        howMany=0
        howMany2=0
        howMany3=0
        wall=0
        charRight=false
        charLeft=false
        dificulty=1000
        speed=4000
        loadSounds()
	}

    function popObject(obj,delay){
        
        game.time.events.add(delay,function(){
            
            sound.play("cut")
            obj.alpha = 1
            game.add.tween(obj.scale).from({ y:0.01},250,Phaser.Easing.linear,true)
        },this)
    }
    
    function animateScene() {
                
        gameActive = false
        
        var startGroup = new Phaser.Group(game)
        sceneGroup.add(startGroup)
                
        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)

    }
	
    function changeImage(index,group){
        for (var i = 0;i< group.length; i ++){
            group.children[i].alpha = 0
            if( i == index){
                group.children[i].alpha = 1
            }
        }
    } 
    
    function addNumberPart(obj,number,isScore){
        
        var pointsText = lookParticle('text')
        if(pointsText){
            
            pointsText.x = obj.world.x
            pointsText.y = obj.world.y
            pointsText.anchor.setTo(0.5,0.5)
            pointsText.setText(number)
            pointsText.scale.setTo(1,1)

            var offsetY = -100

            pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
            
            deactivateParticle(pointsText,800)
            if(isScore){
                
                pointsText.scale.setTo(0.7,0.7)
                var tweenScale = game.add.tween(obj.parent.scale).to({x:0.8,y:0.8},200,Phaser.Easing.linear,true)
                tweenScale.onComplete.add(function(){
                    game.add.tween(obj.parent.scale).to({x:1,y:1},200,Phaser.Easing.linear,true)
                })

                offsetY = 100
            }
            
            game.add.tween(pointsText).to({y:pointsText.y + 100},800,Phaser.Easing.linear,true)
            game.add.tween(pointsText).to({alpha:0},250,Phaser.Easing.linear,true,500)
        }
        
    }
    
    function missPoint(){
        
        sound.play("wrong")
		        
        lives--;
        heartsGroup.text.setText('X ' + lives)
        
        var scaleTween = game.add.tween(heartsGroup.scale).to({x: 0.7,y:0.7}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
        
        if(lives == 0){
            stopGame(false)
        }
        
        addNumberPart(heartsGroup.text,'-1',true)
        
    }
    
    function addPoint(number){
        
        sound.play("magic")
        pointsBar.number+=number;
        pointsBar.text.setText(pointsBar.number)
        
        var scaleTween = game.add.tween(pointsBar.scale).to({x: 1.05,y:1.05}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(pointsBar.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
        
        addNumberPart(pointsBar.text,'+' + number,true)		
        
    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.stomake','xpcoins')
        pointsImg.anchor.setTo(1,0)
    
        var fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 0, "0", fontStyle)
        pointsText.x = -pointsImg.width * 0.45
        pointsText.y = pointsImg.height * 0.25
        pointsBar.add(pointsText)
        
        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
        
        pointsBar.text = pointsText
        pointsBar.number = 0
        
    }
    
    function createHearts(){
        
        heartsGroup = game.add.group()
        heartsGroup.y = 10
        sceneGroup.add(heartsGroup)
        
        
        var pivotX = 10
        var group = game.add.group()
        group.x = pivotX
        heartsGroup.add(group)

        var heartImg = group.create(0,0,'atlas.stomake','life_box')

        pivotX+= heartImg.width * 0.45
        
        var fontStyle = {font: "32px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 18, "0", fontStyle)
        pointsText.x = pivotX
        pointsText.y = heartImg.height * 0.15
        pointsText.setText('X ' + lives)
        heartsGroup.add(pointsText)
        
        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
        
        heartsGroup.text = pointsText
                
    }
    
    function stopGame(win){
        
		sound.play("wrong")
		sound.play("gameLose")
		
        gameActive = false
        
        
        
        
        spaceSong.stop()
        		
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1300)
		tweenScene.onComplete.add(function(){
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)

			//amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
		})
    }
    
    
    function preload(){
        
		buttons.getImages(game)
		
        game.stage.disableVisibilityChange = false;
        epicparticles.loadEmitter(game.load, "pickedEnergy")
        
        
        game.load.audio('spaceSong', soundsPath + 'songs/musicVideogame9.mp3');
        
        game.load.spritesheet("coin", 'images/Spine/coin/coin.png', 122, 123, 12)
		game.load.image('howTo',"images/stomake/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/stomake/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/stomake/introscreen.png")
        
        //game.load.spine("ship","images/Spine/ship/ship.json")
        game.load.spine("tomaguito","images/Spine/normal/normal.json")
		
		console.log(localization.getLanguage() + ' language')
        
    }
    
    function createOverlay(){
        
        overlayGroup = game.add.group()
		//overlayGroup.scale.setTo(0.8,0.8)
        sceneGroup.add(overlayGroup)
        
        var rect = new Phaser.Graphics(game)
        rect.beginFill(0x000000)
        rect.drawRect(0,0,game.world.width *2, game.world.height *2)
        rect.alpha = 0.7
        rect.endFill()
        rect.inputEnabled = true
        rect.events.onInputDown.add(function(){
            rect.inputEnabled = false
			sound.play("pop")
            generateThem()
            //Aqui va la primera funciòn que realizara el juego
            
            startGame=true
            game.add.tween(overlayGroup).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){
                
				overlayGroup.y = -game.world.height
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.stomake','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'Movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.stomake',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.stomake','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
	   
        backgroundGroup = game.add.group()
        characterGroup = game.add.group()
        
        sceneGroup.add(backgroundGroup)
        sceneGroup.add(characterGroup)
        
        //Aqui inicializo los botones
        controles=game.input.keyboard.createCursorKeys()
        
        correctParticle = createPart("star")
        sceneGroup.add(correctParticle) 
        wrongParticle = createPart("wrong")
        sceneGroup.add(wrongParticle)
        boomParticle = createPart("smoke")
        sceneGroup.add(boomParticle)
        
        
        
        backG1=game.add.sprite(game.world.centerX,game.world.centerY,"atlas.stomake","fondo");
        backG1.anchor.setTo(0.5,0.5)
        backG1.scale.setTo(game.world.width/500,1)  
        backgroundGroup.add(backG1)
        
        backG12=game.add.sprite(game.world.centerX,game.world.centerY-game.world.height,"atlas.stomake","fondo");
        backG12.anchor.setTo(0.5,0.5)
        backG12.scale.setTo(game.world.width/500,1)  
        backgroundGroup.add(backG12)
        
        
        
        
        backG2=game.add.tileSprite(0,0,50,game.world.height,"atlas.stomake","tile");
        backG3=game.add.tileSprite(game.world.width,0,50,game.world.height,"atlas.stomake","tile");
        backG3.scale.setTo(-1,1)
        
        backgroundGroup.add(backG2)
        backgroundGroup.add(backG3)
        
        
        floor=game.add.sprite(game.world.centerX,game.world.height-50,"atlas.stomake","piso")
        floor.scale.setTo(game.world.width/500,1)
        floor.anchor.setTo(0.5,0.5)
        backgroundGroup.add(floor)

        
        //Coins
        coins=game.add.sprite(game.world.centerX,game.world.centerY, "coin")
        coins.anchor.setTo(0.5)
        coins.scale.setTo(0.5)
        coins.animations.add('coin');
        coins.animations.play('coin', 24, true);
        coins.alpha=0
        
        character=game.add.spine(game.world.centerX,game.world.height-100, "tomaguito");
        character.setSkinByName("normal")
        character.scale.setTo(0.7)
        character.setAnimationByName(0,"IDLE",true)
        characterGroup.add(character)
        
        characterProxy=game.add.sprite(character.x,character.y,"atlas.stomake","healthy3")
        characterProxy.anchor.setTo(0.5,0.5)
        characterProxy.scale.setTo(0.4,0.7)
        characterProxy.alpha=0
        
        
        for(var fill=0;fill<5;fill++){
            
            
            activeFood[fill]=false
            activeFood[fill+5]=false
            
            activeFood2[fill]=false
            activeFood2[fill+5]=false
            
            activeFood3[fill]=false
            activeFood3[fill+5]=false
            
            food[fill]=game.add.sprite(-200,100,"atlas.stomake","junk"+(fill+1))
            food[fill].tag="junk"
            food[fill].anchor.setTo(0.5,0.5)
            food[fill].scale.setTo(0.7,0.7)
            characterGroup.add(food[fill])
            
            food2[fill]=game.add.sprite(-200,100,"atlas.stomake","junk"+(fill+1))
            food2[fill].tag="junk"
            food2[fill].anchor.setTo(0.5,0.5)
            food2[fill].scale.setTo(0.7,0.7)
            characterGroup.add(food2[fill])
            
            food3[fill]=game.add.sprite(-200,100,"atlas.stomake","junk"+(fill+1))
            food3[fill].tag="junk"
            food3[fill].anchor.setTo(0.5,0.5)
            food3[fill].scale.setTo(0.7,0.7)
            characterGroup.add(food3[fill])
            
            
            food[fill+5]=game.add.sprite(-200,100,"atlas.stomake","healthy"+(fill+1))
            food[fill+5].tag="healthy"
            food[fill+5].anchor.setTo(0.5,0.5)
            food[fill+5].scale.setTo(0.7,0.7)
            characterGroup.add(food[fill+5])
            
            food2[fill+5]=game.add.sprite(-200,100,"atlas.stomake","healthy"+(fill+1))
            food2[fill+5].tag="healthy"
            food2[fill+5].anchor.setTo(0.5,0.5)
            food2[fill+5].scale.setTo(0.7,0.7)
            characterGroup.add(food2[fill+5])
            
            food3[fill+5]=game.add.sprite(-200,100,"atlas.stomake","healthy"+(fill+1))
            food3[fill+5].tag="healthy"
            food3[fill+5].anchor.setTo(0.5,0.5)
            food3[fill+5].scale.setTo(0.7,0.7)
            characterGroup.add(food3[fill+5])
            
            
            
            
        }
        
        
        var rect2 = new Phaser.Graphics(game)
        rect2.beginFill(0x0000ff)
        rect2.drawRect(0,0,game.world.width/2, game.world.height *2)
        rect2.alpha = 0
        rect2.endFill()
        rect2.inputEnabled = true
        rect2.events.onInputDown.add(moveLeft, this);
        rect2.events.onInputUp.add(stopChar, this);
        
        
        var rect3 = new Phaser.Graphics(game)
        rect3.beginFill(0xff0000)
        rect3.drawRect(game.world.centerX,0,game.world.width/2, game.world.height *2)
        rect3.alpha = 0
        rect3.endFill()
        rect3.inputEnabled = true
        rect3.events.onInputDown.add(moveRight, this);
        rect3.events.onInputUp.add(stopChar, this);
        
        backgroundGroup.add(rect2)
        backgroundGroup.add(rect3)
        
        
    }
    
    function moveLeft()
    {
       charLeft=true
        
    }
    function moveRight()
    {
        charRight=true
        
    }
    
    function stopChar(){
        charRight=false
        charLeft=false
    }
    
    
    //Aqui creo los enemigos
    function enemyGenerator(enemys,enemysActive,enemyTween, howMuch, speed, params, enemys2,enemys2Active,enemy2Tween,enemys3,enemys3Active,enemy3Tween){
        params = params || {}
        var destinyY=params.destinyY || game.world.centerY
        var where=0
        var generate=game.rnd.integerInRange(0,9);
        wall=2
        
        if(howMany<howMuch && wall!=2){
            if(where==0){
                while(enemysActive[generate]==true){
                    generate=game.rnd.integerInRange(0,9);
                }
                if(enemysActive[generate]==false){
                    enemys[generate].alpha=1
                    enemys[generate].scale.setTo(0.7,0.7)
                    enemys[generate].position.x=game.rnd.integerInRange(100,game.world.width-100);
                    sound.play("falling")
                    enemys[generate].position.y=-200;
                    enemyTween[generate]=game.add.tween(enemys[generate]).to({y:destinyY},speed,Phaser.Easing.In,true)
                    enemysActive[generate]=true;
                    howMany++;
                }
            }
        }
        
        if(wall==2){
           
            var generate2=game.rnd.integerInRange(0,9);
            var generate3=game.rnd.integerInRange(0,9);
            var generate4=game.rnd.integerInRange(0,9);
            var generate5=game.rnd.integerInRange(0,9);
            
            var generate11=game.rnd.integerInRange(0,9);
            var generate12=game.rnd.integerInRange(0,9);
            var generate13=game.rnd.integerInRange(0,9);
            var generate14=game.rnd.integerInRange(0,9);
            var generate15=game.rnd.integerInRange(0,9);
            
            var generate21=game.rnd.integerInRange(0,9);
            var generate22=game.rnd.integerInRange(0,9);
            var generate23=game.rnd.integerInRange(0,9);
            var generate24=game.rnd.integerInRange(0,9);
            var generate25=game.rnd.integerInRange(0,9);
            
            
            var whichGenerate=game.rnd.integerInRange(0,4);
            var whichGenerate2=game.rnd.integerInRange(0,4);
            var whichGenerate3=game.rnd.integerInRange(0,4);
            
            if(whichGenerate==0)generate=game.rnd.integerInRange(5,9);
            if(whichGenerate==1)generate2=game.rnd.integerInRange(5,9);
            if(whichGenerate==2)generate3=game.rnd.integerInRange(5,9);
            if(whichGenerate==3)generate4=game.rnd.integerInRange(5,9);
            if(whichGenerate==4)generate5=game.rnd.integerInRange(5,9);
            
            if(whichGenerate2==0)generate11=game.rnd.integerInRange(5,9);
            if(whichGenerate2==1)generate12=game.rnd.integerInRange(5,9);
            if(whichGenerate2==2)generate13=game.rnd.integerInRange(5,9);
            if(whichGenerate2==3)generate14=game.rnd.integerInRange(5,9);
            if(whichGenerate2==4)generate15=game.rnd.integerInRange(5,9);
            
            if(whichGenerate3==0)generate21=game.rnd.integerInRange(5,9);
            if(whichGenerate3==1)generate22=game.rnd.integerInRange(5,9);
            if(whichGenerate3==2)generate23=game.rnd.integerInRange(5,9);
            if(whichGenerate3==3)generate24=game.rnd.integerInRange(5,9);
            if(whichGenerate3==4)generate25=game.rnd.integerInRange(5,9);

            while(enemysActive[generate]==true && enemysActive[generate2]==true && enemysActive[generate3]==true && enemysActive[generate4]==true && enemysActive[generate5]==true && generate==generate2 && generate==generate3 && generate==generate4 && generate==generate5 && generate2==generate3 && generate2==generate4 && generate2==generate5 && generate3==generate4 && generate3==generate5 && generate4==generate5 &&  generate11==generate12 && generate11==generate13 && generate11==generate14 && generate11==generate15 && generate12==generate13 && generate12==generate14 && generate12==generate15 && generate13==generate14 && generate13==generate15 && generate14==generate15 && generate21==generate22 && generate21==generate23 && generate21==generate24 && generate21==generate25 && generate22==generate23 && generate22==generate24 && generate22==generate25 && generate23==generate24 && generate23==generate25 && generate24==generate25){
                 
               console.log(wall)
                   if(enemysActive[generate]==true && whichGenerate!=0)generate=game.rnd.integerInRange(0,4);
                   if(enemysActive[generate2]==true && whichGenerate!=1)generate2=game.rnd.integerInRange(0,4);
                   if(enemysActive[generate3]==true && whichGenerate!=2)generate3=game.rnd.integerInRange(0,4);
                   if(enemysActive[generate4]==true && whichGenerate!=3)generate4=game.rnd.integerInRange(0,4);
                   if(enemysActive[generate5]==true && whichGenerate!=4)generate5=game.rnd.integerInRange(0,4);
                    
                    if(whichGenerate==0 && enemysActive[generate]==true)generate=game.rnd.integerInRange(5,9);
                    if(whichGenerate==1 && enemysActive[generate2]==true)generate2=game.rnd.integerInRange(5,9);
                    if(whichGenerate==2 && enemysActive[generate3]==true)generate3=game.rnd.integerInRange(5,9);
                    if(whichGenerate==3 && enemysActive[generate4]==true)generate4=game.rnd.integerInRange(5,9);
                    if(whichGenerate==4 && enemysActive[generate5]==true)generate5=game.rnd.integerInRange(5,9);
                
                
                if(enemysActive[generate11]==true && whichGenerate2!=0)generate11=game.rnd.integerInRange(0,4);
                   if(enemysActive[generate12]==true && whichGenerate2!=1)generate12=game.rnd.integerInRange(0,4);
                   if(enemysActive[generate13]==true && whichGenerate2!=2)generate13=game.rnd.integerInRange(0,4);
                   if(enemysActive[generate14]==true && whichGenerate2!=3)generate14=game.rnd.integerInRange(0,4);
                   if(enemysActive[generate15]==true && whichGenerate2!=4)generate15=game.rnd.integerInRange(0,4);
                    
                    if(whichGenerate2==0 && enemys2Active[generate11]==true)generate11=game.rnd.integerInRange(5,9);
                    if(whichGenerate2==1 && enemys2Active[generate12]==true)generate12=game.rnd.integerInRange(5,9);
                    if(whichGenerate2==2 && enemys2Active[generate13]==true)generate13=game.rnd.integerInRange(5,9);
                    if(whichGenerate2==3 && enemys2Active[generate14]==true)generate14=game.rnd.integerInRange(5,9);
                    if(whichGenerate2==4 && enemys2Active[generate15]==true)generate15=game.rnd.integerInRange(5,9);
                
                
                if(enemysActive[generate21]==true && whichGenerate!=0)generate21=game.rnd.integerInRange(0,4);
                   if(enemysActive[generate22]==true && whichGenerate3!=1)generate22=game.rnd.integerInRange(0,4);
                   if(enemysActive[generate23]==true && whichGenerate3!=2)generate23=game.rnd.integerInRange(0,4);
                   if(enemysActive[generate24]==true && whichGenerate3!=3)generate24=game.rnd.integerInRange(0,4);
                   if(enemysActive[generate25]==true && whichGenerate3!=4)generate25=game.rnd.integerInRange(0,4);
                    
                    if(whichGenerate3==0 && enemys3Active[generate21]==true)generate21=game.rnd.integerInRange(5,9);
                    if(whichGenerate3==1 && enemys3Active[generate22]==true)generate22=game.rnd.integerInRange(5,9);
                    if(whichGenerate3==2 && enemys3Active[generate23]==true)generate23=game.rnd.integerInRange(5,9);
                    if(whichGenerate3==3 && enemys3Active[generate24]==true)generate24=game.rnd.integerInRange(5,9);
                    if(whichGenerate3==4 && enemys3Active[generate25]==true)generate25=game.rnd.integerInRange(5,9);
                    
                }
            
            if(enemysActive[generate]==false && enemysActive[generate2]==false && enemysActive[generate3]==false && enemysActive[generate4]==false && enemysActive[generate5]==false && generate!=generate2 && generate!=generate3 && generate!=generate4 && generate!=generate5 && generate2!=generate3 && generate2!=generate4 && generate2!=generate5 && generate3!=generate4 && generate3!=generate5 && generate4!=generate5 && generate11!=generate12 && generate11!=generate13 && generate11!=generate14 && generate11!=generate15 && generate12!=generate13 && generate12!=generate14 && generate12!=generate15 && generate13!=generate14 && generate13!=generate15 && generate14!=generate15 && generate21!=generate22 && generate21!=generate23 && generate21!=generate24 && generate21!=generate25 && generate22!=generate23 && generate22!=generate24 && generate22!=generate25 && generate23!=generate24 && generate23!=generate25 && generate24!=generate25 ){
               
                enemys[generate].alpha=1
                enemys[generate].scale.setTo(0.7,0.7)
                enemys[generate].position.x=game.world.centerX-200
                enemys[generate].position.y=-250;
                enemyTween[generate]=game.add.tween(enemys[generate]).to({y:destinyY},speed+50,Phaser.Easing.In,true)
                enemysActive[generate]=true;
                howMany++;
                
                
                enemys[generate2].alpha=1
                enemys[generate2].scale.setTo(0.7,0.7)
                enemys[generate2].position.x=game.world.centerX-100
                enemys[generate2].position.y=-200;
                enemyTween[generate2]=game.add.tween(enemys[generate2]).to({y:destinyY},speed,Phaser.Easing.In,true)
                enemysActive[generate2]=true;
                howMany++;

                
                enemys[generate3].alpha=1
                enemys[generate3].scale.setTo(0.7,0.7)
                enemys[generate3].position.x=game.world.centerX
                enemys[generate3].position.y=-250;
                enemyTween[generate3]=game.add.tween(enemys[generate3]).to({y:destinyY},speed+50,Phaser.Easing.In,true)
                enemysActive[generate3]=true;
                howMany++;

                
                enemys[generate4].alpha=1
                enemys[generate4].scale.setTo(0.7,0.7)
                enemys[generate4].position.x=game.world.centerX+100
                enemys[generate4].position.y=-200;
                enemyTween[generate4]=game.add.tween(enemys[generate4]).to({y:destinyY},speed,Phaser.Easing.In,true)
                enemysActive[generate4]=true;
                howMany++;

                enemys[generate5].alpha=1
                enemys[generate5].scale.setTo(0.7,0.7)
                enemys[generate5].position.x=game.world.centerX+200
                enemys[generate5].position.y=-250;
                enemyTween[generate5]=game.add.tween(enemys[generate5]).to({y:destinyY},speed+50,Phaser.Easing.In,true)
                enemysActive[generate5]=true;
                howMany++;
                
                
                enemys2[generate11].alpha=1
                enemys2[generate11].scale.setTo(0.7,0.7)
                enemys2[generate11].position.x=game.world.centerX-300
                enemys2[generate11].position.y=-250;
                enemy2Tween[generate11]=game.add.tween(enemys2[generate11]).to({y:destinyY},speed+50,Phaser.Easing.In,true)
                enemys2Active[generate11]=true;
                howMany2++;
                
                enemys2[generate12].alpha=1
                enemys2[generate12].scale.setTo(0.7,0.7)
                enemys2[generate12].position.x=game.world.centerX-400
                enemys2[generate12].position.y=-250;
                enemy2Tween[generate12]=game.add.tween(enemys2[generate12]).to({y:destinyY},speed+50,Phaser.Easing.In,true)
                enemys2Active[generate12]=true;
                howMany2++;
                
                enemys2[generate13].alpha=1
                enemys2[generate13].scale.setTo(0.7,0.7)
                enemys2[generate13].position.x=game.world.centerX-500
                enemys2[generate13].position.y=-250;
                enemy2Tween[generate13]=game.add.tween(enemys2[generate11]).to({y:destinyY},speed+50,Phaser.Easing.In,true)
                enemys2Active[generate13]=true;
                howMany2++;
                
                enemys2[generate14].alpha=1
                enemys2[generate14].scale.setTo(0.7,0.7)
                enemys2[generate14].position.x=game.world.centerX-600
                enemys2[generate14].position.y=-250;
                enemy2Tween[generate14]=game.add.tween(enemys2[generate14]).to({y:destinyY},speed+50,Phaser.Easing.In,true)
                enemys2Active[generate14]=true;
                howMany2++;
                
                enemys2[generate15].alpha=1
                enemys2[generate15].scale.setTo(0.7,0.7)
                enemys2[generate15].position.x=game.world.centerX-700
                enemys2[generate15].position.y=-250;
                enemy2Tween[generate15]=game.add.tween(enemys2[generate15]).to({y:destinyY},speed+50,Phaser.Easing.In,true)
                enemys2Active[generate15]=true;
                howMany2++;
                
                enemys3[generate21].alpha=1
                enemys3[generate21].scale.setTo(0.7,0.7)
                enemys3[generate21].position.x=game.world.centerX+300
                enemys3[generate21].position.y=-250;
                enemy3Tween[generate21]=game.add.tween(enemys3[generate21]).to({y:destinyY},speed+50,Phaser.Easing.In,true)
                enemys3Active[generate21]=true;
                howMany3++;
                
                enemys3[generate22].alpha=1
                enemys3[generate22].scale.setTo(0.7,0.7)
                enemys3[generate22].position.x=game.world.centerX+400
                enemys3[generate22].position.y=-250;
                enemy3Tween[generate22]=game.add.tween(enemys3[generate22]).to({y:destinyY},speed+50,Phaser.Easing.In,true)
                enemys3Active[generate22]=true;
                howMany3++;
                
                
                enemys3[generate23].alpha=1
                enemys3[generate23].scale.setTo(0.7,0.7)
                enemys3[generate23].position.x=game.world.centerX+500
                enemys3[generate23].position.y=-250;
                enemy3Tween[generate23]=game.add.tween(enemys3[generate23]).to({y:destinyY},speed+50,Phaser.Easing.In,true)
                enemys3Active[generate23]=true;
                howMany3++;
                
                
                enemys3[generate24].alpha=1
                enemys3[generate24].scale.setTo(0.7,0.7)
                enemys3[generate24].position.x=game.world.centerX+600
                enemys3[generate24].position.y=-250;
                enemy3Tween[generate24]=game.add.tween(enemys3[generate24]).to({y:destinyY},speed+50,Phaser.Easing.In,true)
                enemys3Active[generate24]=true;
                howMany3++;
                
                enemys3[generate25].alpha=1
                enemys3[generate25].scale.setTo(0.7,0.7)
                enemys3[generate25].position.x=game.world.centerX+700
                enemys3[generate25].position.y=-250;
                enemy3Tween[generate25]=game.add.tween(enemys3[generate25]).to({y:destinyY},speed+50,Phaser.Easing.In,true)
                enemys3Active[generate25]=true;
                howMany3++;
            
                
                
                sound.play("falling")
               
                
            }
        }
    }
    
    
        
    
    //funcion ciclo (tiene otro nombre que no me acuerdo ahorita)
    function generateThem(){
        if(lives>0){
            enemyGenerator(food,activeFood,foodTweens, 10, speed,{destinyY:game.world.height+100}, food2,activeFood2,foodTweens2,food3,activeFood3,foodTweens3); 
            returnGenerate()
        }
    }
    
    function returnGenerate(){
        if(lives>0){
            game.time.events.add(dificulty,function(){
                generateThem()
            })
        }
    }
    
    //funcion para checar si sprites estan colicionando
     function checkOverlap(spriteA, spriteB) {

        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA, boundsB);

    }
    

    function Coin(objectBorn,objectDestiny,time){
        
        
        //objectBorn= Objeto de donde nacen
        coins.x=objectBorn.centerX
        coins.y=objectBorn.centerY
        
        emitter = epicparticles.newEmitter("pickedEnergy")
        emitter.duration=0.05;
        emitter.x = coins.x
        emitter.y = coins.y
        game.add.tween(coins).to({alpha:1}, time, Phaser.Easing.Cubic.In, true,100)
        game.add.tween(coins).to({y:objectBorn.centerY-100},time+500,Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
            game.add.tween(coins).to({x:objectDestiny.centerX,y:objectDestiny.centerY},200,Phaser.Easing.Cubic.InOut,true,time)
            game.add.tween(coins).to({alpha:0}, time+200, Phaser.Easing.Cubic.In, true,200).onComplete.add(function(){
                coins.x=objectBorn.centerX
                coins.y=objectBorn.centerY
                addPoint(1)
            })
        })
    }
  

    
	function update(){
        
        
        if(startGame && lives>0){
            epicparticles.update()
            backG2.tilePosition.y+=10
            backG3.tilePosition.y+=10
            
            characterProxy.position.x=character.x
            characterProxy.position.y=character.y-50
            
            backG1.position.y+=15
            backG12.position.y+=15
            
            if(backG1.position.y>=game.world.height+500){
                backG1.position.y=backG1.height*-0.463
            }
            if(backG12.position.y>=game.world.height+500){
                backG12.position.y=backG12.height*-0.458
            }
            
            if((controles.left.isDown && character.x>100) || (charLeft && character.x>100)){
    
                character.position.x-=10
                character.scale.setTo(-0.7,0.7)
            
            }
            if((controles.right.isDown && character.x<game.world.width-100) || (charRight && character.x<game.world.width-100)){
               character.position.x+=10
               character.scale.setTo(0.7,0.7)
            }   
            
            for(var check=0; check<food.length;check++){
                
                if(checkOverlap(characterProxy,food[check]) && activeFood[check] && lives>0){
                 
                    if(food[check].tag=="healthy"){
                        var temp=check
                        sound.play("eathealthy")
                        activeFood[temp]=false
                        foodTweens[temp].stop()
                        game.add.tween(food[check].scale).to({x:0,y:0},250,Phaser.Easing.linear,true)
                        character.setAnimationByName(0,"WIN",false)
                        game.time.events.add(500,function(){
                            character.setAnimationByName(0,"IDLE",true)
                        })
                        
                        Coin(character,pointsBar,20)
                    }
                    if(food[check].tag=="junk"){
                        var temp2=check
                        sound.play("eatunhealthy")
                        activeFood[temp2]=false
                        foodTweens[temp2].stop()
                        game.add.tween(food[temp2].scale).to({x:0,y:0},250,Phaser.Easing.linear,true)
                        character.setAnimationByName(0,"HIT",false)
                        missPoint()
                        game.time.events.add(500,function(){
                            if(lives>0){
                                character.setAnimationByName(0,"IDLE",true)
                            }else{
                                for(var checkedQuick=0; checkedQuick<food.length;checkedQuick++){
                                    if(foodTweens[checkedQuick]){
                                        foodTweens[checkedQuick].stop()
                                        food[checkedQuick].alpha=0
                                    }
                                }
                                character.setAnimationByName(0,"LOSE",false)
                                game.time.events.add(500,function(){
                                    sound.play("lost")
                                    character.setAnimationByName(0,"LOSESTILL",true)
                                })
                            }
                        })
                        
                        
                    }
                }
            }
            
            for(var checkAll=0; checkAll<10;checkAll++){
                if(food[checkAll].y>game.world.height+50){
                    food[checkAll].x=-200;
                    activeFood[checkAll]=false;
                }
                 if(food2[checkAll].y>game.world.height+50){
                    food2[checkAll].x=-200;
                    activeFood3[checkAll]=false;
                }
                 if(food2[checkAll].y>game.world.height+50){
                    food2[checkAll].x=-200;
                    activeFood3[checkAll]=false;
                }
            }
            if(howMany==10){
                howMany=0
                wall++
                if(dificulty>500){
                    speed-=100
                    dificulty-=100
                }
            }
        }
	}
    
    
    
    
    
	
	function createTextPart(text,obj){
        
        var pointsText = lookParticle('text')
        
        if(pointsText){
            
            pointsText.x = obj.world.x
            pointsText.y = obj.world.y - 60
            pointsText.setText(text)
            pointsText.scale.setTo(1,1)

            game.add.tween(pointsText).to({y:pointsText.y - 75},750,Phaser.Easing.linear,true)
            game.add.tween(pointsText).to({alpha:0},500,Phaser.Easing.linear,true, 250)

            deactivateParticle(pointsText,750)
        }
        
    }
    
    function lookParticle(key){
        
        for(var i = 0;i<particlesGroup.length;i++){
            
            var particle = particlesGroup.children[i]
			//console.log(particle.tag + ' tag,' + particle.used)
            if(!particle.used && particle.tag == key){
                
				particle.used = true
                particle.alpha = 1
                
                particlesGroup.remove(particle)
                particlesUsed.add(particle)
				                
                return particle
                break
            }
        }
        
    }
    
    function deactivateParticle(obj,delay){
        
        game.time.events.add(delay,function(){
            
            obj.used = false
            
            particlesUsed.remove(obj)
            particlesGroup.add(obj)
            
        },this)
    }
    
    function createPart(key){
        var particle = game.add.emitter(0, 0, 100);
        particle.makeParticles('atlas.stomake',key);
        particle.minParticleSpeed.setTo(-200, -50);
        particle.maxParticleSpeed.setTo(200, -100);
        particle.minParticleScale = 0.3;
        particle.maxParticleScale = .8;
        particle.gravity = 150;
        particle.angularDrag = 30;
        particle.setAlpha(1, 0, 2000, Phaser.Easing.Cubic.In)
        return particle
    }
    
    function createParticles(tag,number){
                
        for(var i = 0; i < number;i++){
            
            var particle
            if(tag == 'text'){
                
                var fontStyle = {font: "50px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
                
                var particle = new Phaser.Text(sceneGroup.game, 0, 10, '0', fontStyle)
                particle.setShadow(3, 3, 'rgba(0,0,0,1)', 0);
                particlesGroup.add(particle)
                
            }else{
                var particle = game.add.emitter(0, 0, 100);

				particle.makeParticles('atlas.stomake',tag);
				particle.minParticleSpeed.setTo(-200, -50);
				particle.maxParticleSpeed.setTo(200, -100);
				particle.minParticleScale = 0.6;
				particle.maxParticleScale = 1.5;
				particle.gravity = 150;
				particle.angularDrag = 30;
				
				particlesGroup.add(particle)
				
            }
            
            particle.alpha = 0
            particle.tag = tag
            particle.used = false
            //particle.anchor.setTo(0.5,0.5)
            particle.scale.setTo(1,1)
        }
        
        
    }
	
	function addParticles(){
		
		particlesGroup = game.add.group()
		sceneGroup.add(particlesGroup)
		
		particlesUsed = game.add.group()
		sceneGroup.add(particlesUsed)
		
		createParticles('star',3)
		createParticles('wrong',1)
		createParticles('text',5)
		createParticles('smoke',1)

	}

	function setExplosion(obj){
        
        var posX = obj.x
        var posY = obj.y
        
        if(obj.world){
            posX = obj.world.x
            posY = obj.world.y
        }
        
		var rect = new Phaser.Graphics(game)
        rect.beginFill(0xffffff)
        rect.drawRect(0,0,game.world.width * 2, game.world.height * 2)
        rect.alpha = 0
        rect.endFill()
		sceneGroup.add(rect)
		
		game.add.tween(rect).from({alpha:1},500,"Linear",true)
		
        var exp = sceneGroup.create(0,0,'atlas.stomake','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.stomake','smoke');
        particlesGood.minParticleSpeed.setTo(-200, -50);
        particlesGood.maxParticleSpeed.setTo(200, -100);
        particlesGood.minParticleScale = 0.6;
        particlesGood.maxParticleScale = 1.5;
        particlesGood.gravity = 150;
        particlesGood.angularDrag = 30;

        particlesGood.x = posX;
        particlesGood.y = posY;
        particlesGood.start(true, 1000, null, particlesNumber);

        game.add.tween(particlesGood).to({alpha:0},1000,Phaser.Easing.Cubic.In,true)
        sceneGroup.add(particlesGood)
        
    }
	
	function inputButton(obj){
		
		if(!gameActive){
			return
		}
		
	}
	
	return {
		
		assets: assets,
		name: "stomake",
		update: update,
        preload:preload,
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()
			addParticles()
                        			
            spaceSong = game.add.audio('spaceSong')
            game.sound.setDecodedCallback(spaceSong, function(){
                spaceSong.loopFull(0.6)
            }, this);
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
            
            initialize()
			            
			createPointsBar()
			createHearts()
			
			buttons.getButton(spaceSong,sceneGroup)
            createOverlay()
            
            animateScene()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()