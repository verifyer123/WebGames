
var soundsPath = "../../shared/minigames/sounds/"
var vs = function(){
    
    var localizationData = {
		"EN":{

		},

		"ES":{

		}
	}
    

	assets = {
        atlases: [
            {   
                name: "atlas.vs",
                json: "images/selectCards/atlas.json",
                image: "images/selectCards/atlas.png",
            },
        ],
        images: [
			{   name:"background",
				file: "images/selectCards/fondo.png"},
		],
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "cut",
				file: soundsPath + "cut.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrong.mp3"},
            {	name: "explosion",
				file: soundsPath + "laserexplode.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "shoot",
				file: soundsPath + "shoot.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
			{	name: "energyCharge2",
				file: soundsPath + "energyCharge2.mp3"},
			
			
		],
    }
    
        
    var lives = null
	var sceneGroup = null
	var background, stars
    var gameActive = true
	var shoot
	var particlesGroup, particlesUsed
    var gameIndex = 7
	var indexGame
    var overlayGroup
    var spaceSong
	var vsSpine
	var whiteFade
	var spineList
	var characterGroup
	var characterList
	
	var colorsGradient = {
    	fire:0xff2e2e,
		water:0x436bff,
		wind:0xfffd73,
		earth:0x4cff39
    }
	

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 1

        
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
        
        game.load.spine('vs', "images/spines/vsLight/VS.json")  
        game.load.audio('spaceSong', soundsPath + 'songs/versusSong.mp3');
		
		console.log(localization.getLanguage() + ' language')

		// for(var i = 0; i < spineList.length;i++){
		//
		// 	var character = spineList[i]
		// 	game.load.spine(character.name,character.dir)
		// }
        
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
		
		background = game.add.tileSprite(0,0,game.world.width,game.world.height,'atlas.vs','gradiente_versus')
		sceneGroup.add(background)
	}
	
	function update(){
		
		stars.tilePosition.x-= 3
		stars.tilePosition.y-= 3
		
		
		//stars.angle++
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
    
    function createPart(key,obj,offsetX){
        
        var offX = offsetX || 0
        var particle = lookParticle(key)
		
        if(particle){
            
            particle.x = obj.world.x + offX
            particle.y = obj.world.y
            particle.scale.setTo(1,1)
            //game.add.tween(particle).to({alpha:0},300,Phaser.Easing.Cubic.In,true)
            //game.add.tween(particle.scale).to({x:2,y:2},300,Phaser.Easing.Cubic.In,true)
            particle.start(true, 1500, null, 6);
			
			game.add.tween(particle).to({alpha:0},500,"Linear",true,1000).onComplete.add(function(){
				deactivateParticle(particle,0)
			})
			
        }
        
        
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

				particle.makeParticles('atlas.vs',tag);
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
		
		whiteFade = new Phaser.Graphics(game)
        whiteFade.beginFill(0xffffff)
        whiteFade.drawRect(0,0,game.world.width * 2, game.world.height * 2)
        whiteFade.endFill()
		
		whiteFade = new Phaser.Graphics(game)
        whiteFade.beginFill(0xffffff)
        whiteFade.drawRect(0,0,game.world.width * 2, game.world.height * 2)
        whiteFade.alpha = 0
        whiteFade.endFill()
		sceneGroup.add(whiteFade)

	}
	
	function inputButton(obj){
		
		if(!gameActive){
			return
		}
		
	}
	
	function setCharacters(characters){
		
		spineList = []
		
		for(var i = 0; i < characters.length;i++){
			
			var character = characters[i]
			spineList[i]= {}
			spineList[i].id = character.data.id
			spineList[i].name = character.data.name
			spineList[i].dir = character.data.directory
			spineList[i].scale = character.data.spine.options.scale
			spineList[i].element = character.data.stats.element
		}
		
		console.log(spineList + ' list')
	}
	
	return {
		
		assets: assets,
		name: "vs",
		update: update,
        preload:preload,
		setCharacters:setCharacters,
		create: function(event){
            
			var preloadAlpha = document.getElementById("preloadBattle");
        	preloadAlpha.style.visibility = "hidden";
			
			sceneGroup = game.add.group()
			
			createBackground()
			
			addParticles()
                        	
            spaceSong = game.add.audio('spaceSong')
            game.sound.setDecodedCallback(spaceSong, function(){
				game.time.events.add(1000,function(){
					spaceSong.loopFull(0.8)
				})
                
            }, this);
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
            
            initialize()
			
			buttons.getButton(spaceSong,sceneGroup)
            
            animateScene()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()