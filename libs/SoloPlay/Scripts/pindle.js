/**
*  @filename    pindle.js
*  @author      theBGuy
*  @desc        Kill pindleskin
*
*/

function pindle () {
	Town.doChores(false, { fullChores: true });
	Town.goToTown(5);
	myPrint("starting pindle");

	!Pather.getPortal(sdk.areas.NihlathaksTemple) && Town.npcInteract("anya");
	if (!Pather.usePortal(sdk.areas.NihlathaksTemple)) return true;

	Precast.doPrecast(true);
	Pather.moveTo(10058, 13234);
	Attack.killTarget(getLocaleString(sdk.locale.monsters.Pindleskin));
	Pickit.pickItems();

	return true;
}
