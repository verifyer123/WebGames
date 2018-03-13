
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"
var triOlimpics = function(){
    
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
                name: "atlas.triOlimpics",
                json: "images/triOlimpics/atlas.json",
                image: "images/triOlimpics/atlas.png",
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
				file:"images/triOlimpics/gametuto_%input.png"
			},
            {
				name:'stadium',
				file:"images/triOlimpics/stadium.png"
			},
            {
				name:'grass',
				file:"images/triOlimpics/grass.png"
			},
            {
				name:'glitter',
				file:"images/triOlimpics/glitter.png"
			},

		],
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "cut",
				file: soundsPath + "cut.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrongAnswer.mp3"},
            {	name: "rightChoice",
				file: soundsPath + "rightChoice.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
            {	name: "splash",
				file: soundsPath + "water_splash.mp3"},
            {	name: "throw",
				file: soundsPath + "throw.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {   name: 'spaceSong',
                file: soundsPath + 'songs/childrenbit.mp3'
            }
		],
        spritesheets: [
            {   name: "coin",
                file: "images/spines/coin.png",
                width: 122,
                height: 123,
                frames: 12
            }
        ],
        spines:[
			{
				name:"estrella",
				file:"images/spines/estrella/estrella.json"
			},
            {
				name:"nao",
				file:"images/spines/nao/nao.json"
			},
            {
				name:"paz",
				file:"images/spines/paz/paz.json"
			},
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var gameIndex = 158
    var tutoGroup
    var spaceSong
    var coin
    var speed
    var stadium, grass
    var yogoGroup
    var colliderGroup
    var inputsGroup
    var tracksGroup
    var obstaclesGroup
    var coinsGroup
    var movingGroup
    var states = ['bike', 'swim', 'run']
    var rand
    var actualState
    var trowTime 
    var coinsCount
    var isMoving
    var cursors, isPressedUp, isPressedDown, onChange
    var line 
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        speed = 1
        rand = -1
        actualState = 0
        trowTime = 1800
        coinsCount = 0
        line = 1
        isMoving = false
        isPressedUp = false
        isPressedDown = false
        onChange = false
        
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.triOlimpics','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.triOlimpics','life_box')

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
        
        var back = sceneGroup.create(0, 0, 'atlas.triOlimpics','back')
        back.width = game.world.width
        back.height = 300
        
        stadium = game.add.tileSprite(0, 30, game.world.width, 500, "stadium")
        sceneGroup.add(stadium)
        
        var glitter = sceneGroup.create(game.world.centerX, 0, 'glitter')
        glitter.anchor.setTo(0.5, 0)
        glitter.alpha = 0.3
    }

	function update(){
        
        if(isMoving){
            stadium.tilePosition.x -= speed * 0.3
            grass.tilePosition.x -= speed
        }
        
        if(gameActive){
            
            if(actualState === 1){
                tracksGroup.children[1].children[0].tilePosition.x -= speed
            }
            
            for(var i = 0; i < movingGroup.length; i++){
                
                var object = movingGroup.children[i]
                checkOverlap(object)
                
                if(object.x > - 100){
                    object.x -= speed 
                }
                else if(object !== undefined){
                    object.alpha = 1
                    movingGroup.remove(object)
                    if(object.isGood){
                        coinsGroup.add(object)
                    }
                    else{
                        obstaclesGroup.children[actualState].add(object)
                    }
                }   
            }
            
          
            if (cursors.up.isDown && !isPressedUp && line > 0)
            {
                line--
                changeRow2(line)
                isPressedUp = true
            }
            else if (cursors.down.isDown && !isPressedDown && line < 2)
            {

                    line++
                changeRow2(line)
                isPressedDown = true
            }
            

            if(cursors.up.isUp && isPressedUp)
                isPressedUp = false
            else if(cursors.down.isUp && isPressedDown)
                isPressedDown = false
        }
    }
    
    function checkOverlap(obj) {
        
        var boundsA = obj.getBounds()
        
        
        for(var i = 0; i < colliderGroup.length; i++){
            
            var boundsB = colliderGroup.children[i].getBounds()

            if(Phaser.Rectangle.intersects(boundsA , boundsB ) && inputsGroup.children[i].isActive && !obj.colide){

                obj.colide = true

                if(obj.isGood){
                    obj.alpha = 0
                    addCoin(obj)
                    sound.play('rightChoice')
                    coinsCount++
                    if(coinsCount === 5){
                        gameActive = false
                        sound.play('throw')
                        particleCorrect.x = obj.x 
                        particleCorrect.y = obj.y
                        particleCorrect.start(true, 1200, null, 6)
                        batonPass()
                    }
                }
                else{
                    crash()
                }
            }
        }
    }
    
    function crash(){
        
        missPoint()
        
        if(actualState === 0){
            yogoGroup.children[actualState].setAnimationByName(0, "lose_hit", false)

        }
        else{
            yogoGroup.children[actualState].setAnimationByName(0, "hit", false)
        }

        if(lives !== 0)
            yogoGroup.children[actualState].addAnimationByName(0, "run", true)
        else{
            gameActive = false
            isMoving = false
            yogoGroup.children[actualState].setAnimationByName(0, "lose", true)
            yogoGroup.children[actualState].addAnimationByName(0, "losestill", true)
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
        particle.makeParticles('atlas.triOlimpics',key);
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

				particle.makeParticles('atlas.triOlimpics',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.triOlimpics','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.triOlimpics','smoke');
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
       coin.scale.setTo(0.8)
       coin.animations.add('coin');
       coin.animations.play('coin', 24, true);
       coin.alpha = 0

    }

    function addCoin(objectBorn){
        
        coin.x = objectBorn.centerX
        coin.y = objectBorn.centerY
        time = 300

        game.add.tween(coin).to({alpha:1}, time, Phaser.Easing.linear, true)
        
        game.add.tween(coin).to({y:coin.y - 100}, time + 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
           game.add.tween(coin).to({x: pointsBar.centerX, y:pointsBar.centerY}, 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
               game.add.tween(coin).to({alpha:0}, 200, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
                   addPoint(1)
               })
           })
        })
    }
    
    function greenMile(){
        
        tracksGroup = game.add.group()
        sceneGroup.add(tracksGroup)
        
        for(var i = 0; i < states.length; i++){
            
            var subGroup = game.add.group()
            tracksGroup.add(subGroup)
            
            var track = game.add.tileSprite(9, game.world.centerY - 50, game.world.width * 1.5, 394, 'atlas.triOlimpics', states[i] + "Track")
            subGroup.add(track)
            subGroup.track = track
                 
            var start = subGroup.create(0, game.world.centerY - 50, 'atlas.triOlimpics', states[i] + "Start")
        }
        
        for(var i = 0; i < states.length; i++){
            tracksGroup.children[i].x = game.world.width * 1.5 * i
        }
        
        grass = game.add.tileSprite(0, game.world.height, game.world.width, 150, "grass")
        grass.anchor.setTo(0, 1)
        sceneGroup.add(grass)
    }
    
    function colliders(){
        
        colliderGroup = game.add.group()
        sceneGroup.add(colliderGroup) 
        
        inputsGroup = game.add.group()
        sceneGroup.add(inputsGroup)
        
        for(var i = 0; i < 3; i++){
            
            var col = game.add.graphics(130, game.world.centerY - 40 )
            col.y += i * 116
            col.beginFill(0x0000ff)
            col.drawRect(0, 0, 70, 100 + (i* 9))
            col.alpha = 0
            colliderGroup.add(col)
            
            var inp = game.add.graphics(10, game.world.centerY - 40 )
            inp.y += i * 116
            inp.beginFill(0xff0000)
            inp.drawRect(0, 0, 550, 100 + (i* 9))
            inp.alpha = 0
            inp.inputEnabled = true
            inp.events.onInputDown.add(changeRow ,this)
            inp.isActive = false
            inp.line = i
            inputsGroup.add(inp)
        }
        
        col.y += 10
        inp.y += 10
    }
    
    function dontStopMeNow(){
        
        obstaclesGroup = game.add.group()
        sceneGroup.add(obstaclesGroup)
        
        coinsGroup = game.add.group()
        sceneGroup.add(coinsGroup)
        
        movingGroup = game.add.group()
        sceneGroup.add(movingGroup)
        
        for(var i = 0; i < states.length; i++){
            
            var subGroup = game.add.group()
            obstaclesGroup.add(subGroup)
            
            for(var j = 0; j < 10; j++){
                var obj = subGroup.create(game.world.width + 100, colliderGroup.children[i].centerY, 'atlas.triOlimpics', states[i] + 'Obstacle')
                obj.anchor.setTo(0.5, 0.6)
                obj.scale.setTo(0.7)
                obj.isGood = false
                obj.colide = false
            }
        }
        
        for(var j = 0; j < 10; j++){
            var obj = coinsGroup.create(game.world.width + 100, colliderGroup.children[0].centerY, 'atlas.triOlimpics', 'coins')
            obj.anchor.setTo(0.5, 0.7)
            obj.scale.setTo(0.6)
            obj.isGood = true
            obj.colide = false
        }
    }
    
    function yogotars(){
     
        yogoGroup = game.add.group()
        sceneGroup.add(yogoGroup)
        
        var names = ['paz', 'estrella', 'nao']
        
        for(var i = 0; i < 3; i++){
            
            var anim = game.add.spine(game.world.width + 100, colliderGroup.children[1].centerY + 30, names[i])
            anim.scale.setTo(0.8)
            anim.setAnimationByName(0, "idle", true)
            anim.setSkinByName("normal")
            yogoGroup.add(anim)
        }
        
        yogoGroup.children[0].x = colliderGroup.children[1].centerX - 90 
        yogoGroup.children[0].y = colliderGroup.children[1].centerY + 30
        inputsGroup.children[1].isActive = true
        line =  1
    }
    
    function changeRow(col){
        
        if(gameActive && !col.isActive && !onChange){
            
            sound.play('cut')
            onChange = true
            inputsGroup.setAll('isActive', false)
            game.add.tween(yogoGroup.children[actualState]).to({y: col.centerY + 30}, 200, Phaser.Easing.linear, true).onComplete.add(function(){
                col.isActive = true
                line = col.line
                onChange = false
            })
        }
    }
    
    function changeRow2(num){
        
        if(gameActive && !inputsGroup.children[num].isActive && !onChange){
            
            sound.play('cut')
            onChange = true
            inputsGroup.setAll('isActive', false)
            game.add.tween(yogoGroup.children[actualState]).to({y: inputsGroup.children[num].centerY + 30}, 200, Phaser.Easing.linear, true).onComplete.add(function(){
                line = inputsGroup.children[num].line
                inputsGroup.children[line].isActive = true
                onChange = false
            })
        }
    }
    
    function leaveStartLine(){
        
        isMoving = true
        var delay = 0
        
        if(actualState === 1){
            yogoGroup.children[actualState].setAnimationByName(0, "start", true)
            yogoGroup.children[actualState].addAnimationByName(0, "run", true)
            game.time.events.add(600,function(){
                yogoGroup.children[actualState].y = colliderGroup.children[1].centerY + 30
                sound.play('splash')
            })
            delay = 250
        }
        else{
            yogoGroup.children[actualState].setAnimationByName(0, "run", true)
        }
        
        game.time.events.add(delay,function(){
            game.add.tween(yogoGroup.children[actualState]).to({x: colliderGroup.children[1].centerX - 40}, 1000, Phaser.Easing.linear, true)
            game.add.tween(tracksGroup.children[0]).to({x: -200}, 1000, Phaser.Easing.linear, true).onComplete.add(function(){
                inputsGroup.setAll('isActive', false)
                inputsGroup.children[1].isActive = true
                tracksGroup.children[1].x -= 200
                line = 1
                gameActive = true
                movingGroup.alpha = 1
                addObstacle()
            })
        })
    }
    
    function batonPass(){
        
        coinsCount = 0
        game.add.tween(movingGroup).to({alpha: 0}, 1500, Phaser.Easing.linear, true).onComplete.add(function(){
            
            for(var i = 0; i < movingGroup.length; i++){
                var object = movingGroup.children[i]
                movingGroup.remove(object)
                object.x = game.world.width + 100
                object.alpha = 1
                
                if(object.isGood){
                    coinsGroup.add(object)
                }
                else{
                    obstaclesGroup.children[actualState].add(object)
                }
            }
            
            object = movingGroup.children[0]
            if(object !== undefined){
                movingGroup.remove(object)
                object.x = game.world.width + 100
                object.alpha = 1
                
                if(object.isGood){
                    coinsGroup.add(object)
                }
                else{
                    obstaclesGroup.children[actualState].add(object)
                }
            }

            changeField()
        })
    }
    
    function changeField(){
        
        var obj = actualState
        
        game.time.events.add(2200,function(){
            game.add.tween(yogoGroup.children[obj]).to({x: -200}, 1000, Phaser.Easing.linear, true)
            isMoving = false
        })
        
        if(actualState < 2){
            actualState++
            speed++
            if(trowTime > 400)
                trowTime -= 200
        }
        else{
            actualState = 0
            
        }
        
        var startLine 
        
        if(actualState === 1){
            yogoGroup.children[actualState].y = colliderGroup.children[1].centerY - 20
            yogoGroup.children[actualState].x = tracksGroup.children[1].x + 50
            startLine = 90
        }
        else{
            yogoGroup.children[actualState].y = colliderGroup.children[1].centerY + 30
            yogoGroup.children[actualState].x = tracksGroup.children[1].x + 100
            startLine = 30
        }
        yogoGroup.children[actualState].setAnimationByName(0, "idle", true)
        
        game.add.tween(tracksGroup.children[0]).to({x: -game.world.width * 1.5}, 3000, Phaser.Easing.linear, true)
        game.add.tween(tracksGroup.children[1]).to({x: 0}, 3000, Phaser.Easing.linear, true).onComplete.add(function(){
            tracksGroup.children[2].x = game.world.width * 1.5
            tracksGroup.children[0].x = (game.world.width * 1.5) * 2
            tracksGroup.bringToTop(tracksGroup.children[0]) 
        })
        
        game.add.tween(yogoGroup.children[actualState]).to({x: colliderGroup.children[1].centerX - startLine}, 3000, Phaser.Easing.linear, true).onComplete.add(function(){
            game.time.events.add(300,function(){
                leaveStartLine()
            })
        })
    }
    
    function addObstacle(){
        
        if(gameActive){
            var object
            if(game.rnd.integerInRange(0, 2) !== 2){
                
                object = obstaclesGroup.children[actualState].children[0]
                obstaclesGroup.children[actualState].remove(object)

            }
            else{
                object = coinsGroup.children[0]
                coinsGroup.remove(object)
            }
            
            rand = getRand()
            movingGroup.add(object)
            object.x = game.world.width + 100
            object.y = colliderGroup.children[rand].centerY
            object.colide = false
            
            game.time.events.add(trowTime,function(){
                if(gameActive)
                    addObstacle()
            })
        }
    }
    
    function initGame(){
        
       speed *= 3
        gameActive = true
       
        leaveStartLine()
    }
    
    function getRand(){
        var x = game.rnd.integerInRange(0, 2)
        if(x === rand)
            return getRand()
        else
            return x     
    }
	
	return {
		
		assets: assets,
		name: "triOlimpics",
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
                        			
            /*spaceSong = game.add.audio('spaceSong')
            game.sound.setDecodedCallback(spaceSong, function(){
                spaceSong.loopFull(0.6)
            }, this);*/
            
            initialize()
            spaceSong = sound.play("spaceSong", {loop:true, volume:0.6})
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
            
            cursors = game.input.keyboard.createCursorKeys()
            
            initialize()
			            
			createPointsBar()
			createHearts()
            greenMile()
            colliders()
            dontStopMeNow()
            yogotars()
            initCoin()
            createParticles()
			
			buttons.getButton(spaceSong,sceneGroup)
            createTutorial()
            
            animateScene()
            
		}
	}
}()