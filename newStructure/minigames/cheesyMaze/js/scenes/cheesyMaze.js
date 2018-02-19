
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"
var cheesyMaze = function(){
    
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
                name: "atlas.cheesyMaze",
                json: "images/cheesyMaze/atlas.json",
                image: "images/cheesyMaze/atlas.png",
            },
            {   
                name: "atlas.tutorial",
                json: tutorialPath+"images/tutorial/tutorial_atlas.json",
                image: tutorialPath+"images/tutorial/tutorial_atlas.png"
            }
        ],
        images: [
            {
				name:'tutorial_image',
				file:"images/cheesyMaze/gametuto.png"
			}

		],
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "squeeze",
				file: soundsPath + "squeeze.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrongAnswer.mp3"},
            {	name: "rightChoice",
				file: soundsPath + "rightChoice.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {	name: "falling",
				file: soundsPath + "falling.mp3"},
            {   name: 'cheesySong',
                file: soundsPath + 'songs/classic_arcade.mp3'
            }
		],
        spritesheets: [
            {   name: "coin",
                file: "images/spines/coin.png",
                width: 122,
                height: 123,
                frames: 12
            },
            {   name: "cheesy",
                file: "images/spines/cheesy.png",
                width: 154,
                height: 318,
                frames: 23
                //fps 24
            }
        ],
        spines:[
			{
				name:"mouse",
				file:"images/spines/mouse.json"
			}
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var gameIndex = 148
    var tutoGroup
    var cheesySong
    var coin
    var tile
    var cheesy
    var mouse
    var click
    var speed
    var wallsGroup, holesGroup, fakeGroup
    var rows
    var throwTimer
    var row
    var rand
    var counter
    var moveSpeed
    var leveler

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        click = false
        speed = 3
        row = -1
        rand = -1
        throwTimer = 2000
        moveSpeed = 250
        counter = 0
        rows = [game.world.centerX * 0.4, game.world.centerX, game.world.centerX * 1.6]
        
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.cheesyMaze','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.cheesyMaze','life_box')

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
        cheesySong.stop()
        		
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1300)
		tweenScene.onComplete.add(function(){
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)

			//amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
		})
    }
    
    function preload(){
        
		//buttons.getImages(game)
		
        game.stage.disableVisibilityChange = false
        
        //loadType(gameIndex)
    }
    
    function createTutorial(){
        
        tutoGroup = game.add.group()
        sceneGroup.add(tutoGroup)

        tutorialHelper.createTutorialGif(tutoGroup,onClickPlay)
    }
    
    function onClickPlay() {
        tutoGroup.y = -game.world.height
        initGame()
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
        
        tile = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'atlas.cheesyMaze', "tile")
        sceneGroup.add(tile)
    }

	function update(){
        
        if(gameActive){
            
            mouse.spine.x = mouse.movil.x
            mouse.collider.x = mouse.movil.x
            tile.tilePosition.y -= speed

            if (click){
                game.physics.arcade.moveToPointer(mouse.movil, moveSpeed)

                if (Phaser.Rectangle.contains(mouse.movil.body, game.input.x, game.input.y))
                {
                    mouse.movil.body.velocity.setTo(0, 0)
                }
            }
            else{
                game.physics.arcade.moveToObject(mouse.movil, cheesy, moveSpeed)

                if (Phaser.Rectangle.intersects(mouse.movil, cheesy))
                {
                    game.add.tween(mouse.movil).to({x:cheesy.centerX}, moveSpeed, Phaser.Easing.linear, true)
                    mouse.movil.body.velocity.setTo(0, 0)
                }
            }
            
            for(var f = 0; f < wallsGroup.length; f++){
                if(wallsGroup.children[f].isActive){
                    if(wallsGroup.children[f].y > - 200){
                        wallsGroup.children[f].y -= speed 
                    }
                    else if(wallsGroup.children[f] !== undefined){
                        wallsGroup.children[f].isActive = false
                        wallsGroup.children[f].y = game.world.height
                    }   
                    
                    if(wallsGroup.children[f].y < mouse.collider.y - 10){
                        wallsGroup.children[f].crash = true
                        wallsGroup.children[f].alpha = 0 
                    }
                }
                
                if(fakeGroup.children[f].isActive){
                    if(fakeGroup.children[f].y > - 200){
                        fakeGroup.children[f].y -= speed 
                    }
                    else if(fakeGroup.children[f] !== undefined){
                        fakeGroup.children[f].isActive = false
                        fakeGroup.children[f].y = game.world.height
                    }   
                    
                    if(fakeGroup.children[f].y < mouse.collider.y - 10){
                        fakeGroup.children[f].alpha = 1
                    }
                }
                
                if(holesGroup.children[f].isActive){
                    if(holesGroup.children[f].y > - 200){
                        holesGroup.children[f].y -= speed 
                    }
                    else if(holesGroup.children[f] !== undefined){
                        holesGroup.children[f].isActive = false
                        holesGroup.children[f].y = game.world.height
                    }   
                    
                    if(holesGroup.children[f].y < mouse.collider.y){
                        holesGroup.children[f].crash = true
                    }
                }
            }
        
            game.physics.arcade.overlap(mouse.collider, wallsGroup, mouseVSwall, null, this)
            game.physics.arcade.overlap(mouse.collider, holesGroup, mouseVShole, null, this)
            
            if(leveler.isActive){
                checkOverlap()
                if(leveler.y > - 200){
                    leveler.y -= speed 
                }
                else if(leveler !== undefined){
                    leveler.isActive = false
                    leveler.y = game.world.height
                }   
            }
        }
    }
    
    function mouseVSwall(mouseColl, obst){
            
        if(!obst.crash){
            gameActive = false
            click = false
            obst.crash = true
            sound.play('squeeze')
            mouse.spine.setAnimationByName(0, "LOSE", false)
            mouse.spine.addAnimationByName(0, "STUN", true)
            missPoint()
            mouse.movil.body.velocity.setTo(0, 0)
            
            for(var f = 0; f < wallsGroup.length; f++){
                if(wallsGroup.children[f].isActive){
                    game.add.tween(wallsGroup.children[f]).to({y: wallsGroup.children[f].y + 100},500,Phaser.Easing.Cubic.Out,true)
                }
                if(fakeGroup.children[f].isActive){
                    game.add.tween(fakeGroup.children[f]).to({y: fakeGroup.children[f].y + 100},500,Phaser.Easing.Cubic.Out,true)
                }
                if(holesGroup.children[f].isActive){
                    game.add.tween(holesGroup.children[f]).to({y: holesGroup.children[f].y + 100},500,Phaser.Easing.Cubic.Out,true)
                }
            }
            game.add.tween(tile.tilePosition).to({y: tile.tilePosition.y + 100},500,Phaser.Easing.Cubic.Out,true).onComplete.add(function(){
                
                for(var f = 0; f < wallsGroup.length; f++){
                    if(wallsGroup.children[f].y >= game.world.height){
                        wallsGroup.children[f].isActive = false
                    }
                    if(fakeGroup.children[f].y >= game.world.height){
                        fakeGroup.children[f].isActive = false
                    }
                    if(holesGroup.children[f].y >= game.world.height){
                        holesGroup.children[f].isActive = false
                    }
                }
            })
            
            game.time.events.add(2010,function(){
                if(lives !== 0)
                  initGame()
            },this)
        }
    }
    
    function mouseVShole(mouseColl, obst){
        
        if(!obst.crash){
            obst.crash = true
            gameActive = false
            click = false
            sound.play('falling')
            mouse.spine.setAnimationByName(0, "FALLING", true)
            missPoint()
            mouse.movil.body.velocity.setTo(0, 0)
            
            if(lives !== 0){
                game.add.tween(mouse.spine).to({x: obst.centerX, y:obst.centerY - 10},500,Phaser.Easing.Cubic.Out,true)
                game.add.tween(mouse.spine.scale).to({x: 0, y: 0},1000,Phaser.Easing.Cubic.Out,true).onComplete.add(function(){

                    for(var f = 0; f < wallsGroup.length; f++){
                        if(wallsGroup.children[f].isActive){
                            game.add.tween(wallsGroup.children[f]).to({y: wallsGroup.children[f].y - 200},500,Phaser.Easing.linear,true)
                        }
                        if(fakeGroup.children[f].isActive){
                            game.add.tween(fakeGroup.children[f]).to({y: fakeGroup.children[f].y - 200},500,Phaser.Easing.linear,true)
                        }
                        if(holesGroup.children[f].isActive){
                            game.add.tween(holesGroup.children[f]).to({y: holesGroup.children[f].y - 200},500,Phaser.Easing.linear,true)
                        }
                    }
                    game.add.tween(tile.tilePosition).to({y: tile.tilePosition.y - 200},500,Phaser.Easing.linear,true).onComplete.add(function(){

                        mouse.spine.scale.setTo(1)
                        mouse.spine.x = game.world.centerX
                        mouse.spine.setAnimationByName(0, "WALK", true)
                        game.add.tween(mouse.spine).from({y: -10}, 2000,Phaser.Easing.Cubic.Out,true).onComplete.add(function(){
                            mouse.spine.setAnimationByName(0, "EAT", true)
                            mouse.movil.x = game.world.centerX
                            if(lives !== 0)
                              initGame()
                        })
                    })
                })
            }
        }
    }
    
    function checkOverlap(){

        if(Phaser.Rectangle.intersects(leveler.getBounds(), mouse.collider.getBounds())){
            leveler.isActive = false
            leveler.y = game.world.height
            counter = 0
            speed += 0.5
            throwTimer *= 0.9
            moveSpeed += 25
            addCoin()
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
        particle.makeParticles('atlas.cheesyMaze',key);
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

				particle.makeParticles('atlas.cheesyMaze',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.cheesyMaze','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.cheesyMaze','smoke');
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
        
        particleWrong = createPart('smoke')
        sceneGroup.add(particleWrong)
    }
	
	function initCoin(){
        
       coin = game.add.sprite(0, 0, "coin")
       coin.anchor.setTo(0.5)
       //coin.scale.setTo(0.5)
       coin.animations.add('coin');
       coin.animations.play('coin', 24, true);
       coin.alpha = 0

    }

    function addCoin(){
        
        coin.x = game.world.centerX
        coin.y = game.world.centerY
        var timer = 300

        game.add.tween(coin).to({alpha:1}, timer, Phaser.Easing.linear, true)
        
        game.add.tween(coin).to({y:coin.y - 100}, timer + 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
           game.add.tween(coin).to({x: pointsBar.centerX, y:pointsBar.centerY}, 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
               game.add.tween(coin).to({alpha:0}, 200, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
                   addPoint(1)
               })
           })
        })
    }
    
    function cowboyMouse(){
        
        mouse = game.add.group()
        sceneGroup.add(mouse)
        
        var spine = game.add.spine(game.world.centerX, 260, "mouse")
        spine.setAnimationByName(0, "EAT", true)
        spine.setSkinByName("normal")
        mouse.add(spine)
        mouse.spine = spine
        
        var movil = mouse.create(game.world.centerX, 260, 'atlas.cheesyMaze', 'star')
        movil.anchor.setTo(0.5)
        movil.alpha = 0
        game.physics.enable(movil, Phaser.Physics.ARCADE)
        mouse.movil = movil
        
        var collider = mouse.create(game.world.centerX, 200, 'atlas.cheesyMaze', 'star')
        collider.anchor.setTo(0.5)
        collider.alpha = 0
        collider.scale.setTo(0.5)
        game.physics.arcade.enable(collider)
        mouse.collider = collider
    }
    
    function fromage(){
        
        cheesy = game.add.sprite(game.world.centerX, game.world.centerY, "cheesy")
        cheesy.anchor.setTo(0.5)
        cheesy.animations.add('cheesy')
        cheesy.animations.play('cheesy', 24, true)
        cheesy.inputEnabled = true
        cheesy.input.enableDrag()
        cheesy.events.onDragStart.add(dragTheCheese,this)
        cheesy.events.onDragStop.add(relaseTheCheese,this)
        sceneGroup.add(cheesy)
    }
    
    function dragTheCheese(){
        
        if(gameActive){
            click = true
        }
    }
    
    function relaseTheCheese(){
        
        click = false
    }
    
    function theWalls(){
        
        wallsGroup = game.add.group()
        wallsGroup.enableBody = true
        wallsGroup.physicsBodyType = Phaser.Physics.ARCADE
        sceneGroup.add(wallsGroup)
        
        for(var w = 0; w < 10; w++){
            
            var wall = wallsGroup.create(0, game.world.height, 'atlas.cheesyMaze', 'wall')
            wall.anchor.setTo(0.5, 0)
            wall.scale.setTo(0.7)
            wall.isActive = false
            wall.crash = false
        }
    }
    
    function theHoles(){
        
        holesGroup = game.add.group()
        holesGroup.enableBody = true
        holesGroup.physicsBodyType = Phaser.Physics.ARCADE
        sceneGroup.add(holesGroup)
        
        for(var w = 0; w < 10; w++){

            var hole = holesGroup.create(0, game.world.height, 'atlas.cheesyMaze', 'hole')      
            hole.anchor.setTo(0.5, 0)
            hole.scale.setTo(0.7)
            hole.isActive = false
            hole.crash = false
        }
    }
    
    function theFake(){
        
        fakeGroup = game.add.group()
        sceneGroup.add(fakeGroup)
        
        for(var w = 0; w < 10; w++){
            
            var obstacle = fakeGroup.create(0, game.world.height, 'atlas.cheesyMaze', 'wall')
            obstacle.anchor.setTo(0.5, 0)
            obstacle.scale.setTo(0.7)
            obstacle.isActive = false
        }
        
        leveler = sceneGroup.create(0,game.world.height, 'atlas.cheesyMaze', 'wall')
        leveler.anchor.setTo(0.5, 0)
        leveler.scale.setTo(0.7)
        leveler.alpha = 0
        leveler.isActive = false
    }
    
    function letItRoll(){
        
        var obj 
        var otherWall
                
        if(game.rnd.integerInRange(0, 1) === 0){
            obj = wallsGroup
            otherWall = true
        }
        else{
            obj = holesGroup
            otherWall = false
        }    
        
        rand = getFree(obj)
        row = getRand(row, 2)
        
        game.time.events.add(throwTimer,function(){

            obj.children[rand].isActive = true
            obj.children[rand].alpha = 1
            obj.children[rand].crash = false
            obj.children[rand].x = rows[row]
            counter++

            if(otherWall){
                fakeGroup.children[rand].isActive = true
                fakeGroup.children[rand].x = rows[row]
                fakeGroup.children[rand].alpha = 0
            }
            
            if(gameActive){
                if(counter % 5 == 0){
                    rollThree()
                }
                else{
                    letItRoll()
                }
            }
        }, this)
    }
    
    function rollThree(r){
        
        var obj 
        var otherWall
        var freObj
        
        if(game.rnd.integerInRange(0, 1) === 0){
            obj = wallsGroup
            otherWall = true
        }
        else{
            obj = holesGroup
            otherWall = false
        }    
        
        row = getRand(row, 2)
        
        game.time.events.add(throwTimer,function(){
            
            for(var t = 0; t < 3; t++){
                
                freObj = getFree(obj)
                
                if(t !== row){
                    
                    obj.children[freObj].isActive = true
                    obj.children[freObj].alpha = 1
                    obj.children[freObj].crash = false
                    obj.children[freObj].x = rows[t]

                    if(otherWall){
                        fakeGroup.children[freObj].isActive = true
                        fakeGroup.children[freObj].x = rows[t]
                        fakeGroup.children[freObj].alpha = 0
                    }
                }
                else{
                    leveler.isActive = true
                    leveler.x = rows[t]
                    leveler.y = game.world.height
                }
            }
            
            if(gameActive){
                letItRoll()
            }
        },this)
    }
    
    function getFree(obj){
        
        for(var t = 0; t < obj.length; t++){
            if(!obj.children[t].isActive){
                return t
            }
            
        }
    }
    
    function initGame(){
        
        counter = 0
        
        game.time.events.add(1000,function(){
            gameActive = true
            mouse.spine.setAnimationByName(0, "WALK", true)
            letItRoll()
        }, this)
    }
    
    function getRand(rnd, limit){
        var x = game.rnd.integerInRange(0, limit)
        if(x === rnd)
            return getRand(rnd, limit)
        else
            return x     
    }
	
	return {
		
		assets: assets,
		name: "cheesyMaze",
		update: update,
        preload:preload,
        getGameData:function () {
			var games = yogomeGames.getGames()
			return games[gameIndex]
		},
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()
			addParticles()
                        			
            /*cheesySong = game.add.audio('cheesySong')
            game.sound.setDecodedCallback(cheesySong, function(){
                cheesySong.loopFull(0.6)
            }, this);*/
            
            initialize()
            cheesySong = sound.play("cheesySong", {loop:true, volume:0.6})
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
            
            initialize()
			            
            initCoin()
            theHoles()
            theFake()
            cowboyMouse()
            theWalls()
            createPointsBar()
			createHearts()
            fromage()
            createParticles()
			
			buttons.getButton(cheesySong,sceneGroup)
            createTutorial()
            
            animateScene()
            
		}
	}
}()