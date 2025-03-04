/**
*  @filename    paladin.HammershockBuild.js
*  @author      theBGuy
*  @desc        Hybrid hammerdin (BlessedHammer/HolyShock) based final build
*
*/

const finalBuild = {
	caster: false,
	skillstab: sdk.skills.tabs.PalaCombat,
	wantedskills: [sdk.skills.BlessedHammer, sdk.skills.HolyShock],
	usefulskills: [sdk.skills.HolyShield, sdk.skills.ResistLightning, sdk.skills.Zeal, sdk.skills.Concentration, sdk.skills.Vigor, sdk.skills.BlessedAim],
	precastSkills: [sdk.skills.HolyShield],
	usefulStats: [sdk.stats.PierceLtng, sdk.stats.PassiveLightningMastery, sdk.stats.PassiveLightningPierce],
	mercDiff: sdk.difficulty.Nightmare,
	mercAct: 2,
	mercAuraWanted: "Holy Freeze",
	classicStats: [
		["strength", 80], ["vitality", "all"]
	],
	expansionStats: [
		["strength", 103], ["dexterity", 136], ["vitality", 300],
		["dexterity", "block"], ["vitality", "all"]
	],
	skills: [
		[sdk.skills.Zeal, 4],
		[sdk.skills.Vengeance, 1],
		[sdk.skills.Redemption, 1],
		[sdk.skills.Salvation, 1],
		[sdk.skills.HolyShield, 1],
		[sdk.skills.Concentration, 1],
		[sdk.skills.BlessedHammer, 20],
		[sdk.skills.HolyShock, 20],
		[sdk.skills.BlessedAim, 20, false],
		[sdk.skills.ResistLightning, 20, false],
		[sdk.skills.Zeal, 20, false],
	],
	classicTiers: [
		// Weapon
		"[name] == warscepter && [quality] >= magic # [paladinskills] == 2 && [ias] == 40 && [skillholyshock] >= 1 # [tier] == 100000 + tierscore(item)",
		// Helm - Tarnhelm
		"[name] == skullcap && [quality] == unique # [itemallskills] == 1 && [itemmagicbonus] >= 25 # [tier] == 100000 + tierscore(item)",
		// Shield
		"[type] == shield && [quality] >= magic # [paladinskills] == 2 && [allres] >= 16 # [tier] == 100000 + tierscore(item)",
		// Rings - SoJ
		"[type] == ring && [quality] == unique # [itemmaxmanapercent] == 25 # [tier] == 100000",
		// Amulet
		"[type] == amulet && [quality] >= magic # [paladinskills] == 2 && [allres] >= 16 # [tier] == 100000 + tierscore(item)",
		// Boots - Hsaru's Iron Heel
		"[name] == chainboots && [quality] == set # [frw] == 20 # [tier] == 100000",
		// Belt - Hsaru's Iron Stay
		"[name] == belt && [quality] == set # [coldresist] == 20 && [maxhp] == 20 # [tier] == 100000",
	],
	expansionTiers: [
		// Weapon - Heaven's Light
		"[type] == scepter && [quality] == unique && [flag] != ethereal # [paladinskills] >= 2 && [enhanceddamage] >= 250 # [tier] == 100000 + tierscore(item)",
		// Helm - Harlequin's Crest
		"[name] == shako && [quality] == unique && [flag] != ethereal # [damageresist] == 10 # [tier] == 100000 + tierscore(item)",
		// Belt - TGods
		"[name] == warbelt && [quality] == unique && [flag] != ethereal # [enhanceddefense] >= 160 # [tier] == 110000 + tierscore(item)",
		// Boots - Gore Rider
		"[name] == warboots && [quality] == unique && [flag] != ethereal # [enhanceddefense] >= 160 # [tier] == 110000 + tierscore(item)",
		// Armor - Enigma
		"[type] == armor && [flag] != ethereal && [flag] == runeword # [itemallskills] == 2 # [tier] == 100000",
		// Final Shield - Exile
		"[type] == auricshields && [flag] == runeword # [defianceaura] >= 13 # [tier] == 110000",
		// Shield - HoZ
		"[name] == gildedshield && [quality] == unique && [flag] != ethereal # [enhanceddefense] >= 150 # [tier] == 50000 + tierscore(item)",
		// Gloves - Laying of Hand's
		"[name] == bramblemitts && [quality] == set && [flag] != ethereal # [ias] >= 20 # [tier] == 110000",
		// Amulet - Highlords
		"[type] == amulet && [quality] == unique # [lightresist] == 35 # [tier] == 100000",
		// Final Rings - Perfect Raven Frost & Bul-Kathos' Wedding Band
		"[type] == ring && [quality] == unique # [dexterity] == 20 && [tohit] == 250 # [tier] == 110000",
		"[type] == ring && [quality] == unique # [maxstamina] == 50 && [lifeleech] == 5 # [tier] == 110000",
		// Rings - Raven Frost && Bul-Kathos' Wedding Band
		"[type] == ring && [quality] == unique # [dexterity] >= 15 && [tohit] >= 150 # [tier] == 100000",
		"[type] == ring && [quality] == unique # [maxstamina] == 50 && [lifeleech] >= 3 # [tier] == 100000",
		// Switch - CTA
		"[minimumsockets] >= 5 && [flag] == runeword # [plusskillbattleorders] >= 1 # [secondarytier] == 100000",
		// Merc Final Armor - Fortitude
		"[type] == armor && [flag] == runeword # [enhanceddefense] >= 200 && [enhanceddamage] >= 300 # [merctier] == 100000",
		// Merc Armor - Treachery
		"[type] == armor && [flag] == runeword # [ias] == 45 && [coldresist] == 30 # [merctier] == 50000 + mercscore(item)",
		// Merc Final Helmet - Eth Andy's
		"[name] == demonhead && [quality] == unique && [flag] == ethereal # [strength] >= 25 && [enhanceddefense] >= 100 # [merctier] == 50000 + mercscore(item)",
		// Merc Helmet - Andy's
		"[name] == demonhead && [quality] == unique && [flag] != ethereal # [strength] >= 25 && [enhanceddefense] >= 100 # [merctier] == 40000 + mercscore(item)",
	],
	stats: undefined,
	autoEquipTiers: undefined,

	charms: {
		ResLife: {
			max: 6,
			have: [],
			classid: sdk.items.SmallCharm,
			stats: function (check) {
				return (!check.unique && check.classid === this.classid && check.allRes === 5 && check.getStat(sdk.stats.MaxHp) === 20);
			}
		},

		ResMf: {
			max: 2,
			have: [],
			classid: sdk.items.SmallCharm,
			stats: function (check) {
				return (!check.unique && check.classid === this.classid && check.allRes === 5 && check.getStat(sdk.stats.MagicBonus) === 7);
			}
		},

		Skiller: {
			max: 2,
			have: [],
			classid: sdk.items.GrandCharm,
			stats: function (check) {
				return (!check.unique && check.classid === this.classid && check.getStat(sdk.stats.AddSkillTab, sdk.skills.tabs.Offensive) === 1
					&& check.getStat(sdk.stats.MaxHp) >= 40);
			}
		},
	},

	AutoBuildTemplate: {
		1:	{
			Update: function () {
				Config.Vigor = false;
				Config.AttackSkill = [-1, sdk.skills.BlessedHammer, sdk.skills.Concentration, sdk.skills.BlessedHammer, sdk.skills.Concentration, sdk.skills.Zeal, sdk.skills.HolyShock];
				Config.LowManaSkill = [-1, -1];
				Config.SkipImmune = ["magic and lightning and physical"];	// Don't think this ever happens but should skip if it does
				Config.BeltColumn = ["hp", "hp", "mp", "rv"];
				SetUp.belt();
			}
		},
	},

	respec: function () {
		if (me.classic) {
			return me.charlvl >= 75 && me.diablo;
		} else {
			return Check.haveItem("scepter", "unique", "Heaven's Light") && Check.haveItem("armor", "runeword", "Enigma");
		}
	},

	active: function () {
		return this.respec() && (me.getSkill(sdk.skills.HolyShock, sdk.skills.subindex.HardPoints) === 20 && me.getSkill(sdk.skills.BlessedHammer, sdk.skills.subindex.HardPoints) === 20);
	},
};

// Has to be set after its loaded
finalBuild.stats = me.classic ? finalBuild.classicStats : finalBuild.expansionStats;
finalBuild.autoEquipTiers = me.classic ? finalBuild.classicTiers : finalBuild.expansionTiers;
