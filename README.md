# fftFlipBook
A flip book to explore the FFTs of audio visually.

### DEVELOP

#### Dependencies:
     - http-server `npm install http-server -g`

#### Run
`npm run start`

### The Dream
  - capability of stopping the soundfile at any point and getting the 'frozen in time' but not stuttering buffer. It requires a level a DSP I don't understand. Or maybe it's impossible. Perhaps it could be imitated with AI. "Loop" becomes "Freeze"

### The MVP
 - ~~can play audio... start, loop, stop~~
 - ~~produces fft image with what is currently in buffer~~
 - ~~dropzone...~~
 - ~~UI looks decent~~
 - confirm that you can plug this in another app as a package

### The Nice features to have
 - stereo (process both channels, but an easier idea would be to simply mix them down first as an MVP)
 - a way to keep previous files in the queue... If you uploaded a file and it has already processed, why not keep a few of the last ones in memory?. You can make an object that can represent 'this done', 'that done' and it can be a todo list
 - re-enable tests...? Why is it so hard for testing libraries to be okay with classes that have anything other than static methods in them...
 - compress the spectrum and use colors to differentiate the magnitude?
 - better logic as far as incrementing / decrementing / playing past index safety
 - better positioning of the units
 - drastically better UI
 - different builds for importing as not only a package but <script> tag
