# fftFlipBook
A flip book to explore the FFTs of audio visually.

### DEVELOP

#### Dependencies:
     - http-server `npm install http-server -g`

#### Run
`npm run start`

### MVP
 - can play audio... start, loop, stop
 - produces fft image with what is currently in buffer
 - dropzone...
 - UI looks a lot better...

### Nice features to have
 - stereo
 - a way to keep previous files in the queue... If you uploaded a file and it has already processed,
    why not keep a few of the last ones in memory?. You can make an object that can represent 'this done', 'that done' and it can be a todo list
 - re-enable tests...? Why is it so hard for testing libraries to be okay with classes that have anything other than static methods in them...