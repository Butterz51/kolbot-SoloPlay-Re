/**
*	@filename	river.js
*	@author		theBGuy
*	@desc		clear river of flame from city of the damned to hephasto then to the waypoint
*/

function river() {
	myPrint('starting river');

	Town.doChores();
	Town.buyPots(10, "Antidote", true);
	Town.buyPots(10, "Thawing", true);

	Pather.checkWP(sdk.areas.CityoftheDamned, true) ? Pather.useWaypoint(sdk.areas.CityoftheDamned) : Pather.getWP(sdk.areas.CityoftheDamned);
	Precast.doPrecast(true);
	Pather.clearToExit(sdk.areas.CityoftheDamned, sdk.areas.RiverofFlame, true);

	if (!Pather.moveToPreset(me.area, 2, 376)) {
		print("ÿc8Kolbot-SoloPlayÿc0: Failed to move to Hephasto");
	}

	try {
		Attack.clear(20, 0, getLocaleString(1067)); // Hephasto The Armorer
	} catch (err) {
		print('ÿc8Kolbot-SoloPlayÿc0: Failed to kill Hephasto');
	}

	Pather.getWP(sdk.areas.RiverofFlame, true);

	return true;
}
