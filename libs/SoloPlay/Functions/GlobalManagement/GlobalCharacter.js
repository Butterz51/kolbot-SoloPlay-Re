/**
 *  @filename    GlobalCharacter.js
 *  @author      Butterz
 *  @desc        Retrieves global character information, manages character naming, and handles related operations.
 * 
 */

includeIfNotIncluded("oog/D2Bot.js");
includeIfNotIncluded("SoloPlay/Tools/Developer.js");

function getGlobalCharacter () {
  const SaveLocation = "logs/Kolbot-SoloPlay/GlobalCharacter.json";
  const Character = (Developer.GlobalSettings.Name);

  const CharData = {
    GlobalData: { Character_Name: "", Number: 0 },

    // Create a new Json file.
    create: function () {
      FileTools.writeText(SaveLocation, JSON.stringify(this.GlobalData));
    },

    // Read data from the Json file and return the data object.
    read: function () {
      return JSON.parse(FileTools.readText(SaveLocation));
    },

    // Read data from the Json file and return the name info.
    readName: function () {
      return JSON.parse(FileTools.readText(SaveLocation)).Character_Name;
    },

    // Write a data object to the Json file.
    write: function (obj) {
      FileTools.writeText(SaveLocation, JSON.stringify(obj));
    },

    /**
     * Error Checks:
     * - Console message.
     * - Invalid character name (avoid spaces, numbers, use dashes/underscores).
     * - Character name must be at least 2 characters long.
     * - Character name can't exceed 15 characters.
     */
    printErrorAndStop: function (message) {
      const fullMessage = message + ' Please create a valid name within the "Developer.js" file.';
      D2Bot.printToConsole(fullMessage, sdk.colors.D2Bot.Red);
      D2Bot.stop();
    },

    errorChecks: function (check1, check2, check3) {
      const obj = this.read();
      const minNameLength = 2;
      const maxNameLength = 15;

      if (check1 && !/^[a-zA-Z]*[-_a-zA-Z]*[a-zA-Z]$/.test(obj.Character_Name)) {
          this.printErrorAndStop('Invalid character name. Names can contain one dash (-) or one underscore (_), except as the first or last character. Avoid spaces and numbers.');
      }

      if (check2 && obj.Character_Name.length < minNameLength) {
          this.printErrorAndStop('The character name is too short. Character names must be at least 2 characters long.');
      }

      if (check3 && obj.Character_Name.length > maxNameLength) {
          this.printErrorAndStop('The character name exceeds the limit of 15 characters.');
      }
    },

    // Set next character name - increase alphabet in the Json file.
    nextChar: function () {
      const alphabet = "abcdefghijklmnopqrstuvwxyz";
      const obj = this.read();
      let num = obj.Number;
  
      // Convert the number to the corresponding letter(s)
      let sequence = "";
      do {
        num -= 1;
        sequence = alphabet[num % 26] + sequence;
        num = Math.floor(num / 26);
      } while (num > 0);
  
      obj.Number += 1;
      obj.Character_Name = Character + sequence;
      this.errorChecks(true, true, true);

      // Update GlobalData with new Number and Character_Name values from 'obj'
      this.write(Object.assign(this.GlobalData, { Number: obj.Number, Character_Name: obj.Character_Name }));
  
      return obj.Character_Name;
    },

    // Creates a folder for Kolbot-SoloPlay logs if it doesn't exist.
    createFolder: function () {
      const folderPath = "logs/Kolbot-SoloPlay";
      if (!FileTools.exists(folderPath)) {
        print(
          sdk.colors.DarkGreen + "Global Settings" + 
          sdk.colors.White + " :: " + 
          sdk.colors.Blue + "Creating Kolbot-SoloPlay Folder."
        );
        dopen("logs").create("Kolbot-SoloPlay");
      }
    },

    /**
     * Print a line of text with specified styling/colors.
     * @param {string} message - The message to be printed.
     * @param {string} color1 - The first color for styling.
     * @param {string} color2 - The second color for styling.
     * @param {string} color3 - The third color for styling.
     */
    formattedPrint: function (message, color1, color2, color3) {
      const formattedMessage =
        color1 + "Global Settings" +
        color2 + " :: " +
        color3 + message;
      print(formattedMessage);
    },

    // Initializes the character data.
    initialize: function () {
      // If file exists check for valid info.
      if (FileTools.exists(SaveLocation)) {
        try {
          let jsonObj = this.read();

          // Return filename containing correct info.
          if (Character && jsonObj.Character_Name && jsonObj.Character_Name.match(Character)) {
            delay(500);
            this.formattedPrint("Successor In The Alphabetical Sequence.", sdk.colors.DarkGreen, sdk.colors.White, sdk.colors.Blue);
            delay(250);
            this.nextChar();
            delay(500);

            return this.readName();
          }
                
          // File exists but doesn't contain valid info - Remaking .json file.
          if (Character && jsonObj.Character_Name !== Character) {
            this.formattedPrint("Removed The Saved File Location.", sdk.colors.DarkGreen, sdk.colors.White, sdk.colors.Blue);
            FileTools.remove(SaveLocation);
            delay(800);

            return this.initialize();
          }
        } catch (e) {
          print(e);
        }
      } else {
        // Check if main folder exist.
        this.createFolder();
        delay(250);
        // Creating a new .json file.
        this.formattedPrint("Creating New Character Name.", sdk.colors.DarkGreen, sdk.colors.White, sdk.colors.Blue);
        this.create();
        delay(500);
        this.nextChar();
        delay(3000);

        return this.readName();
      }
      // Check if main folder exist.
      this.createFolder();

      return this.create();
    }
  };

  // Print the startup message.
  print(sdk.colors.DarkGreen + "Initializing " + sdk.colors.White + " :: " + sdk.colors.DarkGreen + "Global Settings.");
  CharData.initialize();

  return CharData.readName();
};
