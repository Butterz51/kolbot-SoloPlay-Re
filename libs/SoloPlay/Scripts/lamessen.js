/**
*  @filename    lamessen.js
*  @author      isid0re, theBGuy
*  @desc        get the lam essen's tome
*
*/

function lamessen () {
	Town.doChores(false, { fullChores: true });
	myPrint("starting lamessen");

	Pather.checkWP(sdk.areas.KurastBazaar, true) ? Pather.useWaypoint(sdk.areas.KurastBazaar) : Pather.getWP(sdk.areas.KurastBazaar);
	Precast.doPrecast(true);

	if (!Pather.moveToExit(sdk.areas.RuinedTemple, true) || !Pather.moveToPreset(me.area, sdk.unittype.Object, sdk.quest.chest.LamEsensTomeHolder)) {
		throw new Error("Failed to move to LamEssen Tome");
	}

	Quest.collectItem(sdk.items.quest.LamEsensTome, sdk.quest.chest.LamEsensTomeHolder);
	Quest.unfinishedQuests();

	return true;
}
