
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"

var milkyBar = function(){
    
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
                name: "atlas.time",
                json: "images/milkyBar/timeAtlas.json",
                image: "images/milkyBar/timeAtlas.png",
            },
            {   
                name: "atlas.milkyBar",
                json: "images/milkyBar/atlas.json",
                image: "images/milkyBar/atlas.png",
            },
            {   
                name: "atlas.tutorial",
                json: tutorialPath+"images/tutorial/tutorial_atlas.json",
                image: tutorialPath+"images/tutorial/tutorial_atlas.png"
            }

        ],
        images: [

		],
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "cut",
				file: soundsPath + "cut.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrong.mp3"},
            {	name: "rightChoice",
				file: soundsPath + "rightChoice.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "throw",
                    file: soundsPath + "throw.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {	name: "glassbreak",
				file: soundsPath + "glassbreak.mp3"},
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var gameIndex = 113
    var overlayGroup
    var catSong
    var tweenTiempo
    var time
    var catsGroup
    var ordersGroup
    var barrelsGroup
    var iceCreamGroup
    var containerGroup
    var flavors = ['vanilla', 'choco', 'straw']
    var puzzle = [0,1,2]
    var tableTable
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        tableTable = 0
        time = 10000
    
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.milkyBar','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.milkyBar','life_box')

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
        catSong.stop()
        		
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
        
        game.load.audio('catSong', soundsPath + 'songs/running_game.mp3');
        //game.load.audio('catSong', soundsPath + 'songs/electro_trance_minus.mp3');
        
		/*game.load.image('howTo',"images/milkyBar/how" + localization.getLanguage() + ".png")
		game.load.image('buttonsText',"images/milkyBar/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/milkyBar/introscreen.png")*/
        
		game.load.image('floor',"images/milkyBar/floor.png")
		game.load.image('wall',"images/milkyBar/wall.png")
		game.load.image('wood',"images/milkyBar/wood.png")
        
        game.load.spine("cat", "images/spines/normal.json")
		
		game.load.image('tutorial_image',"images/milkyBar/tutorial_image.png")
        loadType(gameIndex)

        
    }
    
    function createOverlay(){
        
        overlayGroup = game.add.group()
		//overlayGroup.scale.setTo(0.8,0.8)
        sceneGroup.add(overlayGroup)

        createTutorialGif(overlayGroup,onClickPlay)

        
        /*var rect = new Phaser.Graphics(game)
        rect.beginFill(0x000000)
        rect.drawRect(0,0,game.world.width *2, game.world.height *2)
        rect.alpha = 0.7
        rect.endFill()
        rect.inputEnabled = true
        rect.events.onInputDown.add(function(){
            rect.inputEnabled = false
			sound.play("pop")
            
            startGame=true
            game.add.tween(overlayGroup).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){
                
				overlayGroup.y = -game.world.height
                initGame()
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.milkyBar','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.milkyBar',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.milkyBar','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonsText')
		playText.anchor.setTo(0.5,0.5)*/
    }

    function onClickPlay(){
        startGame=true
        overlayGroup.y = -game.world.height
        initGame()
    }

	function createBackground(){
        
        floor = game.add.tileSprite(0, 0, game.world.width * 0.7, game.world.height, "floor")
        sceneGroup.add(floor)    
        
        wall = game.add.tileSprite(0, 0, game.world.width * 0.7, 0, "wall")
        sceneGroup.add(wall)  
        
        wood = game.add.tileSprite(game.world.width * 0.7, 0, game.world.width, game.world.height, "wood")
        sceneGroup.add(wood)  
        
        for(var f = 0; f < flavors.length; f++){
            var mesa = sceneGroup.create(game.world.centerX - 80, game.world.centerY -100, 'atlas.milkyBar', 'table')
            mesa.anchor.setTo(0.5, 0.5)
            //mesa.scale.setTo(1.1)
            mesa.y += 230 * f
        }
    }
    
    function positionTimer(){
        
        var timerGroup = game.add.group()
        timerGroup.scale.setTo(1.5)
        sceneGroup.add(timerGroup)
        
        var clock = game.add.image(0, 0, "atlas.time", "clock")
        clock.scale.setTo(0.7)
        clock.alpha = 1
        timerGroup.add(clock)
        
        timeBar = game.add.image(clock.position.x + 40, clock.position.y + 40, "atlas.time", "bar")
        timeBar.scale.setTo(8, 0.45)
        timeBar.alpha = 1
        timerGroup.add(timeBar)
        
        timerGroup.x = game.world.centerX - clock.width * 0.75
        timerGroup.y = clock.height * 0.5
   }
    
    function stopTimer(){
        
        tweenTiempo.stop()
        tweenTiempo = game.add.tween(timeBar.scale).to({x:8,y:.45}, 100, Phaser.Easing.Linear.Out, true, 100)
   }
    
    function startTimer(time){
        
        tweenTiempo = game.add.tween(timeBar.scale).to({x:0,y:.45}, time, Phaser.Easing.Linear.Out, true, 100)
        tweenTiempo.onComplete.add(function(){
            endGame()
        })
    }

	function update(){
    
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
        particle.makeParticles('atlas.milkyBar',key);
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

				particle.makeParticles('atlas.milkyBar',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.milkyBar','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.milkyBar','smoke');
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
    
    function createParticles(){
        particleCorrect = createPart('star')
        sceneGroup.add(particleCorrect)
        
        particleWrong = createPart('wrong')
        sceneGroup.add(particleWrong)
    }
    
    function thunderCats(){
        
        catsGroup = game.add.group()
        catsGroup.x = game.world.centerX - 230
        catsGroup.y = game.world.centerY - 50
        //barrelsGroup.scale.setTo(0, 0)
        sceneGroup.add(catsGroup)
        
        for(var f = 0; f < flavors.length; f++){
            var cat = game.add.spine(0, 0, "cat")
            //cat.scale.setTo(-1, 1)
            cat.setAnimationByName(0, "IDLE", true)
            cat.setSkinByName("normal"+f)
            cat.y = 230 * f
            catsGroup.add(cat)
        }
    }
    
    function xBox(){
        
        containerGroup = game.add.group()
        sceneGroup.add(containerGroup)
        
        for(var f = 0; f < flavors.length; f++){
            var container = game.add.graphics(game.world.centerX - 155, game.world.centerY - 230)
            container.y += 230 * f
            //container.beginFill(0xFF3300);
            //container.lineStyle(2, 0x0000FF, 1);
            container.drawRect(0, 0, 150, 150)
            container.alpha = 0
            container.flavor = -1
            container.empty = true
            containerGroup.add(container)
        }
    }
    
    function iceAge(){
        
        iceCreamGroup = game.add.group()
        sceneGroup.add(iceCreamGroup)
        
        for(var f = 0; f < flavors.length; f++){
            
            var iceCream = iceCreamGroup.create(game.world.centerX + 90, game.world.centerY - 100, 'atlas.milkyBar', flavors[f]+'Glass')
            iceCream.anchor.setTo(0.5, 0.5)
            iceCream.scale.setTo(1.1)
            iceCream.alpha = 0
            iceCream.y += 230 * f
            iceCream.flavor = f
            iceCream.initPosX = iceCream.x
            iceCream.initPosY = iceCream.y
        }
    }
    
    function DKBarrel(){
        
        barrelsGroup = game.add.group()
        barrelsGroup.x = game.world.centerX + 150
        barrelsGroup.y = game.world.centerY - 200
        sceneGroup.add(barrelsGroup)
        
        for(var f = 0; f < flavors.length; f++){
            var barrel = barrelsGroup.create(0, 0, 'atlas.milkyBar', flavors[f]+'Barrel')
            barrel.anchor.setTo(0.5, 0.5)
            barrel.scale.setTo(1.1)
            barrel.y = 230 * f
            barrel.inputEnabled = true
            barrel.tint = 0x909090
            barrel.events.onInputDown.add(doABarrelRoll,this)
            barrel.flavor = f
        }
    }
	
    function doABarrelRoll(barrel){
        
        if(gameActive){
            sound.play('pop')
            barrel.tint = 0x909090
            barrel.inputEnabled = false
            iceCreamGroup.children[barrel.flavor].alpha = 1
            iceCreamGroup.children[barrel.flavor].x = iceCreamGroup.children[barrel.flavor].initPosX
            iceCreamGroup.children[barrel.flavor].y = iceCreamGroup.children[barrel.flavor].initPosY
            iceCreamGroup.children[barrel.flavor].inputEnabled = true
            iceCreamGroup.children[barrel.flavor].input.enableDrag()
            iceCreamGroup.children[barrel.flavor].events.onDragStop.add(beOurGuest,this)
        }
    }
    
    function order66(){
        
        ordersGroup = game.add.group()
        ordersGroup.x = game.world.centerX - 130
        ordersGroup.y = game.world.centerY - 250
        ordersGroup.scale.setTo(1.3)
        ordersGroup.alpha = 0
        sceneGroup.add(ordersGroup)
    }
    
    function takeOrder(){
        
        Phaser.ArrayUtils.shuffle(puzzle)
        
        for(var f = 0; f < flavors.length; f++){
            
            var order = game.add.group()
            order.y = 180 * f
            order.shake = game.add.tween(order).to({angle:20}, 400, Phaser.Easing.linear, true, 0, -1)
            order.shake.yoyo(true, 400)
            order.grow = game.add.tween(order.scale).to({x:0.8, y:0.8}, 600, Phaser.Easing.linear, true, 0, -1)
            order.grow.yoyo(true, 100)
            ordersGroup.add(order)
            
            var box = order.create(0, 0, 'atlas.milkyBar', 'box')
            box.anchor.setTo(0.5, 0.5)
            
            var flavorImg = order.create(0, -10,  'atlas.milkyBar', flavors[puzzle[f]])
            flavorImg.anchor.setTo(0.5, 0.5)
            flavorImg.scale.setTo(1.1)
        }
    }
    
    function beOurGuest(glass){
                    
        var cont
        var dish = glass.getBounds()
        
        for(var f = 0; f < flavors.length; f++){
            cont = containerGroup.children[f].getBounds()
            
            if(cont.containsRect(dish) && containerGroup.children[f].empty){
                sound.play('pop')
                glass.x = containerGroup.children[f].centerX
                glass.y = containerGroup.children[f].centerY
                glass.inputEnabled = false
                containerGroup.children[f].empty = false
                containerGroup.children[f].flavor = glass.flavor
                tableTable++
                break
            } 
            else{
                //sound.play('cut')
                glass.x = glass.initPosX
                glass.y = glass.initPosY
            }
        }
        
        if(tableTable === flavors.length){
            endGame()
        }
    }
    
    function endGame(){
        
        gameActive = false
        iceCreamGroup.setAll('inputEnabled', false)
        stopTimer()
        
        game.add.tween(ordersGroup).to({alpha:0}, 500, Phaser.Easing.linear, true).onComplete.add(function(){
            ordersGroup.removeAll()
        })
        
        var delay = 600
        var correct = true
        
        for(var f = 0; f < flavors.length; f++){
            if(puzzle[f] === containerGroup.children[f].flavor){
                giveOrTake(delay, f, true)
            }
            else{
                giveOrTake(delay, f, false)
                correct = false
            }
            delay += 700
        }
        
        game.time.events.add(delay,function(){
            if(correct){
                addPoint(1)
                time -= 200
            }
            else{
                missPoint()
            }
        },this)
        
        game.time.events.add(delay + 500,function(){
            if(lives !== 0){
            initGame()
            }
        })
    }
    
    function giveOrTake(timer, f, correct){
        
        game.time.events.add(timer,function(){
            
            if(correct){
                sound.play("rightChoice")
                particleCorrect.x = containerGroup.children[f].centerX
                particleCorrect.y = containerGroup.children[f].centerY
                particleCorrect.start(true, 1200, null, 5)
                catsGroup.children[f].setAnimationByName(0, "WINSTILL", true)
            }
            else{
                particleWrong.x = containerGroup.children[f].centerX
                particleWrong.y = containerGroup.children[f].centerY
                particleWrong.start(true, 1200, null, 5)
                catsGroup.children[f].setAnimationByName(0, "LOSE", false)
                badBoys(containerGroup.children[f].flavor)
            }
            catsGroup.children[f].addAnimationByName(0, "IDLE", true)
        },this)
    }
    
    function badBoys(ice){
        
        if(ice !== -1){
            sound.play("throw")
            game.add.tween(iceCreamGroup.children[ice]).to({x:game.world.width + 50, y:iceCreamGroup.children[ice].y + 50}, 400, Phaser.Easing.linear, true).onComplete.add(function(){
                sound.play('glassbreak')
            })
            game.add.tween(iceCreamGroup.children[ice]).to({angle: 270}, 500, Phaser.Easing.linear, true).onComplete.add(function(){
                iceCreamGroup.children[ice].angle = 0
            })
        }
        else{
            sound.play('wrong')
        }
    }
    
    function initGame(){

        takeOrder()
        iceCreamGroup.setAll('alpha', 0)
        containerGroup.setAll('empty', true)
        containerGroup.setAll('flavor', -1)
        tableTable = 0
        
        game.time.events.add(500,function(){
            sound.play('cut')
            game.add.tween(ordersGroup).to({alpha:1}, 200, Phaser.Easing.linear, true).onComplete.add(function(){
                barrelsGroup.setAll('tint', '0xffffff')
                barrelsGroup.setAll('inputEnabled', true)
                gameActive = true
                startTimer(time)
            })
        })
    }
    
	return {
		
		assets: assets,
		name: "milkyBar",
		//update: update,
        preload:preload,
		create: function(event){
                    
			sceneGroup = game.add.group()
			
			createBackground()
			addParticles()
                        			
            catSong = game.add.audio('catSong')
            game.sound.setDecodedCallback(catSong, function(){
                catSong.loopFull(0.6)
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
            positionTimer()
            thunderCats()
            order66()
            DKBarrel()
            iceAge()
            xBox()
            createParticles()
			
			buttons.getButton(catSong,sceneGroup)
            createOverlay()
            
            animateScene()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()