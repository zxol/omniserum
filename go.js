const fs = require("fs");
const XmlReader = require("xml-reader");

// load the db file into mem. we're using blocking functions because it's a one off script.
const rawFile = fs.readFileSync("~BundleArchives.db");
// find where the xml finishes and the data starts.
const endOfXmlSection = rawFile.indexOf("</FileSystem>") + 14;

// copy the two parts of the file into their own buffers.
const xml = Buffer.allocUnsafe(endOfXmlSection);
const db = Buffer.allocUnsafe(rawFile.length - endOfXmlSection);

rawFile.copy(xml, 0, 0, endOfXmlSection);
rawFile.copy(db, 0, endOfXmlSection, rawFile.length);

const reader = XmlReader.create();
reader.on("done", allXml => {
  const header = fs.readFileSync("header.wav");
  // dive into the top level xml DIR
  !fs.existsSync(`./omnisphere`) && fs.mkdirSync(`./omnisphere`);
  for (var topXmlNode of allXml.children) {
    // make folder
    const topLevelDir = topXmlNode.attributes.name
    !fs.existsSync(`./omnisphere/${topLevelDir}`) && fs.mkdirSync(`./omnisphere/${topLevelDir}`);
    // dive into the seperate wavetable DIRS
    for (var dirXmlNode of topXmlNode.children) {
      // make folder
      const midLevelDir = dirXmlNode.attributes.name
      !fs.existsSync(`./omnisphere/${topLevelDir}/${midLevelDir}`) && fs.mkdirSync(`./omnisphere/${topLevelDir}/${midLevelDir}`);
      // dive into each seperate wavetable
      for (var wavetableXmlNode of dirXmlNode.children.slice(0, 10000)) {
        // get the name of the wavetable from the xml
        const filename = wavetableXmlNode.attributes.name;
        console.log("\n-----");
        console.log(filename);
        console.log("-----");

        // initalize an array of buffers that will become our final wav file.
        const outFileBufferArray = [Buffer.from(header)];

        // dive into each wave of the wavetable, working with data now.
        for (var waveXmlNode of wavetableXmlNode.children) {
          if (waveXmlNode.attributes.size === "1048576") {
            // if xml entry is data not metadata
            const offset = parseInt(waveXmlNode.attributes.offset); // offset in bytes from xml
            console.log("wave starting offset: " + offset);

            // read off a single cycle from db
            // the 4096 samples are stored in 32 bit signed ints, little endian, which means 4 * 4096 bytes
            const wdata = db.slice(offset, offset + 4 * 4096);

            // Serum takes 2048 samples per wave, so we need to resample (take every second sample)
            // make empty buffer
            const cordata = Buffer.allocUnsafe(4 * 2048).fill(0);
            // resample and fill
            for (i = 0; i < 2048 * 4; i += 4) {
              wdata.copy(cordata, i, i * 2, i * 2 + 4);
            }
            // append our new buffer to the outfile array.
            outFileBufferArray.push(cordata);
          }
        }
        // calculate length.
        const length = outFileBufferArray.reduce(
          (total, buf) => total + buf.length,
          0
        );
        console.log("# of waves in table: " + (outFileBufferArray.length - 1));
        console.log("length with header: " + length);
        console.log("length: " + (length - outFileBufferArray[0].length));

        // theres two bits of metadata we need to write into the template file header
        // first, the file length (total). Note the - 8 (gotcha)
        // put it after the "RIFF" file id at the start of the file
        outFileBufferArray[0].writeInt32LE(length - 8, 4);
        // Then the length of the data chunk
        // this goes after the "data" chunk starting marker
        outFileBufferArray[0].writeInt32LE(
          length - outFileBufferArray[0].length,
          132
        );
        // both are 32 bit signed ints in little endian

        // finally concat the buffers and write the file.
        fs.writeFile(
          `./omnisphere/${topLevelDir}/${midLevelDir}/${filename}.wav`,
          Buffer.concat(outFileBufferArray),
          function(e) {}
        );
      }
    }
  }
});

reader.parse(xml.toString());

// Buffer.concat([buffer1, buffer2]);
