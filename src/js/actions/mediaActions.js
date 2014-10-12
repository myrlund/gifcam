var AppDispatcher = require('../dispatcher/appDispatcher');
var MediaConstants = require('../constants/mediaConstants');

// Actions methods –> objects to put into the dispatcher –> handled by a store.
var MediaActions = {
    requestMediaAccess: function () {
        AppDispatcher.handleViewAction({
            actionType: MediaConstants.Actions.REQUEST_MEDIA_ACCESS
        });
    },
    setVideoDimensions: function (dimensions) {
        AppDispatcher.handleViewAction({
            actionType: MediaConstants.Actions.SET_VIDEO_DIMENSIONS,
            dimensions: dimensions
        })
    },
    createGifFromStream: function (stream, videoElement) {
        AppDispatcher.handleViewAction({
            actionType: MediaConstants.Actions.CREATE_GIF_FROM_STREAM,
            stream: stream,
            videoElement: videoElement
        })
    }
};

module.exports = MediaActions;
