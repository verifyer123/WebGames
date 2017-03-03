var spinwheel = function(){

	assets = {
        atlases: [                
			{
				name: "atlas.jump",
                json: "images/spinwheel/atlas.json",
                image: "images/spinwheel/atlas.png"
			}],
        images: [],
		sounds: [],
	}
    

	
    function preload() {
        
        game.plugins.add(Fabrique.Plugins.Spine);
        game.stage.disableVisibilityChange = true;
        //game.load.spine('men', "img/spines/skeleton.json");		
		game.load.image("fondo", "images/spinwheel/fondo-01.png");
		game.load.image("barra1", "images/spinwheel/barra1.png");
		
    }
	
	var bar1;
	var pressButton = null;
	var moveBar = null;
	
	function initialize(){

        gameActive = false
        moveUp = false
        objectsGroup = null
        lives = 1
 
        
	}	
	
	
    function inputButton(obj){
                
		moveBar = obj.tag;
		pressButton = true;
		obj.isPressed = true
		obj.parent.children[1].alpha = 0;
    }
    
    function releaseButton(obj){
		moveBar = null;
        pressButton = false;
		obj.parent.children[1].alpha = 1;
          }	
	
    function createControls(){
        
        var spaceButtons = 220
        

        
        var groupButton = game.add.group()
        groupButton.x = game.world.centerX + 135
        groupButton.y = game.world.height -85
        groupButton.scale.setTo(1,1)
        groupButton.isPressed = false
        sceneGroup.add(groupButton)
        
        var button1 = groupButton.create(0,0, 'atlas.jump','right_press')
        button1.anchor.setTo(0.5,0.5)
        
        var button2 = groupButton.create(0,0, 'atlas.jump','right_idle')
        button2.anchor.setTo(0.5,0.5)
        button2.inputEnabled = true
        button2.tag = 'right'
        button2.events.onInputDown.add(inputButton)
        button2.events.onInputUp.add(releaseButton)
        
        var groupButton = game.add.group()
        groupButton.x = game.world.centerX - 135
        groupButton.y = game.world.height -85
        groupButton.scale.setTo(1,1)
        groupButton.isPressed = false
        sceneGroup.add(groupButton)
        
        var button1 = groupButton.create(0,0, 'atlas.jump','left_press')
        button1.anchor.setTo(0.5,0.5)
        
        var button2 = groupButton.create(0,0, 'atlas.jump','left_idle')
        button2.anchor.setTo(0.5,0.5)
        button2.inputEnabled = true
        button2.tag = 'left'
        button2.events.onInputDown.add(inputButton)
        button2.events.onInputUp.add(releaseButton)
        
    }	

	

    function createScene(){
		var bgSpine = game.add.sprite(0, 0,"fondo");
		bar1 = game.add.sprite(140, 400,"barra1");
		bar1.anchor.setTo(0.5, 0.5);
		sceneGroup = game.add.group();
		createControls();
	
    }

function update() {

	if(moveBar == "left"){
		 bar1.angle -= 10;	
		
	}else if(moveBar == "right"){
		 bar1.angle += 10;
	}

}
	
	return {
		assets: assets,
		name: "spinwheel",
		create: createScene,
        preload: preload,
		update:update
	}

}()