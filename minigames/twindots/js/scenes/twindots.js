var soundsPath = "../../shared/minigames/sounds/"
var twindots = function(){    

	assets = {
        atlases: [
            {   
                name: "atlas.twin",
                json: "images/twindots/atlas.json",
                image: "images/twindots/atlas.png",
            },
        ],
        images: [
            {   name:"fondo",
				file: "images/twindots/background.png"},
		],
		sounds: [
            {	name: "explode",
				file: soundsPath + "laserexplode.mp3"},
            {	name: "cut",
				file: soundsPath + "cut.mp3"},
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "flipCard",
				file: soundsPath + "gear.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            
		],
	}
        
    var SPEED = 4
    var COLORS = [0xffff00,0x29abe2,0x4400ff,0xe229a4,0xff5d00,0x96e229]
    
    var gameIndex = 12
    var cursors
    var pressLeft, pressRight
    var upLeft, upRight
    var gameSong = null
    var levelNumber = 0
    var gameSpeed = null
    var timeBar = null
    var lastObj
	var sceneGroup = null
    var containersGroup
    var gameActive = true
    var pointsBar = null
    var lives = null
    var heartsGroup = null
    var obstaclesGroup = null
    var particlesGroup, particlesUsed

	function loadSounds(){
		sound.decode(assets.sounds)
	}
    
    function getColors(){
        
        var index = game.rnd.integerInRange(1,COLORS.length) - 1
        var index2 = index
        
        while(index == index2){
            index2 = game.rnd.integerInRange(1,COLORS.length) - 1
        }
        
        colorsUsed = [COLORS[index],COLORS[index2]]
    }

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        gameActive = true
        lives = 1
        colorsUsed = []
        getColors()
        gameSpeed = SPEED
        loadSounds()
        levelNumber = 1
        pressLeft = false
        pressRight = false
        upLeft = false
        upRight = false
        
	}
    
    function animateScene() {
                
        gameActive = false
        
        var startGroup = new Phaser.Group(game)
        sceneGroup.add(startGroup)

        gameActive = true
        sceneGroup.alpha = 0
        
        var sceneTween = game.add.tween(sceneGroup).to({alpha:1},500,Phaser.Easing.linear,true)
        
        sceneTween.onComplete.add(function(){
            
            setLevel(levelNumber)
            
            game.time.events.add(500,sendCircles,this)
        })

    }
    
    function changeImage(index,group){
        for (var i = 0;i< group.length; i ++){
            group.children[i].alpha = 0
            if( i == index){
                group.children[i].alpha = 1
            }
        }
    }  
    
    function setExplosion(obj,offsetY){
        
        var offY = offsetY || 0
        
        var posX = obj.x
        var posY = obj.y
        
        if(obj.world){
            posX = obj.world.x
            posY = obj.world.y
        }
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.twin','smoke');
        particlesGood.minParticleSpeed.setTo(-200, -50);
        particlesGood.maxParticleSpeed.setTo(200, -100);
        particlesGood.minParticleScale = 0.6;
        particlesGood.maxParticleScale = 1.5;
        particlesGood.gravity = 150;
        particlesGood.angularDrag = 30;

        particlesGood.x = posX;
        particlesGood.y = posY + offsetY;
        particlesGood.start(true, 1000, null, particlesNumber);

        game.add.tween(particlesGood).to({alpha:0},1000,Phaser.Easing.Cubic.In,true)
        sceneGroup.add(particlesGood)
        
    }
    
    function stopGame(){
        
		if(amazing.getMinigameId()){
			gameSong.pause()
		}else{
			gameSong.stop()
		}
        
        gameActive = false
		
		sound.play("gameLose")
        
        lives--
        heartsGroup.text.setText('X ' +lives)
        
        for(var i = 0; i < obstaclesGroup.length;i++){
            obstaclesGroup.children[i].alpha = 0
        }
        
        sound.play("explode")
            
        //timer.pause()
        
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 2000)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true,pointsBar.number,gameIndex)

			//amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
		})
        
    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(10,10,'atlas.twin','xpcoins')
    
        var fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, "0", fontStyle)
        pointsText.x = pointsImg.x + pointsImg.width * 0.9
        pointsText.y = pointsImg.height * 0.3
        pointsText.anchor.setTo(1,0)
        pointsBar.add(pointsText)
        
        pointsBar.text = pointsText
        pointsBar.number = 0
        
    }
    
    function createHearts(){
        
        heartsGroup = game.add.group()
        heartsGroup.x = game.world.width - 20
        heartsGroup.y = 10
        sceneGroup.add(heartsGroup)
        
        
        var pivotX = 15
        var group = game.add.group()
        group.x = pivotX
        heartsGroup.add(group)

        var heartsImg = group.create(0,0,'atlas.twin','life_box')
        heartsImg.anchor.setTo(1,0)
        
        var fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 10, "0", fontStyle)
        pointsText.x = -heartsImg.width * 0.38
        pointsText.y = 2
        pointsText.setText('X ' + lives)
        heartsGroup.add(pointsText)
        
        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
        
        heartsGroup.text = pointsText
                
    }
    
    function addNumberPart(obj,number,isScore){
        
        var pointsText = lookParticle('textPart')
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
        }
        
        game.add.tween(pointsText).to({y:pointsText.y + 100},800,Phaser.Easing.linear,true)
        game.add.tween(pointsText).to({alpha:0},250,Phaser.Easing.linear,true,500)
        
    }
    
    function addLevel(){
        
        levelNumber++
        setLevel(levelNumber)
        gameSpeed+=1.1
        
        getColors()
        colorContainers()
        
    }
    
    function addPoint(obj){
        
        sound.play("magic")
        
        createPart('ring',obj)
        addNumberPart(pointsBar.text,'+2',true)
        
        pointsBar.number++
        pointsBar.text.setText(pointsBar.number)
        
        if(pointsBar.number % 10 == 0){
            addLevel()
        }
        
    }
    
    function rotateGears(tag){
        
        var container = containersGroup.children[tag]
        sound.play("flipCard")
        
        var angleAdd = 180
        if(tag == 1){angleAdd*=-1}
        
        game.add.tween(container).to({angle:container.angle + angleAdd},100,Phaser.Easing.linear,true).onComplete.add(function(){
            
            if(tag == 0){
                pressLeft = false
            }else{
                pressRight = false
            }
        })
    }
    
    function inputButton(obj){
        
        if(!obj.active || !gameActive){
            return
        }
        
        sound.play("flipCard")
        obj.active = false
        var container = containersGroup.children[obj.tag]
        
        var angleAdd = 180
        if(obj.tag == 1){angleAdd*=-1}
        
        game.add.tween(container).to({angle:container.angle + angleAdd},100,Phaser.Easing.linear,true).onComplete.add(function(){
            obj.active = true
        })
        
        changeImage(1,obj.parent)
    }
    
    function releaseButton(obj){
        changeImage(0,obj.parent)
    }
    
    function createControls(){
            
        var bottomRect = sceneGroup.create(0,game.world.height,'atlas.twin','dashboard')
        bottomRect.anchor.setTo(0,1)
        bottomRect.width = game.world.width
        sceneGroup.add(bottomRect)
        sceneGroup.botBar = bottomRect
        
        var buttons1 = game.add.group()
        buttons1.x = game.world.centerX + 120
        buttons1.y = game.world.height - 110
        buttons1.scale.setTo(0.95,0.95)
        sceneGroup.add(buttons1)
        
        var button1 = buttons1.create(0,0, 'atlas.twin','button_off')
        button1.anchor.setTo(0.5,0.5)
        button1.inputEnabled = true
        button1.tag = 1
        button1.active = true
        button1.scale.x = -1
        button1.events.onInputDown.add(inputButton)
        button1.events.onInputUp.add(releaseButton)
        
        var button1 = buttons1.create(0,0, 'atlas.twin','button_on')
        button1.anchor.setTo(0.5,0.5)
        button1.scale.x = -1
        
        changeImage(0,buttons1)
        
        var buttons1 = game.add.group()
        buttons1.x = game.world.centerX -120
        buttons1.y = game.world.height - 110
        sceneGroup.add(buttons1)
        
        var button1 = buttons1.create(0,0, 'atlas.twin','button_off')
        button1.anchor.setTo(0.5,0.5)
        button1.tag = 0
        button1.inputEnabled = true
        button1.active = true
        button1.events.onInputDown.add(inputButton)
        button1.events.onInputUp.add(releaseButton)
        
        sceneGroup.rollBtn = buttons1
        
        var button1 = buttons1.create(0,0, 'atlas.twin','button_on')
        button1.anchor.setTo(0.5,0.5)
        
        changeImage(0,buttons1)
        
    }
    
    function randomize(index){
        var isTrue = false
        
        if(Math.random()*index < 1){
            isTrue = true
        }
                
        return isTrue
    }
    
    function activateObject(item, posX){
        
        item.active = true
        item.alpha = 1         
        piecesGroup.remove(item)
        obstaclesGroup.add(item)
        
        item.x = posX
        item.y = -100
        
    }
    
    function getOrder(){
        
        var order = []
        for(var i = 0; i < piecesGroup.length;i++){
            order[i] = i
        }
        
        Phaser.ArrayUtils.shuffle(order)
        return order
    }
    
    function sendCircles(){
        
        var count = 0
        var posX = game.world.centerX - 125
        
        var orderList = getOrder()
        
        for(var i = 0; i < piecesGroup.length;i++){
            
            var obj = piecesGroup.children[orderList[i]]
            
            if(obj && !obj.active){
                
                count++
                activateObject(obj,posX)
                
                if(count == 2){
                    break
                }
                posX+=250
            }
        }
    }
    
    function createPiece(tag,number,left){
        
        var isLeft = left || true
        
        for(var i = 0; i < number; i++){
            
            var asset
            if(tag == 'bar'){
                
                asset = piecesGroup.create(0,0,'atlas.twin',tag)
                
            }else if (tag == 'badclown'){
                
                asset = game.add.sprite(0,0, 'bMonster');
                piecesGroup.add(asset)
                asset.animations.add('walk');
                asset.animations.play('walk',24,true);   
            
            }else{
                
                asset = piecesGroup.create(0,0,'atlas.twin',tag)
                
            }
            
            asset.anchor.setTo(0.5,0.5)
            asset.x =-100
            asset.y = -200
            asset.alpha = 0
            asset.tag = tag
            asset.scale.setTo(1.2,1.2)
            asset.used = false
            
        }

    }
    
    function createAssets(){
        
        
        for(var i = 0;i<8;i++){
            //addObstacle('bar',false)
        }
        
    }
    
    function deactivateObject(obs){
        
        obstaclesGroup.remove(obs)
        piecesGroup.add(obs)

        obs.alpha = 0
        obs.y = -100
        obs.active = false
                    
    }
    
    
    function checkPosPlayer(obj1,obj2, distValue){
        
        //console.log(obj1.world.x + ' posX, ' + obj1.world.y + ' posY,' + obj2.world.x + ' obj2X,' + obj2.world.y + ' obj2Y')
        var distance = distValue || 0.5
        
        if(Math.abs(obj1.world.x - obj2.world.x) < Math.abs(obj2.width) * 1 && Math.abs(obj1.world.y - obj2.world.y)< Math.abs(obj2.height) * 1){
            return true
        }else{
            return false
            return false
        }
    }
    
    function checkObstacles(){
        
        for(var i = 0;i<obstaclesGroup.length;i++){            
            
            var object = obstaclesGroup.children[i]
            
            if (object.active){
                object.y += gameSpeed
                
                for(var u = 0; u < containersGroup.length;u++){
                    
                    var group = containersGroup.children[u]
                    for(var o = 0; o < group.length;o++){
                        
                        var cont = group.children[o]
                        if(checkPosPlayer(cont,object)){
                            if(object.tint == cont.tint){
                                addPoint(object)
                                deactivateObject(object)
                                
                                if(object.x < game.world.centerX){
                                    game.time.events.add(100,sendCircles,this)
                                }
                            }else{
                                setExplosion(object,0)
                                deactivateObject(object)
                                stopGame()
                            }
                        }
                    }
                }
            }
            
        }
    }
    
    function update(){
        
        if(!gameActive){
            return
        }
        
        checkObstacles()
        
        if(cursors.left.isDown && !pressLeft && !upLeft){
            pressLeft = true
            upLeft = true
            rotateGears(0)
        }
        
        if(cursors.right.isDown && !pressRight && !upRight){
            pressRight = true
            upRight = true
            rotateGears(1)
        }
        
        if(cursors.left.isUp){
            upLeft = false
        }
        
        if(cursors.right.isUp){
            upRight = false
        }
    }
    
    function preload(){
        
        game.plugins.add(Fabrique.Plugins.Spine);
        game.stage.disableVisibilityChange = false;
        		
		if(amazing.getMinigameId()){
			gameSong = sound.setSong(soundsPath + 'songs/the_buildup.mp3',0.8)
		}else{
			game.load.audio('gears', soundsPath + 'songs/the_buildup.mp3');
		}
        
    }
    
    function setLevel(number){
    
        var text = sceneGroup.levelText
        
        text.y = game.world.centerY - 200
        
        text.setText('Nivel ' + number)
        
        var addTween = game.add.tween(text).to({y:game.world.centerY - 150,alpha:1},500,Phaser.Easing.linear,true)
        addTween.onComplete.add(function(){
            game.add.tween(text).to({y:game.world.centerY - 200,alpha:0},250,Phaser.Easing.linear,true,500)
        })
    }
    
    function createLevelText(){
        
        var fontStyle = {font: "65px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        
        var levelText = new Phaser.Text(sceneGroup.game, 0, 5, "0", fontStyle)
        levelText.x = game.world.centerX
        levelText.y = game.world.centerY - 150
        levelText.anchor.setTo(0.5,0.5)
        sceneGroup.add(levelText)
        
        levelText.alpha = 0
        
        sceneGroup.levelText = levelText
        
        levelText.setShadow(3, 3, 'rgba(0,0,0,1)', 0);
        
    }
    
    function createContainers(){
        
        containersGroup = game.add.group()
        sceneGroup.add(containersGroup)
        
        var pivotX = game.world.centerX - 125
        
        for(var i = 0; i < 2; i++){
            
            var group = game.add.group()
            group.x = pivotX
            group.y = game.world.height - 450
            containersGroup.add(group)
            
            var part1 = group.create(0,0,'atlas.twin','half')
            part1.tint = COLORS[0]
            part1.anchor.setTo(0.5,0.5)
            part1.y-= part1.height * 0.5
            
            var part2 = group.create(0,part1.height * 0.5,'atlas.twin','half2')
            //part1.scale.setTo(1,-1)
            part2.tint = COLORS[1]
            part2.anchor.setTo(0.5,0.5)
            
            pivotX+=250
        }
    }
    
    function changePiecesColor(group){
        
        for(var i = 0; i < group.length;i++){
            
            var obj = group.children[i]
            
            if(i<group.length * 0.5){
                obj.tint = colorsUsed[0]
            }else{
                obj.tint = colorsUsed[1]
            }
        }
    }
    
    function colorContainers(){
        
        for(var i = 0; i < colorsUsed.length;i++){
            
            var group = containersGroup.children[i]
            
            group.children[0].tint = colorsUsed[0]
            group.children[1].tint = colorsUsed[1]
        }
        
        changePiecesColor(piecesGroup)
        changePiecesColor(obstaclesGroup)
        
    }
    
    function createCircles(){
        
        for(var i = 0; i < 10; i++){
            
            var circle = piecesGroup.create(0,0,'atlas.twin','dot')
            circle.anchor.setTo(0.5,0.5)
            circle.alpha = 0
            circle.active = false
            
            if(i<5){
                circle.tint = colorsUsed[0]
            }else{
                circle.tint = colorsUsed[1]
            }
            
        }
    }
    
    function lookParticle(key){
        
        for(var i = 0;i<particlesGroup.length;i++){
            
            var particle = particlesGroup.children[i]
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
    
    function createPart(key,obj){
        
        key+='Part'
        var particle = lookParticle(key)
        if(particle){
            
            particle.x = obj.world.x
            particle.y = obj.world.y
            particle.scale.setTo(1,1)
            
            var scaleToUse = 2
            if(key == 'smokePart'){scaleToUse = 2.5}
            game.add.tween(particle).to({alpha:0},300,Phaser.Easing.Cubic.In,true)
            game.add.tween(particle.scale).to({x:2,y:2},300,Phaser.Easing.Cubic.In,true)
            deactivateParticle(particle,300)
            
            particle.tint = obj.tint
        }
        
        
    }
    
    function createParticles(tag,number){
        
        tag+='Part'
        
        for(var i = 0; i < number;i++){
            
            var particle
            if(tag == 'textPart'){
                
                var fontStyle = {font: "50px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
                
                var particle = new Phaser.Text(sceneGroup.game, 0, 10, '0', fontStyle)
                particle.setShadow(3, 3, 'rgba(0,0,0,1)', 0);
                particlesGroup.add(particle)
                
            }else{
                particle = particlesGroup.create(-200,0,'atlas.twin',tag)
            }
            
            particle.alpha = 0
            particle.tag = tag
            particle.used = false
            particle.anchor.setTo(0.5,0.5)
            particle.scale.setTo(1,1)
        }
        
        
    }
    
	return {
		assets: assets,
        preload: preload,
        update:update,
		name: "twindots",
		create: function(event){

            cursors = game.input.keyboard.createCursorKeys()
            
			sceneGroup = game.add.group()
            
            var background = sceneGroup.create(-2,-2,'fondo')
            background.width = game.world.width+2
            background.height = game.world.height+2
            
            piecesGroup = game.add.group()
            sceneGroup.add(piecesGroup)
            
            obstaclesGroup = game.add.group()
            sceneGroup.add(obstaclesGroup)
            
            initialize()
            
            createContainers()
            createCircles()
            
            animateScene()
            
            colorContainers()
            
			if(!amazing.getMinigameId()){
				gameSong = game.add.audio('gears')
				game.sound.setDecodedCallback(gameSong, function(){
					gameSong.loopFull(0.8)
				}, this);
			}
            
            game.onPause.add(function(){
				
				if(amazing.getMinigameId()){
					gameSong.pause()
				}
				
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
				
				if(amazing.getMinigameId()){
					if(lives>0){
						gameSong.play()
					}
				}
				
                game.sound.mute = false
            }, this);
            
            createHearts()
            createPointsBar()
            createControls()
                        
            createAssets()
            
            createLevelText()
            
            particlesGroup = game.add.group()
            sceneGroup.add(particlesGroup)
            
            particlesUsed = game.add.group()
            sceneGroup.add(particlesUsed)
            
            createParticles('ring',4)
            createParticles('text',6)
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()