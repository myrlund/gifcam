var React = require('react');

var Overlay = require('./shared/overlay');

var Gif = React.createClass({
    render: function () {
        var width = this.props.dimensions.width;
        var height = this.props.dimensions.height;

        return (
            <section className="gif">
                <img src={this.props.imageData} width={width} height={height} />
                <Overlay style="hidden">
                    {/* The following _should_ work, but crashes Chrome. */}
                    <a href={this.props.imageData} download="gifcam-image.gif" className="gc-button">Download</a>
                </Overlay>
            </section>
        );
    }
});

module.exports = Gif;
