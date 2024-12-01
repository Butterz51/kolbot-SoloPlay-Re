/**
*  @filename    Sorceress.MFBuild.js
*  @author      isid0re, theBGuy, Butterz
*  @desc        Blizzard + Fireball & Meteor + Glacial Spike (based final build)
*
*/


(function (module) {
  module.exports = (function () {
    const build = {
      caster: true,
      skillstab: sdk.skills.tabs.Cold,
      wantedskills: [sdk.skills.Blizzard, sdk.skills.FireBall, sdk.skills.ColdMastery],
      usefulskills: [sdk.skills.GlacialSpike, sdk.skills.Meteor, sdk.skills.FireMastery, sdk.skills.StaticField],
      precastSkills: [sdk.skills.FrozenArmor],
      usefulStats: [sdk.stats.PassiveColdPierce, sdk.stats.PassiveColdMastery, sdk.stats.PassiveFireMastery, sdk.stats.PassiveFirePierce],
      wantedMerc: MercData[sdk.skills.HolyFreeze],
      stats: [
        ["strength", 156], ["dexterity", 204], ["vitality", "all"]
        // MF 395 Min - 405 Max
        // Str = 110 after respec
      ],
      skills: [
        [sdk.skills.Warmth, 1],
        [sdk.skills.FrozenArmor, 1],
        [sdk.skills.StaticField, 1],
        [sdk.skills.Teleport, 1],
        [sdk.skills.Meteor, 1],
        [sdk.skills.FireMastery, 1, false],
        [sdk.skills.ColdMastery, 1, false],
        [sdk.skills.FireBall, 20],
        [sdk.skills.Blizzard, 20],
        [sdk.skills.GlacialSpike, 20], // lvl 75 w/o quest skills pts
        [sdk.skills.ColdMastery, 8],
        [sdk.skills.FireMastery, 4],
        [sdk.skills.FireBolt, 7],
        [sdk.skills.Meteor, 20],
      ],

      charms: {
        ResLife: {
          max: 2,
          have: [],
          classid: sdk.items.GrandCharm,
          stats: function (check) {
            return (!check.unique && check.classid === this.classid && check.allRes === 15 && check.getStat(sdk.stats.MaxHp) >= 5);
          }
        },

        ResMf: {
          max: 1,
          have: [],
          classid: sdk.items.SmallCharm,
          stats: function (check) {
            return (!check.unique && check.classid === this.classid && check.allRes === 5 && check.getStat(sdk.stats.MagicBonus) === 7);
          }
        },

        ResFire: {
          max: 5,
          have: [],
          classid: sdk.items.SmallCharm,
          stats: function (check) {
            return (!check.unique && check.classid === this.classid && check.getStat(sdk.stats.FireResist) === 11 && check.getStat(sdk.stats.Strength) === 2);
          }
        },

        ResPoison: {
          max: 5,
          have: [],
          classid: sdk.items.SmallCharm,
          stats: function (check) {
            return (!check.unique && check.classid === this.classid && check.getStat(sdk.stats.PoisonResist) === 11 && check.getStat(sdk.stats.Strength) === 2);
          }
        },

        ResCold: {
          max: 2,
          have: [],
          classid: sdk.items.SmallCharm,
          stats: function (check) {
            return (!check.unique && check.classid === this.classid && check.getStat(sdk.stats.ColdResist) === 11 && check.getStat(sdk.stats.Strength) === 2);
          }
        },

        SkillerFire: {
          max: 1,
          have: [],
          classid: sdk.items.GrandCharm,
          stats: function (check) {
            return (!check.unique && check.classid === this.classid && check.getStat(sdk.stats.AddSkillTab, sdk.skills.tabs.Fire) === 1
              && check.getStat(sdk.stats.FHR) === 12);
          }
        },
      },

      AutoBuildTemplate: {
        1:	{
          Update: function () {
            Config.AttackSkill = [-1, sdk.skills.Blizzard, sdk.skills.FireBall, sdk.skills.Blizzard, sdk.skills.FireBall, sdk.skills.Meteor, sdk.skills.GlacialSpike];
            Config.LowManaSkill = [-1, -1];
            Config.SkipImmune = [];
            Config.BeltColumn = ["hp", "mp", "rv", "rv"];
            Config.HPBuffer = 0;
            Config.MPBuffer = 0;
          }
        },
      },

      respec: function () {
        return me.haveAll([
          { name: sdk.locale.items.TalRashasBelt, quality: sdk.items.quality.Set },
          { name: sdk.locale.items.TalRashasAmulet, quality: sdk.items.quality.Set },
          { name: sdk.locale.items.TalRashasArmor, quality: sdk.items.quality.Set },
          { name: sdk.locale.items.BattleBoots, quality: sdk.items.quality.Unique },
          { name: sdk.locale.items.Shako, quality: sdk.items.quality.Unique },
          { name: sdk.locale.items.SwirlingCrystal, quality: sdk.items.quality.Unique },
          // Charms
          { name: sdk.locale.items.SmallCharm, quality: sdk.items.quality.Magic, stats: sdk.stats.FireResist && sdk.stats.Strength}, // RubySmallCharmofStrength
          { name: sdk.locale.items.SmallCharm, quality: sdk.items.quality.Magic, stats: sdk.stats.PoisonResist && sdk.stats.Strength}, // EmeraldSmallCharmofStrength
          { name: sdk.locale.items.SmallCharm, quality: sdk.items.quality.Magic, stats: sdk.stats.ColdResist && sdk.stats.Strength}, // SapphireSmallCharmofStrength
        ]);
      },

      active: function () {
        return this.respec() && me.getSkill(sdk.skills.FireBall, sdk.skills.subindex.HardPoints) === 20 && me.getSkill(sdk.skills.Blizzard, sdk.skills.subindex.HardPoints) === 20;
      },
    };

    // autoequip final gear
    let finalGear = [
      // Character Gear:
      // Weapon - The Oculus
      "[Name] == SwirlingCrystal && [Quality] == Unique # [SorceressSkills] >= 3 && [FireResist] >= 20 # [Tier] == 100000",
      // Helmet - Shako (Harlequin Crest)
      "[Name] == Shako && [Quality] == Unique && [Flag] != Ethereal # [Defense] >= 98 && [ItemMagicBonus] == 50 # [Tier] == TierScore(Item, 100000)",
      // Final Belt - Tal Rasha's Fine-Spun Cloth
      "[Name] == MeshBelt && [Quality] == Set && [Flag] != Ethereal # [Defense] >= 35 && [ItemMagicBonus] == 15 # [Tier] == TierScore(Item, 100000)",
      // Belt - Tal Rasha's Fine-Spun Cloth
      "[Name] == MeshBelt && [Quality] == Set && [Flag] != Ethereal # [Defense] >= 35 && ([ItemMagicBonus] >= 10 || [ItemMagicBonus] <= 14) # [Tier] == TierScore(Item, 50000)",
      // Final Boots - War Traveler
      "[Name] == BattleBoots && [Quality] == Unique && [Flag] != Ethereal # [EnhancedDefense] >= 150 && [ItemMagicBonus] == 50 # [Tier] == TierScore(Item, 100000)",
      // Boots - War Traveler
      "[Name] == BattleBoots && [Quality] == Unique && [Flag] != Ethereal # [EnhancedDefense] >= 150 && ([ItemMagicBonus] >= 30 || [ItemMagicBonus] <= 49) # [Tier] == TierScore(Item, 5000)",
      // Armor - Tal Rasha's Guardianship
      "[Name] == LacqueredPlate && [Quality] == Set # [Defense] >= 833 # [Tier] == 100000",
      // Final Shield - Spirit
      "[Name] == Monarch && [Flag] == Runeword # [FCR] == 35 && [MaxMana] >= 89 # [Tier] == TierScore(Item, 100000)",
      // Shield - Spirit
      "[Type] == Shield # [FCR] >= 25 && [MaxMana] >= 89 # [Tier] == TierScore(Item, 50000)",
      // Final Gloves - Chance Guards
      "[Name] == HeavyBracers && [Quality] == Unique && [Flag] != Ethereal # [EnhancedDefense] >= 20 && [ItemMagicBonus] == 40 # [Tier] == TierScore(Item, 100000)",
      // Chance Guards
      "[Name] == ChainGloves && [Quality] == Unique && [Flag] != Ethereal # [EnhancedDefense] >= 20 && ([ItemMagicBonus] >= 25 || [ItemMagicBonus] <= 39) # [Tier] == TierScore(Item, 80000)",

      // Jewelry
      // Amulet - Tals Ammy
      "[Name] == Amulet && [Quality] == Set # [lightresist] == 33 # [Tier] == 100000",
      // Final Rings - Fortuitous Ring of Fortune & Perfect Bul-Kathos' Wedding Band
      "[Type] == Ring && [Quality] == Magic # [ItemMagicBonus] == 40 # [Tier] == 100000",
      "[Name] == Ring && [Quality] == Unique # [MaxStamina] == 50 && [LifeLeech] == 5 # [Tier] == 100000",      
      // Ring - Bul-Kathos' Wedding Band & Nagelring
      "[Name] == Ring && [Quality] == Unique # [MaxStamina] == 50 && [LifeLeech] >= 3 # [Tier] == 90000",
      "[Type] == Ring && [Quality] == Unique # [ItemMagicBonus] >= 15 # [Tier] == TierScore(Item, 50000)",

      // Hand-Switch
      // Final CTA
      "[MinimumSockets] >= 5 && [Flag] == Runeword # [PlusSkillBattleCommand] >= 5 && [PlusSkillBattleOrders] >= 5 # [SecondaryTier] == TierScore(Item, 110000)",
      // CTA
      "[MinimumSockets] >= 5 && [Flag] == Runeword # [PlusSkillBattleCommand] >= 1 && [PlusSkillBattleOrders] >= 1 # [SecondaryTier] == 100000",
      // Final Shield - Spirit
      "[Name] == Monarch && [Flag] == Runeword # [FCR] >= 25 && [MaxMana] >= 89 # [SecondaryTier] == 100000",
      // Temporary Shield - 1+ all skill
      "[Type] == Shield # [ItemAllSkills] >= 1 # [SecondaryTier] == TierScore(Item, 40000)",
      // Spirit
      "[Type] == Shield # [FCR] >= 25 && [MaxMana] >= 89 # [SecondaryTier] == TierScore(Item, 50000)",

      // Merc Gear
      // Final Armor - Fortitude
      "[Type] == Armor && [Flag] == Runeword # [EnhancedDefense] == 200 && [EnhancedDamage] == 300 && [ColdResist]+[FireResist]+[LightResist]+[PoisonResist] == 120 # [MercTier] == 100000 + MercScore(Item)",
      // Armor - Fortitude
      "[Type] == Armor && [Flag] == Runeword # [EnhancedDefense] == 200 && [EnhancedDamage] == 300 && [ColdResist]+[FireResist]+[LightResist]+[PoisonResist] >= 100 # [MercTier] == 80000 + MercScore(Item)",
      // Final Helmet - Andy's
      "[Name] == DemonHead && [Quality] == Unique # [LifeLeech] == 10 && [Strength] == 30 && [EnhancedDefense] >= 100 # [MercTier] == 50000 + MercScore(Item)",
      // Helmet - Andy's
      "[Name] == DemonHead && [Quality] == Unique # [LifeLeech] >= 8 && [Strength] >= 25 && [EnhancedDefense] >= 100 # [MercTier] == 40000 + MercScore(Item)",
      // Final Weapon - Giant Thresher (Obedience)
      "[Name] == GiantThresher && [Class] == Elite && [Quality] == Normal && [Flag] == Ethereal && [Flag] == Runeword # [Defense] >= 200 && [FireResist] == 30 # [MercTier] == 100000 + MercScore(Item)",
      // Weapon - Giant Thresher (Obedience)
      "[Name] == GiantThresher && [Class] == Elite && [Quality] == Normal && [Flag] == Ethereal && [Flag] == Runeword # [Defense] >= 200 && [FireResist] >= 20 # [MercTier] == 50000 + MercScore(Item)",
    ];
    
    NTIP.buildList(finalGear);
    NTIP.buildFinalGear(finalGear);

    return build;
  })();
})(module);
