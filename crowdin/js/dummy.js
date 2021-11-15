var fs = require("fs");
const shell = require('shelljs');
var AdmZip = require("adm-zip");
const PROVIDER_CODE = ["es-ES", "ja", "es-MX", "no", "pt", "pt", "ru", "sv"];
const APP_CODE = ["es", "ja-JP", "es-LA", "nb-NO", "pt-BR", "pt-PT", "ru-RU", "sv-SE"];

fs.readFile("/Users/smuthusubramanian/Downloads/fd_helpkit_trans1.zip", function(err, data) {
    if (err) throw err;
    // JSZip.loadAsync(data).then(function (zip) {
        var zipFile = new AdmZip(data);
        var zipEntries = zipFile.getEntries();
        shell.exec("chmod +x yaml_merge.sh");

        // zipEntries.forEach(function (zipEntry) {
        //     console.log(zipEntry.toString())
        //     // console.log(zipEntry.getData().toString("utf8")); // outputs zip entries information
        // });

        // // Get list of all filenames
        zipEntries.forEach(function (entry, indx) {
            if(indx % 2 == 0) return;
            zipFile.extractEntryTo(entry.entryName, './tmp', false, true);
            let destfilename = entry.entryName.split("/")[0];
            if(PROVIDER_CODE.indexOf(destfilename) > -1) {
                destfilename = APP_CODE[PROVIDER_CODE.indexOf(destfilename)];
            };
            shell.exec(`./yaml_merge.sh ./tmp/${entry.entryName.split("/")[1]} ${destfilename}`);
        });

        // // This returns two entries for a file like 'ar/' and 'ar/ar-SA.yml". So, removing the first one.
        // var fileEntries = zipEntries.filter((entry, indx)=> indx % 2 != 0);

        // console.log(fileEntries);

        // // Iterate over each file to merge with the source file
        // shell.exec("chmod +x yaml_merge.sh");
        // fileNamesList.map(sourcename=> {
        //     console.log("Surce::", sourcename);
        //     zip.file(`${sourcename}`).async("string").then(content=> {
        //         let destfilename = sourcename.split("/")[0];
        //         if(PROVIDER_CODE.indexOf(destfilename) > -1) {
        //             destfilename = APP_CODE[PROVIDER_CODE.indexOf(destfilename)];
        //         };
        //         // console.log(destfilename);
        //         shell.exec(`printf "%s" "${content}" > "new.yaml"`);
        //         shell.exec(`./yaml_merge.sh new.yaml ${destfilename}`)
        //       })
        // })

        // zip.file("ar/ar-SA.yml").async("string").then(content=> {
        //     console.log(content);
        // })
        // zip.folder("Old Freshdesk for Mint (translations)").forEach(function(relativePath, file) {
        //     console.log(relativePath);
        // })
    // })
});
