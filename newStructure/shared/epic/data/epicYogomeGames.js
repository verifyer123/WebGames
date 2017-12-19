var epicYogomeGames = function () {

	var urls = {dev:"../..", prod:".."}
	var url = urls.prod
	var games = yogomeGames.getObjectGames()

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

	var getGames = function(){

		console.log(url)
		return epicGames

	}

	var mixpanelCall = function(callName,gameIndex){

		var gamesList = epicYogomeGames.getGames()

		console.log('gameIndex sent ' + gameIndex )

		mixpanel.track(
			callName,
			{"gameName": gamesList[gameIndex].name}
		);

	}

	return{
		mixpanelCall:mixpanelCall,
		getGames:getGames,
	}
}()