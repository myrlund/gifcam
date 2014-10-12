var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');
var gifshot = require('gifshot');

var AppDispatcher = require('../dispatcher/appDispatcher');
var MediaConstants = require('../constants/mediaConstants');

// All the store state.
var _mediaState = {
    mediaAccessState: MediaConstants.MediaAccessState.NONE,
    stream: null,
    imageData: null,
    applicationState: MediaConstants.ApplicationState.IDLE,
    duration: 1500,
    dimensions: {
        width: null,
        height: null
    }
};

var CHANGE_EVENT = 'change';
var MediaStore = merge(EventEmitter.prototype, {
    getState: function () {
        return _mediaState;
    },

    emitChange: function () {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
});

var createGifFromStream = function (stream, videoElement) {
    // gifshot has some latency both before and after capturing.
    // The progress tracker updates some context state when capturing starts and ends.
    var _setRecording = false;
    var progressTracker = function (captureProgress) {
        if (!_setRecording) {
            _setRecording = true;
            _mediaState.applicationState = MediaConstants.ApplicationState.RECORDING;
            MediaStore.emitChange();
        }

        if (captureProgress === 1.0) {
            _mediaState.applicationState = MediaConstants.ApplicationState.PROCESSING;
            MediaStore.emitChange();
        }
    };

    gifshot.createGIF({
        cameraStream: stream,
        webcamVideoElement: videoElement,
        keepCameraOn: true,
        progressCallback: progressTracker,

        // gifshot captures every 100ms. divide by that to get the desired duration.
        numFrames: _mediaState.duration / 100,

        // quality/performance tweaking params.
        sampleInterval: 10,
        numWorkers: 4,

        // the same dimensions as the media stream.
        // consider applying a scaling factor to increase performance.
        gifWidth: _mediaState.dimensions.width,
        gifHeight: _mediaState.dimensions.height
    }, function (result) {
        _mediaState.applicationState = MediaConstants.ApplicationState.IDLE;

        if (!result.error) {
            _mediaState.imageData = result.image;
            MediaStore.emitChange();
        }
    });
};

// Simple wrapper for navigator.getUserMedia, which updates store state with the obtained stream.
var getMediaAccess = function () {
    var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

    var mediaConstraints = {
        video: true,
        audio: false
    };

    var successFn = function (stream) {
        _mediaState.mediaAccessState = MediaConstants.MediaAccessState.ACCESS;
        _mediaState.stream = stream;
        MediaStore.emitChange();
    };

    var errorFn = function (error) {
        _mediaState.mediaAccessState = MediaConstants.MediaAccessState.ERROR;
        MediaStore.emitChange();
    };

    return getUserMedia.call(navigator, mediaConstraints, successFn, errorFn);
};

// Register store as a handler for media events fired from the components.
var Actions = MediaConstants.Actions;
AppDispatcher.register(function (payload) {
    var action = payload.action;

    switch (action.actionType) {
        case Actions.REQUEST_MEDIA_ACCESS:
            getMediaAccess();
            break;
        case Actions.CREATE_GIF_FROM_STREAM:
            createGifFromStream(action.stream, action.videoElement);
            break;
        case Actions.SET_VIDEO_DIMENSIONS:
            _mediaState.dimensions = action.dimensions;
            MediaStore.emitChange();
            break;
    }

    return true;
});

module.exports = MediaStore;
