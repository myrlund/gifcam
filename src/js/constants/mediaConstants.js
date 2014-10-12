var keyMirror = require('react/lib/keyMirror');

module.exports = {
    MediaAccessState: keyMirror({
        NONE: null,
        REQUESTED: null,
        ERROR: null,
        ACCESS: null
    }),
    ApplicationState: keyMirror({
        IDLE: null,
        RECORDING: null,
        PROCESSING: null
    }),
    Actions: keyMirror({
        REQUEST_MEDIA_ACCESS: null,
        CREATE_GIF_FROM_STREAM: null,
        SET_VIDEO_DIMENSIONS: null
    })
};
