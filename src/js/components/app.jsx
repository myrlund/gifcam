var React = require('react');

var MediaConstants = require('../constants/mediaConstants');

var Gif = require('./gif');
var MediaStream = require('./mediaStream');
var MediaAccessRequester = require('./mediaAccessRequester');

var MediaStore = require('../stores/mediaStore');

var getMediaState = function () {
    return MediaStore.getState();
};

var App = React.createClass({
    getInitialState: function () {
        return getMediaState();
    },

    render: function () {
        var mediaComponent = this._getMediaComponent(this.state.mediaAccessState, !!this.state.imageData);

        return (
            <section className="app">
                <h1>Gifcam</h1>

                <article className="media-component">
                    {mediaComponent}
                </article>
            </section>
        );
    },

    // Getting the right media component to show

    _getMediaStreamComponent: function () {
        return <MediaStream stream={this.state.stream}
                            mediaAccessState={this.state.mediaAccessState}
                            applicationState={this.state.applicationState}
                            duration={this.state.duration} />;
    },

    _getMediaComponent: function (mediaAccessState, hasImageData) {
        if (mediaAccessState === MediaConstants.MediaAccessState.NONE) {
            return <MediaAccessRequester mediaAccessState={this.state.mediaAccessState} />;
        }

        if (hasImageData) {
            return <Gif imageData={this.state.imageData} dimensions={this.state.dimensions} />;;
        }

        return this._getMediaStreamComponent();
    },

    // Life-cycle management

    componentDidMount: function () {
        MediaStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function () {
        MediaStore.removeChangeListener(this._onChange);
    },

    _onChange: function () {
        this.setState(getMediaState());
    }
});

module.exports = App;
