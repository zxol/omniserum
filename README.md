# Omniserum.
## Create [Xfer Serum](https://xferrecords.com/products/serum) wavetables from [Spectrasonics Omnisphere's](https://www.spectrasonics.net/products/omnisphere/) wavetables using Node.js.
Taking source sounds from one VSTi software instrument and using them in another.

### You will need:
1. A copy of Omnisphere.
2. Node.js [installed](https://nodejs.org/en/download/). (LTS or above)
3. Git installed.
3. A clone (copy) of this repository. `git clone https://github.com/zxol/omniserum.git`

### What to do:

First we need a copy of the wavetable data from Omnisphere.

In the `STEAM` directory (where your Spectrasonics data is), find the wavetables data file (it's just one big file).
It's called `~BundleArchives.db` and is found in this path relative to `STEAM`:
```
spectrasonics\STEAM\Omnisphere\Wavetables\~BundleArchives.db
```
Copy it into this repo directory.
Then install and start the script with the following commands (in the repo's root directory, where package.json is):
```
npm install
npm start
```
After the script runs, you should have a new folder called `omnisphere` in the repo directory.
Copy this folder into serum's wavetable directory. It's located in your windows user documents folder.
```
%HOMEPATH%\Documents\Xfer\Serum Presets\Tables
```
All done! If serum is already open, reload it to check out your shiny new tables of waves!
