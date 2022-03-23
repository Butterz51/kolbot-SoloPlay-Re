/*
*	@filename	ProtoTypesOverrides.js
*	@author		theBGuy
*	@credits 	Jaenster, sonic, isid0re
*	@desc		additions for improved Kolbot-SoloPlay functionality and code readability
*/

!isIncluded('libs/common/Prototypes.js') && include('libs/common/Prototypes.js');

Unit.prototype.getResPenalty = function (difficulty) {
	difficulty > 2 && (difficulty = 2);
	return me.gametype === sdk.game.gametype.Classic ? [0, 20, 50][difficulty] : [0, 40, 100][difficulty];
};

Unit.prototype.getItemType = function () {
	switch (this.itemType) {
	case sdk.itemtype.Shield:
	case sdk.itemtype.AuricShields:
	case sdk.itemtype.VoodooHeads:
		return "Shield";
	case sdk.itemtype.Armor:
		return "Armor";
	case sdk.itemtype.Helm:
	case sdk.itemtype.PrimalHelm:
	case sdk.itemtype.Circlet:
	case sdk.itemtype.Pelt:
		return "Helmet";
	case sdk.itemtype.Scepter:
	case sdk.itemtype.Wand:
	case sdk.itemtype.Staff:
	case sdk.itemtype.Bow:
	case sdk.itemtype.Axe:
	case sdk.itemtype.Club:
	case sdk.itemtype.Sword:
	case sdk.itemtype.Hammer:
	case sdk.itemtype.Knife:
	case sdk.itemtype.Spear:
	case sdk.itemtype.Polearm:
	case sdk.itemtype.Crossbow:
	case sdk.itemtype.Mace:
	case sdk.itemtype.ThrowingKnife:
	case sdk.itemtype.ThrowingAxe:
	case sdk.itemtype.Javelin:
	case sdk.itemtype.Orb:
	case sdk.itemtype.AmazonBow:
	case sdk.itemtype.AmazonSpear:
	case sdk.itemtype.AmazonJavelin:
	case sdk.itemtype.MissilePotion:
	case sdk.itemtype.HandtoHand:
	case sdk.itemtype.AssassinClaw:
		return "Weapon";
	// currently only use this function for socket related things so might as well make non-socketable things return false
	case sdk.itemtype.BowQuiver:
	case sdk.itemtype.CrossbowQuiver:
		//return "Quiver";
	case sdk.itemtype.Ring:
		//return "Ring";
	case sdk.itemtype.Amulet:
		//return "Amulet";
	case sdk.itemtype.Boots:
		//return "Boots";
	case sdk.itemtype.Gloves:
		//return "Gloves";
	case sdk.itemtype.Belt:
		//return "Belt";
	default:
		return "";
	}
};

Object.defineProperties(Unit.prototype, {
	isStunned: {
		get: function () {
			return this.getState(sdk.states.Stunned);
		},
	},
	isUnderCoS: {
		get: function () {
			return this.getState(sdk.states.Cloaked);
		},
	},
	isUnderLowerRes: {
		get: function () {
			return this.getState(sdk.states.LowerResist);
		},
	},
	isRuneword: {
		get: function () {
			if (this.type !== sdk.unittype.Item) return false;
			return !!this.getFlag(0x4000000);
		}
	},
	isQuestItem: {
		get: function () {
			if (this.type !== sdk.unittype.Item) return false;
			return this.itemType === sdk.itemtype.Quest ||
                [sdk.items.quest.HoradricMalus, sdk.items.quest.WirtsLeg, sdk.items.quest.HoradricStaff, sdk.items.quest.ShaftoftheHoradricStaff,
                	sdk.items.quest.ViperAmulet, sdk.items.quest.DecoyGidbinn, sdk.items.quest.TheGidbinn, sdk.items.quest.KhalimsFlail,
                	sdk.items.quest.KhalimsWill, sdk.items.quest.HellForgeHammer, sdk.items.quest.StandardofHeroes].includes(this.classid);
		}
	},
	isBaseType: {
		get: function () {
			if (this.type !== sdk.unittype.Item) return false;
			return [sdk.itemquality.Normal, sdk.itemquality.Superior].includes(this.quality) && !this.isQuestItem && !this.isRuneword
				&& getBaseStat("items", this.classid, "gemsockets") > 0 && [sdk.itemtype.Ring, sdk.itemtype.Amulet].indexOf(this.itemType) === -1;
		}
	},
	isSellable: {
		get: function () {
			if (this.type !== sdk.unittype.Item) return false;
			return !this.isQuestItem && 
				[sdk.items.quest.KeyofTerror, sdk.items.quest.KeyofHate, sdk.items.quest.KeyofDestruction, sdk.items.quest.DiablosHorn,
					sdk.items.quest.BaalsEye, sdk.items.quest.MephistosBrain, sdk.items.quest.TokenofAbsolution, sdk.items.quest.TwistedEssenceofSuffering,
					sdk.items.quest.ChargedEssenceofHatred, sdk.items.quest.BurningEssenceofTerror, sdk.items.quest.FesteringEssenceofDestruction].indexOf(this.classid) === -1 &&
            	!(this.quality === sdk.itemquality.Unique && [sdk.itemtype.SmallCharm, sdk.itemtype.MediumCharm, sdk.itemtype.LargeCharm].includes(this.itemType));
		}
	},
	rawStrength: {
		get: function () {
			let lvl = this.getStat(sdk.stats.Level);
			let rawBonus = function (i) { return i.getStat(sdk.stats.Strength); };
			let perLvlBonus = function (i) { return lvl * i.getStat(sdk.stats.PerLevelStrength) / 8; };
			let bonus = ~~(this.getItemsEx()
				.filter(function (i) { return i.isEquipped || i.isEquippedCharm; })
				.map(function (i) { return rawBonus(i) + perLvlBonus(i); })
				.reduce(function (acc, v) { return acc + v; }, 0));
			return this.getStat(sdk.stats.Strength) - bonus;
		},
	},
	rawDexterity: {
		get: function () {
			let lvl = this.getStat(sdk.stats.Level);
			let rawBonus = function (i) { return i.getStat(sdk.stats.Dexterity); };
			let perLvlBonus = function (i) { return lvl * i.getStat(sdk.stats.PerLevelDexterity) / 8; };
			let bonus = ~~(this.getItemsEx()
				.filter(function (i) { return i.isEquipped || i.isEquippedCharm; })
				.map(function (i) { return rawBonus(i) + perLvlBonus(i); })
				.reduce(function (acc, v) { return acc + v; }, 0));
			return this.getStat(sdk.stats.Dexterity) - bonus;
		},
	},
	upgradedStrReq: {
		get: function () {
			if (this.type !== sdk.unittype.Item) return false;
			let code, id, baseReq, finalReq, ethereal = this.getFlag(0x400000),
				reqModifier = this.getStat(91);

			switch (this.itemclass) {
			case sdk.itemclass.Normal:
				code = getBaseStat("items", this.classid, "ubercode").trim();

				break;
			case sdk.itemclass.Exceptional:
				code = getBaseStat("items", this.classid, "ultracode").trim();

				break;
			case sdk.itemclass.Elite:
				return this.strreq;
			}

			id = NTIPAliasClassID[code];
			baseReq = getBaseStat("items", id, "reqstr");
			finalReq = baseReq + Math.floor(baseReq * reqModifier / 100);
			if (ethereal) { finalReq -= 10; }
			return Math.max(finalReq, 0);
		}
	},
	upgradedDexReq: {
		get: function () {
			if (this.type !== sdk.unittype.Item) return false;
			let code, id, baseReq, finalReq, ethereal = this.getFlag(0x400000),
				reqModifier = this.getStat(91);

			switch (this.itemclass) {
			case sdk.itemclass.Normal:
				code = getBaseStat("items", this.classid, "ubercode").trim();

				break;
			case sdk.itemclass.Exceptional:
				code = getBaseStat("items", this.classid, "ultracode").trim();

				break;
			case sdk.itemclass.Elite:
				return this.dexreq;
			}

			id = NTIPAliasClassID[code];
			baseReq = getBaseStat("items", id, "reqdex");
			finalReq = baseReq + Math.floor(baseReq * reqModifier / 100);
			if (ethereal) { finalReq -= 10; }
			return Math.max(finalReq, 0);
		}
	},
	upgradedLvlReq: {
		get: function () {
			if (this.type !== sdk.unittype.Item) return false;
			let code, id;

			switch (this.itemclass) {
			case sdk.itemclass.Normal:
				code = getBaseStat("items", this.classid, "ubercode").trim();

				break;
			case sdk.itemclass.Exceptional:
				code = getBaseStat("items", this.classid, "ultracode").trim();

				break;
			case sdk.itemclass.Elite:
				return this.lvlreq;
			}

			id = NTIPAliasClassID[code];
			return Math.max(getBaseStat("items", id, "levelreq"), 0);
		}
	},
});

Object.defineProperties(me, {
	maxNearMonsters: {
		get: function () {
			return Math.floor((4 * (1 / me.hpmax * me.hp)) + 1);
		}
	},
	duelWielding: {
		get: function () {
			// only classes that can duel wield
			if (!me.assassin && !me.barbarian) return false;
			let items = me.getItemsEx()
				.filter(function (item) { return item.isEquipped && [4, 5].includes(item.bodylocation); })
			return !!items.length && items.length >= 2 && items.every(function (item) { return ![2, 69, 70].includes(item.itemType) && !getBaseStat("items", item.classid, "block") });
		}
	}
});

// Credit @Jaenster
Unit.prototype.getItems = function (...args) {
	let items = this.getItems.apply(this, args);

	if (typeof items === 'function' || !items.length) {
		return [];
	}

	return items;
};

// Credit @Jaenster
Unit.prototype.getItemsEx = function (...args) {
	let item = this.getItem.apply(this, args), items = [];

	if (item) {
		do {
			items.push(copyUnit(item));
		} while (item.getNext());
		return items;
	}

	return [];
};

Unit.prototype.getMobCount = function (range = 10, coll = 0, type = 0, noSpecialMobs = false) {
	if (this === undefined) return 0;
	const _this = this;
	return getUnits(sdk.unittype.Monster)
		.filter(function (mon) {
			return mon.attackable && getDistance(_this, mon) < range && (!type || ((type & mon.spectype) && !noSpecialMobs)) && (!coll || !checkCollision(_this, mon, coll));
		}).length;
};

// Credit @Jaenster
Unit.prototype.switchWeapons = function (slot) {
	if (this.gametype === 0 || this.weaponswitch === slot && slot !== undefined) {
		return true;
	}

	while (typeof me !== 'object') {delay(10);}

	let originalSlot = this.weaponswitch;

	let i, tick, switched = false,
		packetHandler = (bytes) => bytes.length > 0 && bytes[0] === 0x97 && (switched = true) && false; // false to not block
	addEventListener('gamepacket', packetHandler);
	try {
		for (i = 0; i < 10; i += 1) {
			//print('Switch weapons -- attempt #' + (i + 1));

			for (let j = 10; --j && me.idle;) {
				delay(3);
			}

			i > 0 && delay(Math.min(1 + (me.ping * 1.5), 10));
			!switched && sendPacket(1, 0x60); // Swap weapons

			tick = getTickCount();
			while (getTickCount() - tick < 250 + (me.ping * 5)) {
				if (switched || originalSlot !== me.weaponswitch) {
					return true;
				}

				delay(3);
			}
			// Retry
		}
	} finally {
		removeEventListener('gamepacket', packetHandler);
	}


	return false;
};

// Returns the number of frames needed to cast a given skill at a given FCR for a given char.
Unit.prototype.castingFrames = function (skillId, fcr, charClass) {
	if (this !== me) {
		print("invalid arguments, expected 'me' object");
		return false;
	}

	if (fcr === void 0) { fcr = this.getStat(sdk.stats.FCR); }
	if (charClass === void 0) { charClass = this.classid; }
	// https://diablo.fandom.com/wiki/Faster_Cast_Rate
	let effectiveFCR = Math.min(75, (fcr * 120 / (fcr + 120)) | 0);
	let isLightning = skillId === sdk.skills.Lightning || skillId === sdk.skills.ChainLightning;
	let baseCastRate = [20, isLightning ? 19 : 14, 16, 16, 14, 15, 17][charClass];
	if (isLightning) {
		return Math.round(256 * baseCastRate / (256 * (100 + effectiveFCR) / 100));
	}
	let animationSpeed = {
		normal: 256,
		human: 208,
		wolf: 229,
		bear: 228
	}[charClass === sdk.charclass.Druid ? (this.getState(sdk.states.Wolf) || this.getState(sdk.states.Bear)) : "normal"];
	return Math.ceil(256 * baseCastRate / Math.floor(animationSpeed * (100 + effectiveFCR) / 100)) - 1;
};

// Returns the duration in seconds needed to cast a given skill at a given FCR for a given char.
Unit.prototype.castingDuration = function (skillId, fcr = this.getStat(sdk.stats.FCR), charClass = this.classid) {
	return this.castingFrames(skillId, fcr, charClass) / 25;
};

Unit.prototype.castChargedSkill = function (...args) {
	let skillId, x, y, unit, chargedItem, charge,
		chargedItems = [],
		validCharge = function (itemCharge) {
			return itemCharge.skill === skillId && itemCharge.charges;
		};

	switch (args.length) {
	case 0: // item.castChargedSkill()
		break;
	case 1:
		if (args[0] instanceof Unit) { // hellfire.castChargedSkill(monster);
			unit = args[0];
		} else {
			skillId = args[0];
		}

		break;
	case 2:
		if (typeof args[0] === 'number') {
			if (args[1] instanceof Unit) { // me.castChargedSkill(skillId,unit)
				[skillId, unit] = [...args];
			} else if (typeof args[1] === 'number') { // item.castChargedSkill(x,y)
				[x, y] = [...args];
			}
		} else {
			throw new Error(' invalid arguments, expected (skillId, unit) or (x, y)');
		}

		break;
	case 3:
		// If all arguments are numbers
		if (typeof args[0] === 'number' && typeof args[1] === 'number' && typeof args[2] === 'number') {
			[skillId, x, y] = [...args];
		}

		break;
	default:
		throw new Error("invalid arguments, expected 'me' object or 'item' unit");
	}

	// Charged skills can only be casted on x, y coordinates
	unit && ([x, y] = [unit.x, unit.y]);

	if (this !== me && this.type !== 4) {
		Developer.debugging.skills && print("ÿc9CastChargedSkillÿc0 :: Wierd Error, invalid arguments, expected 'me' object or 'item' unit" + " unit type : " + this.type);
		return false;
	}

	// Called the function the unit, me.
	if (this === me) {
		if (!skillId) {
			throw Error('Must supply skillId on me.castChargedSkill');
		}

		chargedItems = [];

		// Item must be equipped, or a charm in inventory
		this.getItems(-1)
			.filter(item => item && (item.isEquipped || (item.isInInventory && [sdk.itemtype.SmallCharm, sdk.itemtype.MediumCharm, sdk.itemtype.LargeCharm].indexOf(item.itemType) > -1)))
			.forEach(function (item) {
				let stats = item.getStat(-2);

				if (stats.hasOwnProperty(204)) {
					if (stats[204] instanceof Array) {
						stats = stats[204].filter(validCharge);
						stats.length && chargedItems.push({
							charge: stats.first(),
							item: item
						});
					} else {
						if (stats[204].skill === skillId && stats[204].charges > 1) {
							chargedItems.push({
								charge: stats[204].charges,
								item: item
							});
						}
					}
				}
			});

		if (chargedItems.length === 0) {
			print("ÿc9CastChargedSkillÿc0 :: Don't have the charged skill (" + skillId + "), or not enough charges");
			return false;
		}

		chargedItem = chargedItems.sort((a, b) => a.charge.level - b.charge.level).first().item;

		// Check if item with charges is equipped on the switch spot
		if (me.weaponswitch === 0 && chargedItem.isOnSwap) {
			me.switchWeapons(1);
		}

		return chargedItem.castChargedSkill.apply(chargedItem, args);
	} else if (this.type === 4) {
		charge = this.getStat(-2)[204]; // WARNING. Somehow this gives duplicates

		if (!charge) {
			print("ÿc9CastChargedSkillÿc0 :: No charged skill on this item");
			return false;
		}

		if (skillId) {
			if (charge instanceof Array) {
				charge = charge.filter(item => (skillId && item.skill === skillId) && !!item.charges); // Filter out all other charged skills
				charge = charge.first();
			} else {
				if (charge.skill !== skillId || !charge.charges) {
					print("No charges matching skillId");
					charge = false;
				}
			}
		} else if (charge.length > 1) {
			throw new Error('multiple charges on this item without a given skillId');
		}

		if (charge) {
			// Setting skill on hand
			if (!Config.PacketCasting || Config.PacketCasting === 1 && skillId !== 54) {
				return Skill.cast(skillId, 0, x || me.x, y || me.y, this); // Non packet casting
			}

			// Packet casting
			sendPacket(1, 0x3c, 2, charge.skill, 1, 0x0, 1, 0x00, 4, this.gid);
			// No need for a delay, since its TCP, the server recv's the next statement always after the send cast skill packet

			// The result of "successfully" casted is different, so we cant wait for it here. We have to assume it worked
			sendPacket(1, 0x0C, 2, x || me.x, 2, y || me.y); // Cast the skill

			return true;
		}
	}

	return false;
};

Unit.prototype.castSwitchChargedSkill = function (...args) {
	let skillId, x, y, unit, chargedItem,
		chargedItems = [],
		validCharge = function (itemCharge) {
			return itemCharge.skill === skillId && itemCharge.charges;
		};

	switch (args.length) {
	case 0: // item.castChargedSkill()
		break;
	case 1: // hellfire.castChargedSkill(monster);
		break;
	case 2:
		if (typeof args[0] === 'number') {
			if (args[1] instanceof Unit) {
				// me.castChargedSkill(skillId, unit)
				[skillId, unit] = [...args];
			} else if (typeof args[1] === 'number') {
				// item.castChargedSkill(x, y)
				[x, y] = [...args];
			}
		} else {
			throw new Error(' invalid arguments, expected (skillId, unit) or (x, y)');
		}

		break;
	case 3: // If all arguments are numbers
		if (typeof args[0] === 'number' && typeof args[1] === 'number' && typeof args[2] === 'number') {
			[skillId, x, y] = [...args];
		}

		break;
	default:
		throw new Error("invalid arguments, expected 'me' object");
	}

	// Charged skills can only be casted on x, y coordinates
	unit && ([x, y] = [unit.x, unit.y]);

	if (this !== me) {
		throw Error("invalid arguments, expected 'me' object");
	}

	// Called the function the unit, me.
	if (this === me) {
		if (!skillId) {
			throw Error('Must supply skillId on me.castChargedSkill');
		}

		chargedItems = [];

		// Item must be equipped in the switch position
		this.getItems(-1)
			.filter(item => item && ((me.weaponswitch === 0 && [11, 12].indexOf(item.bodylocation) > -1) || (me.weaponswitch === 1 && [4, 5].indexOf(item.bodylocation) > -1)))
			.forEach(function (item) {
				let stats = item.getStat(-2);

				if (stats.hasOwnProperty(204)) {
					if (stats[204] instanceof Array) {
						stats = stats[204].filter(validCharge);
						stats.length && chargedItems.push({
							charge: stats.first(),
							item: item
						});
					} else {
						if (stats[204].skill === skillId && stats[204].charges > 1) {
							chargedItems.push({
								charge: stats[204].charges,
								item: item
							});
						}
					}
				}
			});

		if (chargedItems.length === 0) {
			print("ÿc9SwitchCastChargedSkillÿc0 :: Don't have the charged skill (" + skillId + "), or not enough charges");
			return false;
		}

		if (me.weaponswitch === 0) {
			me.switchWeapons(1);
		}

		chargedItem = chargedItems.sort((a, b) => a.charge.level - b.charge.level).first().item;

		return chargedItem.castChargedSkill.apply(chargedItem, args);
	}

	return false;
};

Unit.prototype.getStatEx = function (id, subid) {
	let i, temp, rval, regex;

	switch (id) {
	case 555: //calculates all res, doesnt exists trough
	{ // Block scope due to the variable declaration
		// Get all res
		let allres = [this.getStatEx(39), this.getStatEx(41), this.getStatEx(43), this.getStatEx(45)];

		// What is the minimum of the 4?
		let min = Math.min.apply(null, allres);

		// Cap all res to the minimum amount of res
		allres = allres.map(res => res > min ? min : res);

		// Get it in local variables, its more easy to read
		let [fire, cold, light, psn] = allres;

		return fire === cold && cold === light && light === psn ? min : 0;
	}

	case 9: // Max mana
		rval = this.getStat(9);

		if (rval > 446) {
			return rval - 16777216; // Fix for negative values (Gull knife)
		}

		return rval;
	case 20: // toblock
		switch (this.classid) {
		case 328: // buckler
			return this.getStat(20);
		case 413: // preserved
		case 483: // mummified
		case 503: // minion
			return this.getStat(20) - 3;
		case 329: // small
		case 414: // zombie
		case 484: // fetish
		case 504: // hellspawn
			return this.getStat(20) - 5;
		case 331: // kite
		case 415: // unraveller
		case 485: // sexton
		case 505: // overseer
			return this.getStat(20) - 8;
		case 351: // spiked
		case 374: // deefender
		case 416: // gargoyle
		case 486: // cantor
		case 506: // succubus
		case 408: // targe
		case 478: // akaran t
			return this.getStat(20) - 10;
		case 330: // large
		case 375: // round
		case 417: // demon
		case 487: // hierophant
		case 507: // bloodlord
			return this.getStat(20) - 12;
		case 376: // scutum
			return this.getStat(20) - 14;
		case 409: // rondache
		case 479: // akaran r
			return this.getStat(20) - 15;
		case 333: // goth
		case 379: // ancient
			return this.getStat(20) - 16;
		case 397: // barbed
			return this.getStat(20) - 17;
		case 377: // dragon
			return this.getStat(20) - 18;
		case 502: // vortex
			return this.getStat(20) - 19;
		case 350: // bone
		case 396: // grim
		case 445: // luna
		case 467: // blade barr
		case 466: // troll
		case 410: // heraldic
		case 480: // protector
			return this.getStat(20) - 20;
		case 444: // heater
		case 447: // monarch
		case 411: // aerin
		case 481: // gilded
		case 501: // zakarum
			return this.getStat(20) - 22;
		case 332: // tower
		case 378: // pavise
		case 446: // hyperion
		case 448: // aegis
		case 449: // ward
			return this.getStat(20) - 24;
		case 412: // crown
		case 482: // royal
		case 500: // kurast
			return this.getStat(20) - 25;
		case 499: // sacred r
			return this.getStat(20) - 28;
		case 498: // sacred t
			return this.getStat(20) - 30;
		}

		break;
	case 21: // plusmindamage
	case 22: // plusmaxdamage
		if (subid === 1) {
			temp = this.getStat(-1);
			rval = 0;

			for (i = 0; i < temp.length; i += 1) {
				switch (temp[i][0]) {
				case id: // plus one handed dmg
				case id + 2: // plus two handed dmg
					// There are 2 occurrences of min/max if the item has +damage. Total damage is the sum of both.
					// First occurrence is +damage, second is base item damage.

					if (rval) { // First occurence stored, return if the second one exists
						return rval;
					}

					if (this.getStat(temp[i][0]) > 0 && this.getStat(temp[i][0]) > temp[i][2]) {
						rval = temp[i][2]; // Store the potential +dmg value
					}

					break;
				}
			}

			return 0;
		}

		break;
	case 31: // plusdefense
		if (subid === 0) {
			if ([0, 1].indexOf(this.mode) < 0) {
				break;
			}

			switch (this.itemType) {
			case 58: // jewel
			case 82: // charms
			case 83:
			case 84:
				// defense is the same as plusdefense for these items
				return this.getStat(31);
			}

			if (!this.desc) {
				this.desc = this.description;
			}

			temp = this.desc.split("\n");
			regex = new RegExp("\\+\\d+ " + getLocaleString(3481).replace(/^\s+|\s+$/g, ""));

			for (i = 0; i < temp.length; i += 1) {
				if (temp[i].match(regex, "i")) {
					return parseInt(temp[i].replace(/ÿc[0-9!"+<;.*]/, ""), 10);
				}
			}

			return 0;
		}

		break;
	case 57:
		if (subid === 1) {
			return Math.round(this.getStat(57) * this.getStat(59) / 256);
		}

		break;
	case 83: // itemaddclassskills
		if (subid === undefined) {
			for (i = 0; i < 7; i += 1) {
				if (this.getStat(83, i)) {
					return this.getStat(83, i);
				}
			}

			return 0;
		}

		break;
	case 188: // itemaddskilltab
		if (subid === undefined) {
			temp = [0, 1, 2, 8, 9, 10, 16, 17, 18, 24, 25, 26, 32, 33, 34, 40, 41, 42, 48, 49, 50];

			for (i = 0; i < temp.length; i += 1) {
				if (this.getStat(188, temp[i])) {
					return this.getStat(188, temp[i]);
				}
			}

			return 0;
		}

		break;
	case 195: // itemskillonattack
	case 196: // itemskillonkill
	case 197: // itemskillondeath
	case 198: // itemskillonhit
	case 199: // itemskillonlevelup
	case 201: // itemskillongethit
	case 204: // itemchargedskill
		if (subid === 1) {
			temp = this.getStat(-2);

			if (temp.hasOwnProperty(id)) {
				if (temp[id] instanceof Array) {
					for (i = 0; i < temp[id].length; i += 1) {
						if (temp[id][i] !== undefined && temp[id][i].skill !== undefined) { // fix reference to undefined property temp[id][i].skill.
							return temp[id][i].skill;
						}
					}
				} else {
					return temp[id].skill;
				}
			}

			return 0;
		}

		if (subid === 2) {
			temp = this.getStat(-2);

			if (temp.hasOwnProperty(id)) {
				if (temp[id] instanceof Array) {
					for (i = 0; i < temp[id].length; i += 1) {
						if (temp[id][i] !== undefined) {
							return temp[id][i].level;
						}
					}
				} else {
					return temp[id].level;
				}
			}

			return 0;
		}

		break;
	case 216: // itemhpperlevel (for example Fortitude with hp per lvl can be defined now with 1.5)
		return this.getStat(216) / 2048;
	}

	if (this.getFlag(0x04000000)) { // Runeword
		switch (id) {
		case 16: // enhanceddefense
			if ([0, 1].indexOf(this.mode) < 0) {
				break;
			}

			this.desc === undefined && (this.desc = this.description);

			temp = !!this.desc ? this.desc.split("\n") : "";

			for (i = 0; i < temp.length; i += 1) {
				if (temp[i].match(getLocaleString(3520).replace(/^\s+|\s+$/g, ""), "i")) {
					return parseInt(temp[i].replace(/ÿc[0-9!"+<;.*]/, ""), 10);
				}
			}

			return 0;
		case 18: // enhanceddamage
			if ([0, 1].indexOf(this.mode) < 0) {
				break;
			}

			this.desc === undefined && (this.desc = this.description);

			temp = !!this.desc ? this.desc.split("\n") : "";

			for (i = 0; i < temp.length; i += 1) {
				if (temp[i].match(getLocaleString(10038).replace(/^\s+|\s+$/g, ""), "i")) {
					return parseInt(temp[i].replace(/ÿc[0-9!"+<;.*]/, ""), 10);
				}
			}

			return 0;
		}
	}

	if (subid === undefined) {
		return this.getStat(id);
	}

	return this.getStat(id, subid);
};

Unit.prototype.__defineGetter__('attackable', function () {
	if (this === undefined) return false;
    if (this.type === sdk.unittype.Player && getPlayerFlag(me.gid, this.gid, 8) && this.mode !== 17 && this.mode !== 0) {
        return true;
    }
    // Dead monster
    if (this.hp === 0 || this.mode === sdk.units.monsters.monstermode.Death || this.mode === sdk.units.monsters.monstermode.Dead) {
        return false;
    }
    // Friendly monster/NPC
    if (this.getStat(172) === 2) return false;

    // catapults were returning a level of 0 and hanging up clear scripts
    if (this.charlvl < 1) return false;

    // neverCount base stat - hydras, traps etc.
    if (getBaseStat("monstats", this.classid, "neverCount")) return false;

    // Monsters that are in flight
    if ([110, 111, 112, 113, 144, 608].includes(this.classid) && this.mode === 8) return false;

    // Monsters that are Burrowed/Submerged
    if ([68, 69, 70, 71, 72, 258, 258, 259, 260, 261, 262, 263].includes(this.classid) && this.mode === 14) return false;

    return [sdk.monsters.ThroneBaal, 179].indexOf(this.classid) <= -1;
});

Unit.prototype.__defineGetter__('curseable', function () {
    // must be player or monster
    if (this === undefined || this.type > 1) return false;

    // attract can't be overridden
	if (this.getState(sdk.states.Attract)) return false;

	// "Possessed"
	if (!!this.name && !!this.name.includes(getLocaleString(11086))) return false;

    if (this.type === sdk.unittype.Player && getPlayerFlag(me.gid, this.gid, 8) && this.mode !== 17 && this.mode !== 0) {
        return true;
    }
    // Dead monster
    if (this.hp === 0 || this.mode === sdk.units.monsters.monstermode.Death || this.mode === sdk.units.monsters.monstermode.Dead) {
        return false;
    }
    // Friendly monster/NPC
    if (this.getStat(172) === 2) return false;
    
    // catapults were returning a level of 0 and hanging up clear scripts
    if (this.charlvl < 1) return false;

    // Monsters that are in flight
    if ([110, 111, 112, 113, 144, 608].includes(this.classid) && this.mode === 8) return false;

    // Monsters that are Burrowed/Submerged
    if ([68, 69, 70, 71, 72, 258, 258, 259, 260, 261, 262, 263].includes(this.classid) && this.mode === 14) return false;

    return [
    		sdk.monsters.Turret1, sdk.monsters.Turret2, sdk.monsters.Turret3, sdk.monsters.SandMaggotEgg, sdk.monsters.RockWormEgg, sdk.monsters.DevourerEgg, sdk.monsters.GiantLampreyEgg,
    		sdk.monsters.WorldKillerEgg1, sdk.monsters.WorldKillerEgg2, sdk.monsters.FoulCrowNest, sdk.monsters.BlackVultureNest, sdk.monsters.BloodHawkNest, sdk.monsters.BloodHookNest,
    		sdk.monsters.BloodWingNest, sdk.monsters.CloudStalkerNest, sdk.monsters.FeederNest, sdk.monsters.SuckerNest, sdk.monsters.MummyGenerator, sdk.monsters.WaterWatcherLimb, sdk.monsters.WaterWatcherHead,
    		sdk.monsters.Flavie, sdk.monsters.GargoyleTrap, sdk.monsters.LightningSpire, sdk.monsters.FireTower, sdk.monsters.BarricadeDoor1, sdk.monsters.BarricadeDoor2, sdk.monsters.PrisonDoor, sdk.monsters.BarricadeTower,
    		sdk.monsters.CatapultS, sdk.monsters.CatapultE, sdk.monsters.CatapultSiege, sdk.monsters.CatapultW, sdk.monsters.BarricadeWall1, sdk.monsters.BarricadeWall2, sdk.monsters.Tentacle1, sdk.monsters.Tentacle2,
    		sdk.monsters.Tentacle3, sdk.monsters.Tentacle4, sdk.monsters.Tentacle5, sdk.monsters.Hut, sdk.monsters.ThroneBaal, sdk.monsters.Cow
    	].indexOf(this.classid) === -1;
});

Unit.prototype.__defineGetter__('scareable', function () {
    return this.curseable && !(this.spectype & 0x7);
});

// D2BS Improvements @Jaenster
(function (global, print) {
	global['console'] = global['console'] || (function () {
		const console = {};

		const argMap = el => typeof el === 'object' && el /*not null */ && JSON.stringify(el) || el;

		console.log = function (...args) {
			// use call to avoid type errors
			print.call(null, args.map(argMap).join(','));
		};

		console.printDebug = true;
		console.debug = function (...args) {
			if (console.printDebug) {
				const stack = new Error().stack.match(/[^\r\n]+/g),
					filenameAndLine = stack && stack.length && stack[1].substr(stack[1].lastIndexOf('\\') + 1) || 'unknown:0';
				this.log('ÿc:[ÿc:' + filenameAndLine + 'ÿc:]ÿc0 ' + args.map(argMap).join(','));
			}
		};

		console.warn = console.debug;

		return console;

	})()

})([].filter.constructor('return this')(), print);

/**
 * @description Polyfill for setTimeout, as the version of d2bs isnt thread safe
 * @author Jaenster
 */

(function (global, _original) {
	var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	}));
	var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
	    Object.defineProperty(o, "default", { enumerable: true, value: v });
	}) : function(o, v) {
	    o["default"] = v;
	});
	var __importStar = (this && this.__importStar) || function (mod) {
	    if (mod && mod.__esModule) return mod;
	    var result = {};
	    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
	    __setModuleDefault(result, mod);
	    return result;
	};
	var Worker = __importStar(require("../../modules/Worker"));
	global['_setTimeout'] = _original;
	/**
         * @param {function} cb
         * @param {number} time
         * @param args
         * @constructor
         */
        function Timer(cb, time, args) {
            var _this = this;
            if (time === void 0) { time = 0; }
            if (args === void 0) { args = []; }
            Timer.instances.push(this);
            Worker.runInBackground['__setTimeout__' + (Timer.counter++)] = (function (startTick) { return function () {
                var finished = getTickCount() - startTick >= time;
                if (finished) {
                    var index = Timer.instances.indexOf(_this);
                    // only if not removed from the time list
                    if (index > -1) {
                        Timer.instances.splice(index, 1);
                        cb.apply(undefined, args);
                    }
                }
                return !finished;
            }; })(getTickCount());
        }
        Timer.instances = [];
        Timer.counter = 0;
        global['setTimeout'] = function (cb, time) {
            if (time === void 0) { time = 0; }
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            if (typeof cb === 'string') {
                console.debug('Warning: Do not use raw code @ setTimeout and does not support lexical scoping');
                cb = [].filter.constructor(cb);
            }
            if (typeof cb !== 'function')
                throw new TypeError('setTimeout callback needs to be a function');
            return new Timer(cb, time, args);
        };
        /**
         *
         * @param {Timer} timer
         */
        global['clearTimeout'] = function (timer) {
            var index = Timer.instances.indexOf(timer);
            if (index > -1) {
                Timer.instances.splice(index, 1);
            }
        };
	// getScript(true).name.toString() !== 'default.dbj' && setTimeout(function () {/* test code*/}, 1000)
})([].filter.constructor('return this')(), setTimeout);

(function (global, original) {
	let firstRun = true;
	global['getUnit'] = function (...args) {
		const test = original(1);
		// Stupid reference thing

		if (firstRun) {
			delay(1000);
			firstRun = false;
		}

		let [first] = args, second = args.length >= 2 ? args[1] : undefined;

		const ret = original.apply(this, args);

		// deal with fucking bug
		if (first === 1 && typeof second === 'string' && ret && ((me.act === 1 && ret.classid === 149) || me.act === 2 && ret.classid === 268)) {
			return null;
		}

		return original.apply(this, args);
	}
})([].filter.constructor('return this')(), getUnit);

if (!Object.setPrototypeOf) {
    // Only works in Chrome and FireFox, does not work in IE:
    Object.defineProperty(Object.prototype, 'setPrototypeOf', {
        value: function (obj, proto) {
            // @ts-ignore
            if (obj.__proto__) {
                // @ts-ignore
                obj.__proto__ = proto;
                return obj;
            }
            else {
                // If you want to return prototype of Object.create(null):
                var Fn = function () {
                    for (var key in obj) {
                        Object.defineProperty(this, key, {
                            value: obj[key],
                        });
                    }
                };
                Fn.prototype = proto;
                return new Fn();
            }
        },
        enumerable: false,
    });
}

if (!Object.values) {
    Object.values = function (source) {
        return Object.keys(source).map(function (k) { return source[k]; });
    };
}

if (!Object.entries) {
    Object.entries = function (source) {
        return Object.keys(source).map(function (k) { return [k, source[k]]; });
    };
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#polyfill
// @ts-ignore
if (!Object.is) {
    Object.defineProperty(Object, "is", {
        value: function (x, y) {
            // SameValue algorithm
            if (x === y) {
                // return true if x and y are not 0, OR
                // if x and y are both 0 of the same sign.
                // This checks for cases 1 and 2 above.
                return x !== 0 || 1 / x === 1 / y;
            }
            else {
                // return true if both x AND y evaluate to NaN.
                // The only possibility for a variable to not be strictly equal to itself
                // is when that variable evaluates to NaN (example: Number.NaN, 0/0, NaN).
                // This checks for case 3.
                return x !== x && y !== y;
            }
        }
    });
}

// if (!Object.fromEntries) {
//   Object.defineProperty(Object, 'fromEntries', {
//     value: function (entries) {
//       if (!entries /*|| !entries[Symbol.iterator]*/) { throw new Error('Object.fromEntries() requires a single iterable argument'); }

//       const o = {};

//       Object.keys(entries).forEach((key) => {
//         const [k, v] = entries[key];

//         o[k] = v;
//       });

//       return o;
//     },
//   });
// }

// // filter an object
// Object.filter = function (obj, predicate) {
// 	return Object.fromEntries(Object.entries(obj).filter(predicate));
// };

// https://stackoverflow.com/questions/7837456/how-to-compare-arrays-in-javascript
if (!Array.prototype.equals) {
	// Warn if overriding existing method
    !!Array.prototype.equals && console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
	// attach the .equals method to Array's prototype to call it on any array
	Array.prototype.equals = function (array) {
	    // if the other array is a falsy value, return
	    if (!array) return false;

	    // compare lengths - can save a lot of time 
	    if (this.length != array.length) return false;
	    
	    // call basic sort method, (my addition as I don't care if its the same order just if it contains the same values)
	    this.sort();
	    array.sort();

	    for (let i = 0, l = this.length; i < l; i++) {
	        // Check if we have nested arrays
	        if (this[i] instanceof Array && array[i] instanceof Array) {
	            // recurse into the nested arrays
	            if (!this[i].equals(array[i])) return false;
	        } else if (this[i] != array[i]) {
	            // Warning - two different object instances will never be equal: {x:20} != {x:20}
	            return false;   
	        }
	    }
	    return true;
	};
	// Hide method from for-in loops
	Object.defineProperty(Array.prototype, "equals", {enumerable: false});
}
