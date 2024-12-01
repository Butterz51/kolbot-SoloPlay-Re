/**
 * @filename    IPHunter.js
 * @authors     kolton, Mercoory, Butterz
 * @description Searches for target IPs and stops upon detecting the desired server.
 * @changes     
 *     2020.01 - Enhanced alert mechanisms (beeps and movements) on IP detection.
 *                Added overlay messages with countdown. Logged events to the D2Bot console.
 *     2023.08 - Code refactoring: improved script layout, embedded settings 
 *                (IP Search, Functionalities, Messages). Dependencies: SoloPlay.
 */

function IPHunter () {
  /** IP Search Configuration **/
  let findIP = []; // Desired IPs. Example: [165, 201, 64]

  /** Functional Settings **/
  const MaxGameTime = 999999990; // User-configurable maximum game time in milliseconds. Default: 999999990 = 11 days, 13 hours, 46 minutes, and 40 seconds.
  let Timer = false; // Disable the Timer feature when set to 'false'.
  let GameLength = 3; // Duration (in minutes) to stay in-game if target IP isn't found.
  let Beeps = false; // Effective if windows sounds are active.
  const ip = Number(me.gameserverip.split(".")[3]);

  /** Messaging Settings **/
  const OverHeadMsg = sdk.colors.Orange + "IP Located! - [ " + sdk.colors.NeonGreen + ip + sdk.colors.Orange + " ]";
  const FoundIPmsg = "IPHunter: Detected IP Address - [" + ip + "]. Game Details: Name - " + me.gamename + ", Password - " + me.gamepassword;
  const D2soj = "/w *D2soj " + ".loggame " + ip + ":" + me.profile + ":" + me.ladder + ":" + me.gamename + ":" + me.gamepassword + ":" + Developer.webSiteReport.name;

  /** Helper Functions **/
  function beepMessage (count) {
    return Beeps ? " " + sdk.colors.grey + count + sdk.colors.Purple + " beep(s) left." : "";
  }

  function countdown () {
    for (let i = 12; i > 0; i--) {
        me.overhead(OverHeadMsg + beepMessage(i-1));
        
        if (Beeps) {
            beep();
        }
        
        delay(250);
    }
  }
  
  /** Main Script Logic **/
  if (Developer.webSiteReport.enabled) {
    say("/w *D2SOJ " + ".logip " + ip + ":" + me.ladder, true);
    print(sdk.colors.Blue + "Reported to *D2soj");
  }

  if (findIP.includes(ip) || Config.IPHunter.IPList.includes(ip)) {
    load("threads/antiidle.js");
    D2Bot.printToConsole(FoundIPmsg, sdk.colors.D2Bot.DarkGold);
    console.log(FoundIPmsg);

    if (Developer.webSiteReport.enabled && Developer.webSiteReport.name.length > 0) {
      say(D2soj, true);
    }

    Town.goToTown(4);
    me.overhead(OverHeadMsg);
    me.maxgametime = MaxGameTime;
    countdown();

    while (true) {
      if (Beeps) {
        countdown();
      }

      me.overhead(OverHeadMsg);
      try {
        if (Developer.webSiteReport.enabled && Developer.webSiteReport.name.length > 0) {
          say(D2soj, true);
        }

        Town.move("waypoint");
        Town.move("stash");
      } catch (e) {
        // Handle potential desynchronization-related failures ensuring game continuity.
      }

      for (let i = (12 * 60); i > 0; i--) {
        me.overhead(OverHeadMsg + " " + sdk.colors.Purple + "Next action in: " + sdk.colors.Gray + i + " " + sdk.colors.Purple + "sec.");
        delay(1000);
      }
    }
  }

  if (Timer) {
    for (let i = (GameLength * 60); i > 0; i--) {
      me.overhead(sdk.colors.red + "Undetected IP : [" + (ip) + "] Next Attempt in: " + sdk.colors.grey + i + sdk.colors.red + " sec");
      delay(1000);
    }
  }

  return true;
}
