var React = require('react');

var MediaConstants = require('../constants/mediaConstants');
var MediaActions = require('../actions/mediaActions');

var Overlay = require('./shared/overlay');

var MediaAccessRequester = React.createClass({
    render: function () {
        return (
            <section className="media">
                <Overlay>
                    <button onClick={this.requestMediaAccess}>Access webcam</button>
                </Overlay>
            </section>
        );
    },

    requestMediaAccess: function () {
        MediaActions.requestMediaAccess();
    }
});

module.exports = MediaAccessRequester;
