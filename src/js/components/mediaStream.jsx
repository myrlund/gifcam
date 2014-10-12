var React = require('react');

var MediaConstants = require('../constants/mediaConstants');
var MediaActions = require('../actions/mediaActions');

var Overlay = require('./shared/overlay');
var ProgressBar = require('./shared/ProgressBar');

// Key for accessing the video DOM element
var videoElementRef = 'video-element';

var MediaStream = React.createClass({
    getInitialState: function () {
        return {
            hasLoadedMetadata: false
        };
    },

    componentDidMount: function () {
        var videoElement = this._getVideoElement();
        videoElement.addEventListener('play', this._updateDimensions);
    },

    render: function () {
        var streamUrl = window.URL.createObjectURL(this.props.stream);
        var isRecording = this.props.applicationState === MediaConstants.ApplicationState.RECORDING;

        return (
            <article className="media">
                <video src={streamUrl} ref={videoElementRef} autoPlay />
                {this._getOverlay(this.props.applicationState)}
                {isRecording && <ProgressBar duration={this.props.duration} />}
            </article>
        );
    },

    onRecord: function () {
        MediaActions.createGifFromStream(this.props.stream, this._getVideoElement());
    },

    _getOverlay: function (applicationState) {
        var overlayContent, overlayStyle;

        switch (applicationState) {
            // The starting position
            case MediaConstants.ApplicationState.IDLE:
                overlayContent = <button onClick={this.onRecord}>Record GIF</button>;
                break;

            // Set a dark "processing" overlay when GIF compiles.
            case MediaConstants.ApplicationState.PROCESSING:
                overlayContent = <p>Processing...</p>;
                overlayStyle = 'dark';
                break;

            // Anything in-between.
            default:
                return;
        }

        return (
            <Overlay style={overlayStyle}>
                {overlayContent}
            </Overlay>
        );
    },

    _updateDimensions: function (e) {
        // The play event fires twice when the video dimensions are set below. Weird.
        if (!this.state.hasLoadedMetadata) {
            // For some reason, the dimensions aren't available until the DOM render completes.
            // A timeout hack fixes this for now.
            setTimeout(function () {
                MediaActions.setVideoDimensions({
                    width: e.target.videoWidth,
                    height: e.target.videoHeight
                });
                this.setState({
                    hasLoadedMetadata: true
                });
            }.bind(this), 0);
        }
    },

    _getVideoElement: function () {
        var videoElementComponent = this.refs[videoElementRef];
        return videoElementComponent && videoElementComponent.getDOMNode()
    }
});

module.exports = MediaStream;
