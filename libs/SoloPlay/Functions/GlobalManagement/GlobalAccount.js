/**
 *  @filename    GlobalAccount.js
 *  @author      Butterz
 *  @desc        Creates global account names.
 *
 */

includeIfNotIncluded("SoloPlay/Tools/Developer.js");

  function getGlobalAccount () {
    const SaveLocation = "logs/Kolbot-SoloPlay/GlobalAccount.json";
    const AccountName = (Developer.GlobalSettings.Account);

    const AccountData = {
      GlobalData: { Account: "", Number: 0 },

      // Create a new Json file.
      create: function () {
        FileTools.writeText(SaveLocation, JSON.stringify(this.GlobalData));
      },

      // Read data from the Json file and return the data object.
      read: function () {
        return JSON.parse(FileTools.readText(SaveLocation));
      },

      // Read data from the Json file and return the account info.
      readAcc: function () {
        return JSON.parse(FileTools.readText(SaveLocation)).Account;
      },

      // Write a data object to the Json file.
      write: function (obj) {
        FileTools.writeText(SaveLocation, JSON.stringify(obj));
      },

      // Set next account - increase account number in the Json file.
      nextAccount: function () {
        let obj = this.read();
        obj.Number += 1;
        obj.Account = AccountName + obj.Number;
        this.write(Object.assign(this.GlobalData, { Number: obj.Number, Account: obj.Account }));

        return obj.Account;
      },

      // Used to retrieve the account number for global characters.
      getNumber: function () {
        return this.read().Number;
      },

      createFolder: function () {
        const folderPath = "logs/Kolbot-SoloPlay";
        if (!FileTools.exists(folderPath)) {
          print(sdk.colors.DarkGreen + "Global Settings" + sdk.colors.White + " :: " + sdk.colors.Blue + "Creating Kolbot-SoloPlay Folder.");
          dopen("logs").create("Kolbot-SoloPlay");
        }
      },

      initialize: function () {
        // If file exists check for valid info.
        if (FileTools.exists(SaveLocation)) {
          try {
            let jsonObj = this.read();

            // Return filename containing correct info.
            if (AccountName && jsonObj.Account && jsonObj.Account.match(AccountName)) {
              delay(500);
              print(sdk.colors.DarkGreen + "Global Settings" + sdk.colors.White + " :: " + sdk.colors.Blue + "Next Sequential Number.");
              delay(250);
              this.nextAccount();
              delay(500);

              return this.readAcc();
            }
            
            // File exists but doesn't contain valid info - Remaking .json file.
            if (AccountName && jsonObj.Account !== AccountName) {
              print(sdk.colors.DarkGreen + "Global Settings" + sdk.colors.White + " :: " + sdk.colors.Red + "Removed Save Location.");
              FileTools.remove(SaveLocation);
              delay(800);

              return this.initialize();
            }
          } catch (e) {
            print(e);
          }
        } else {
          // Check to see if main folder exist.
          this.createFolder();
          delay(500);
          // Creating a new .json file.
          print(sdk.colors.DarkGreen + "Global Settings" + sdk.colors.White + " :: " + sdk.colors.Blue + "Creating New Account.");
          this.create();
          delay(500);
          this.nextAccount();
          delay(5000);

          return this.readAcc();
        }
        return this.create();
      }
    };

    print(sdk.colors.DarkGreen + "Initializing " + sdk.colors.White + " :: " + sdk.colors.DarkGreen + "Global Settings.");
    AccountData.initialize();

    return AccountData.readAcc();
  };

  module.exports = getGlobalAccount;
