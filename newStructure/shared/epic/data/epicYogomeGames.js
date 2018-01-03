var epicYogomeGames = function () {

	var urls = {dev:"../..", prod:".."}
	var url = urls.prod
	var games = yogomeGames.getObjectGames()
	var currentPlayer = parent.epicModel.getPlayer()

	var epicGames = [
		games["UniDream"],
		games["SquatCount"],
		games["SnoozeCrater"],
		games["WildSnaps"],
		games["SpaceCount"],
		games["ToyFigures"],
		games["MathBomb"],
		games["FloatandCount"],
		games["DuckCount"],
		games["Countipede"],
		games["AcornNumbers"],
		games["ElementalWitch"],
		games["SaladCards"],
		games["DrZombie"],
		games["MagicGate"],
		games["GalacticPool"],
		games["SwampShapes"],
		games["CroakSong"],
		games["HealthyCollector"],
		games["GeoTunnel"],
		games["ClashCritters"],
		games["MinmaxDuel"],
		games["PuzzleRoad"],
		games["NachoSmacho"],
		games["Lizart"],
		games["Astronometric"],
		games["SkyLanguage"],
		games["FlightoClock"],
		games["SpaceVaccum"],
		games["BeachNinja"],
		games["ColorAttack"],
		games["WildDentist"],
		games["CandyShapes"],
		games["TiltSprout"],
		games["GalaxyHeroes"],
		games["SpaceWords"],
		games["RiverRescue"],
		games["Evening"],
		games["CogCount"],
		games["WaterMorphosis"],
		games["DizzyBoat"],
		games["MsNomNom"],
		games["Aracnumber"],
		games["ClockFix"],
		games["FlagRunner"],
		games["AdditionDojo"],
		games["RiverCleaner"],
		games["Gemath"],
		games["MathRun"],
		games["GeoJourney"],
		games["MathCircus"],
		games["OonaSaysCook"],
		games["MagnetRide"],
		games["CultureIcons"],
		games["MathInvader"],
		games["Nutricanon"],
		games["Hackamole"],
		games["PiratePieces"],
		games["PopFish"],
		games["PizzaFraction"],
		games["Robovet"],
		games["FlagCollector"],
		games["FlyingFractions"],
		games["Fractiorama"],
		games["MathEngine"],
		games["Medicatcher"],
		games["FeatherShelter"],
		games["MathFeed"],
		games["MathPort"],
		games["RiftLand"],
		games["Microdefender"],
		games["HungryToads"],
		games["Locksmath"],
		games["MonsterDungeon"],
		games["LuckyNumbers"],
		games["Seaquence"],
		games["SushiTowers"],
		games["Baxtion"],
		games["Popsteroids"],
		games["SkyTap"],
		games["GarbageDiving"],
		games["DuskDefense"],
		games["GarbageMole"],
		games["Stackathon"],
		games["PaperShips"],
		games["MathgicHat"],
		games["GeometryWarp"],
		games["Mathrioska"],
		games["Jumptiply"],
		games["Divisubmarine"],
		games["Memonumbers"],
		games["JellyJump"],
		games["IceCreamNumbers"]

		//{name:'Triangrid',url:url + '/triangridSite/',sceneName:'triangrid',subject:'math', review:false}// 90

	]

	Array.prototype.diff = function(a) {
		return this.filter(function(i) {return a.indexOf(i) < 0;});
	};

	var getGames = function(){

		var unlockedGames = getUnlockedGames()
		// var restGames = epicGames.slice(unlockedGames.length, epicGames.length)
		// console.log(restGames)
		var restGames = epicGames.diff(unlockedGames)
		restGames = unlockedGames.concat(epicGames)

		return restGames

	}

	var mixpanelCall = function(callName,gameIndex){

		var gamesList = epicYogomeGames.getGames()

		console.log('gameIndex sent ' + gameIndex )

		mixpanel.track(
			callName,
			{"gameName": gamesList[gameIndex].name}
		);

	}

	function unlockGames(games) {
		// console.log(games)
		for(var gameIndex = 0; gameIndex < games.length; gameIndex++){
			var game = games[gameIndex]
			currentPlayer.minigames[game.id].unlocked = true
		}
	}
	
	function getUnlockedGames() {
		var unlockedGames = []

		for(var epicIndex = 0; epicIndex < epicGames.length; epicIndex++){
			var game = epicGames[epicIndex]
			var gameData = currentPlayer.minigames[game.id]
			if(gameData.unlocked){
				unlockedGames.push(game)
			}
		}

		return unlockedGames
	}

	return{
		mixpanelCall:mixpanelCall,
		getGames:getGames,
		unlockGames:unlockGames
	}
}()