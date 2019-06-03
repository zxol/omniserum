# omniserum
## A script to create [Xfer Serum](https://xferrecords.com/products/serum) wavetables from [Spectrasonics Omnisphere's](https://www.spectrasonics.net/products/omnisphere/) wavetables.
Taking sounds from one software instrument to use in another.

### You will need:
1. A copy of omnisphere.
2. Node js [installed](https://nodejs.org/en/download/). (LTS or above)
3. A clone of this repository.

### What to do:
in the STEAM directory where your rompler data is, find the wavetables data file (it's just one big file).
It's called ~BundleArchives.db and is found in this path relative to STEAM:
```
spectrasonics\STEAM\Omnisphere\Wavetables\~BundleArchives.db
```
Copy it into this repo directory.

Then install and start the script with the command (in the repo root dir):

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
