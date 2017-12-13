
var soundsPath = "../../shared/minigames/sounds/"
var settings = function(){
    
    var localizationData = {
		"EN":{
            "high":"High",
			"low":"Low",
			"graphics":"Graphics"
		},

		"ES":{
            "low":"Bajo",
			"high":"Alto",
			"graphics":"Gráficos"
			
		}
	}
    

	assets = {
        atlases: [
            {   
                name: "atlas.settings",
                json: "images/settings/atlas.json",
                image: "images/settings/atlas.png",
            },
        ],
        images: [

		],
		sounds: [
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			
		],
    }
    
        
    var lives = null
	var sceneGroup = null
	var background
    var gameActive = true
	var particlesGroup, particlesUsed
    var gameIndex = 7
	var indexGame
    var overlayGroup
    var spaceSong
	var pattern, menuGroup
	

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
            
            obj.alpha = 1
            game.add.tween(obj.scale).from({ y:0.01},250,Phaser.Easing.linear,true)
        },this)
    }
    
    function animateScene() {
                
        gameActive = false
        
        var startGroup = new Phaser.Group(game)
        sceneGroup.add(startGroup)
                
        sceneGroup.alpha = 0
		menuGroup.alpha = 0
		
        game.add.tween(sceneGroup).to({alpha:1},500, "Linear",true).onComplete.add(function(){
			
			menuGroup.alpha = 1
			game.add.tween(menuGroup).from({alpha:0,y:menuGroup.y - 100},500,"Linear",true).onComplete.add(function(){
				
				gameActive = true
			})
		})
		

    }    
    
    function preload(){
        		
        game.stage.disableVisibilityChange = false;
        game.load.audio('spaceSong', soundsPath + 'songs/childrenbit.mp3');
        
		game.load.image('settingsText',"images/settings/settings" + localization.getLanguage() + ".png")
		
		console.log(localization.getLanguage() + ' language')
        
    }
	
	function update(){
		
		pattern.tilePosition.x+= 2
		pattern.tilePosition.y+= 2
	}
	
	function inputButton(obj){
		
		if(!gameActive){
			return
		}
		
		obj.inputEnabled = false
		
		sound.play("pop")
		var parent = obj.parent
		
		var tween = game.add.tween(parent.scale).to({x:0.6,y:0.6},200,"Linear",true,0,0)
		tween.yoyo(true,0)
		
		tween.onComplete.add(function(){
			
			game.add.tween(sceneGroup).to({alpha:0},500,"Linear",true).onComplete.add(function(){
				
				var gameScene = sceneloader.getScene("zucaritas")
				gameScene.setGraphics(parent.low)

				sceneloader.show("zucaritas")
			
			})
			
		})
		
	}
	
	function createBackground(){
		
		pattern = game.add.tileSprite(0,0,game.world.width, game.world.height,'atlas.settings','retro-pattern')
		sceneGroup.add(pattern)
	}
	
	function createMenu(){
		
		menuGroup = game.add.group()
		menuGroup.x = game.world.centerX
		menuGroup.y = game.world.centerY
		sceneGroup.add(menuGroup)
		
		var back = menuGroup.create(0,0,'atlas.settings','introscreen')
		back.anchor.setTo(0.5,0.5)
		
		var setText = menuGroup.create(0,-back.height * 0.37,'settingsText')
		setText.anchor.setTo(0.5,0.5)
		
		var pivotY = -35
		
		var rect = new Phaser.Graphics(game)
        rect.beginFill(0xffffff)
        rect.drawRoundedRect(0,pivotY,325,100)
        rect.endFill()
		rect.x-= rect.width * 0.5
		rect.y-= rect.height * 0.5
		menuGroup.add(rect)
		
		var rect = new Phaser.Graphics(game)
        rect.beginFill(0x000000)
        rect.drawRoundedRect(0,pivotY,300,75)
        rect.endFill()
		rect.x-= rect.width * 0.5
		rect.y-= rect.height * 0.5
		menuGroup.add(rect)
		
		var fontStyle = {font: "45px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
		var pointsText = new Phaser.Text(sceneGroup.game, 0, pivotY + 5,localization.getString(localizationData,'graphics'), fontStyle)
		pointsText.anchor.setTo(0.5,0.5)
		menuGroup.add(pointsText)

		pointsText.setShadow(4, 4, 'rgba(0,0,0,0.5)', 0);
		
		var buttons = game.add.group()
		buttons.y = 100
		menuGroup.add(buttons)
		
		var low = true
		var pivotX = -100
		var type = ['high','low']
		for(var i = 0; i < 2; i++){
			
			var group = game.add.group()
			group.x = pivotX
			buttons.add(group)
			
			low = !low
			group.low = low
			
			var image = group.create(0,0,'atlas.settings','button' + (i+1))
			image.inputEnabled = true
			image.events.onInputDown.add(inputButton)
			image.anchor.setTo(0.5,0.5)
			
			var fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
			var pointsText = new Phaser.Text(sceneGroup.game, 0, 5,localization.getString(localizationData,type[i]), fontStyle)
			pointsText.anchor.setTo(0.5,0.5)
			group.add(pointsText)
			
			pointsText.setShadow(4, 4, 'rgba(0,0,0,0.5)', 0);
			
			pivotX+= 200
		}
	}
	
	return {
		
		assets: assets,
		name: "settings",
		update: update,
        preload:preload,
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()
			createMenu()
            
            initialize()
			
            animateScene()
            
		},
	}
}()