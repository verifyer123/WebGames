
var soundsPath = "../../shared/minigames/sounds/"
var dino = function(){
    
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
                name: "atlas.dino",
                json: "images/dino/atlas.json",
                image: "images/dino/atlas.png",
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
				file: soundsPath + "wrong.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "drag",
				file: soundsPath + "drag.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
		]
    }
    
        
    var lives = null
	var sceneGroup = null
	var background
    var gameActive
    var gameStarted=false
	var shoot
	var particlesGroup, particlesUsed
    var gameIndex = 109
	var indexGame
    var overlayGroup
    var jungleFun
    var gridGroup
    var rows, columns
    var fossilGroup
    var liveFossilGroup
    var fossilPossition
    var lvl
    var fosilFound
    var fondo
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        gameActive = false
        lives = 3
        rows = 8
        columns = 5
        fossilPossition = -1
        lvl = 2
        fosilFound = 0
        loadSounds()
	}

    function popObject(obj,delay){
         
        game.time.events.add(delay,function(){
            
            sound.play("cut")
            //obj.alpha = 1
            game.add.tween(obj).to({ alpha:1},300,Phaser.Easing.linear,true)
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.dino','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.dino','life_box')

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
        jungleFun.stop()
        		
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
        
        game.load.audio('jungleFun', soundsPath + 'songs/jungle_fun.mp3');
        
		game.load.image('howTo',"images/dino/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/dino/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/dino/introscreen.png")
        
        game.load.spine("oof", "images/spines/explorador.json")
        game.load.spine("fish", "images/spines/pez.json")
        game.load.spine("trex", "images/spines/trex.json")
        game.load.spine("triceratops", "images/spines/triceratops.json")
        game.load.spine("trilobite", "images/spines/trilobite.json")
		
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
            
            //Aqui va la primera funciòn que realizara el juego
            gameStarted=true
            
            startGame=true
            game.add.tween(overlayGroup).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){
                
				overlayGroup.y = -game.world.height
                gameActive = false
                initGame()
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.dino','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'Movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.dino',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.dino','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
        
        fondo = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'atlas.dino', "background")
        sceneGroup.add(fondo)
        
        rocks = game.add.tileSprite(game.world.centerX - 240, game.world.centerY - 270, 460, 735, 'atlas.dino', "rocks")
        sceneGroup.add(rocks)
            
    }

	function update(){
        
        fondo.tilePosition.x += 0.5
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
        particle.makeParticles('atlas.dino',key);
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

				particle.makeParticles('atlas.dino',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.dino','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.dino','smoke');
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
    
    function initOof(){
        
        oofBack =  sceneGroup.create(game.world.centerX, game.world.centerY - 360, "atlas.dino", "explorerBack")
        oofBack.anchor.setTo(0.5)

        oof = game.add.spine(game.world.centerX, game.world.centerY - 300, "oof")
        //oof.scale.setTo(0.8)
        oof.setAnimationByName(0, "IDLE", true)
        oof.setSkinByName("normal")
        sceneGroup.add(oof)
        
    }
	
    function initGrid(){
        
        gridGroup = game.add.group()
        gridGroup.scale.setTo(0.96)
        sceneGroup.add(gridGroup)
        
        gridGroup.coordinates = new Array(rows)
        for (var i = 0; i < rows; i++) {
            gridGroup.coordinates[i] = new Array(columns)
        }

        for(var j = 0; j < rows; j++){
            for(var i = 0; i < columns; i++){
                
                var grid =  gridGroup.create(0, 0, "atlas.dino", "grid")
                grid.anchor.setTo(0.5)
                grid.x = game.world.centerX + grid.width * i - 190
                grid.y = game.world.centerY + grid.height * j - 215
                grid.empty = true
                grid.isClose = false
                grid.column = i
                grid.row = j
                grid.inputEnabled = true
                grid.events.onInputDown.add(inputButton)
                gridGroup.coordinates[i][j] = grid
            }
        }
    }
    
    function inputButton(obj){
		
		if(fosilFound < lvl && gameActive){
            
            if(!obj.empty){
                breakingBad(obj)
            }
            else{
                if(obj.isClose){
                    sound.play('drag')
                    blink()
                }
                else{
                    blink()
                    oof.setAnimationByName(0, "LOSE", true)
                    oof.addAnimationByName(0, "IDLE", true)
                    missPoint()
                    particleWrong.x = obj.x
                    particleWrong.y = obj.y
                    particleWrong.start(true, 1200, null, 6)
                }
            }
            
            if(fosilFound === lvl){
                gameActive = false
                oof.setAnimationByName(0, "WIN", true)
                oof.addAnimationByName(0, "IDLE", true)
                if(lvl < 6)
                    lvl++
                game.time.events.add(1600,function(){
                    initGame()
                },this)
            }
		}
	}
    
    function checkneighbor(block){
        
        for(var j = -1; j < 2; j++){
            for(var i = -1; i < 2; i++){
                
                c = block.column + i
                r = block.row + j 
                
                if (r >= 0 && r < rows && c >= 0 && c < columns && gridGroup.coordinates[c][r].empty) {
                    
                }
            }
        }
    }
    
    function blink(){
        
        for(var f = 0; f < lvl; f++){
            if(!fossilGroup.children[f].found)
                showHint(fossilGroup.children[f])
        }
    }
    
    function showHint(foss){
        game.add.tween(foss).to({alpha: 1}, 200, Phaser.Easing.linear, true).onComplete.add(function(){
            game.add.tween(foss).to({alpha: 0}, 200, Phaser.Easing.linear, true)
        })
    }
    
    function breakingBad(foss){
        
        for(var f = 0; f < lvl; f++){
            if(fossilGroup.children[f].x === foss.x && fossilGroup.children[f].y === foss.y){
                game.add.tween(fossilGroup.children[f]).to({alpha: 1}, 500, Phaser.Easing.linear, true)
                if(!fossilGroup.children[f].found){
                    fossilGroup.children[f].found = true
                    oof.setAnimationByName(0, "WIN", true)
                    oof.addAnimationByName(0, "IDLE", true)
                    fosilFound++
                    addPoint(1)
                    animateFossil(f)
                    particleCorrect.x = fossilGroup.children[f].x
                    particleCorrect.y = fossilGroup.children[f].y
                    particleCorrect.start(true, 1200, null, 6)
                    createTextPart('+1',fossilGroup.children[f])
                }
                break
            }
        }
    }
    
    function initFossil(){
        
        fossilGroup = game.add.group()
        //fossilGroup.scale.setTo(0.8)
        gridGroup.add(fossilGroup)
        
        for(var f = 0; f < 6; f++){
            
            var fossil = game.add.group()
            fossil.create(0, 0, "atlas.dino", ""+(f+1)).anchor.setTo(0.5)
            fossil.scale.setTo(0.8)
            fossil.found = false
            fossilGroup.add(fossil)
        }
        fossilGroup.setAll('alpha',0)
    }
    
    function initLiveFossil(){
        
        liveFossilGroup = game.add.group()
        liveFossilGroup.x = game.world.width + 200
        liveFossilGroup.y = game.world.centerY
        //liveFossilGroup.scale.setTo(0.96)
        sceneGroup.add(liveFossilGroup)
        
        triceratops = game.add.spine(0, 0, "triceratops")
        triceratops.setAnimationByName(0, "IDLE", true)
        triceratops.setSkinByName("normal")
        triceratops.alpha = 0
        liveFossilGroup.add(triceratops)
        
        fish = game.add.spine(0, 0, "fish")
        fish.setAnimationByName(0, "IDLE", true)
        fish.setSkinByName("normal")
        fish.alpha = 0
        liveFossilGroup.add(fish)
        
        trex = game.add.spine(0, 0, "trex")
        trex.setAnimationByName(0, "IDLE", true)
        trex.setSkinByName("normal")
        trex.alpha = 0
        liveFossilGroup.add(trex)
        
        trilobite = game.add.spine(0, 0, "trilobite")
        trilobite.setAnimationByName(0, "IDLE", true)
        trilobite.setSkinByName("normal")
        trilobite.alpha = 0
        liveFossilGroup.add(trilobite)
        
        flower = liveFossilGroup.create(0, 0, 'atlas.dino', 'flower')
        flower.alpha = 0
        flower.scale.setTo(2)
        
        plant = liveFossilGroup.create(0, 0, 'atlas.dino', 'plant')
        plant.alpha = 0
        plant.angle = 45
        plant.scale.setTo(2)
    }
    
    function initGame(){
        
        fossilGroup.setAll('found',false)
        fossilGroup.setAll('alpha',0)
        gridGroup.setAll('empty', true)
        gridGroup.setAll('isClose', false)
        fosilFound = 0
        delay = 300
        gameActive = false
        for(var f = 0; f < lvl; f++){
            fossilPossition = getRand()
            fossilGroup.children[f].x = gridGroup.children[fossilPossition].x 
            fossilGroup.children[f].y = gridGroup.children[fossilPossition].y
            gridGroup.children[fossilPossition].empty = false
            neighborhood(gridGroup.children[fossilPossition])
            popObject(fossilGroup.children[f], delay)
            delay += 300
        }
        game.time.events.add(delay+300,function(){
            fossilGroup.setAll('alpha',0)
            gameActive = true
        },this)
    }
    
    function neighborhood(block){
        
        for(var j = -1; j < 2; j++){
            for(var i = -1; i < 2; i++){
                
                c = block.column + i
                r = block.row + j 
                
                if (r >= 0 && r < rows && c >= 0 && c < columns && gridGroup.coordinates[c][r].empty) {
                    //gridGroup.coordinates[c][r].tint = 0x3333ff
                    gridGroup.coordinates[c][r].isClose = true
                }
            }
        }
        
        /*for(var r = 0; r < gridGroup.length; r ++){
            if(!gridGroup.children[r].empty){
                gridGroup.children[r].tint = 0xff3333
            }
        }*/
    }
    
    function animateFossil(index){
        
        gameActive = false
        
        changeImage(index, liveFossilGroup)
        animateScene()
        game.add.tween(liveFossilGroup.children[index]).to({x: -1200}, 1500, Phaser.Easing.linear, true).onComplete.add(function(){
            liveFossilGroup.children[index].x = liveFossilGroup.x
            liveFossilGroup.children[index].alpha = 0
                gameActive = true
        })
    }
    
    function getRand(){
        var x = game.rnd.integerInRange(0, 39)
        if(x !== fossilPossition && gridGroup.children[x].empty){
            return x
        }
        else
            return getRand()     
    }
    
    function createParticles(){
        particleCorrect = createPart('star')
        sceneGroup.add(particleCorrect)
        
        particleWrong = createPart('wrong')
        sceneGroup.add(particleWrong)
    }

	return {
		
		assets: assets,
		name: "dino",
		update: update,
        preload:preload,
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()
			addParticles()
                        			
            jungleFun = game.add.audio('jungleFun')
            game.sound.setDecodedCallback(jungleFun, function(){
                jungleFun.loopFull(0.6)
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
            initOof()
            initGrid()
            initFossil()
            initLiveFossil()
            createParticles()
			
			buttons.getButton(jungleFun,sceneGroup)
            createOverlay()
            
            animateScene()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()