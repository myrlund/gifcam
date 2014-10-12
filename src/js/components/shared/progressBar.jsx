var React = require('react');

// Helpers for vendor prefixing of inline styles.
var vendorPrefixes = ['', '-webkit-', '-moz-', '-ms-', '-o-'];
var prefixedAttribute = function (attribute) {
    return vendorPrefixes.map(function (prefix) {
        return prefix + attribute;
    });
};

var ProgressBar = React.createClass({
    render: function () {
        return (
            <aside className="progress">
                <div className="bar" style={this._getBarInlineStyle(this.props.duration)} />
            </aside>
        );
    },

    // This handles animation-duration with vendor prefixes.
    _getBarInlineStyle: function (duration) {
        var properties = prefixedAttribute('animation-duration');

        var styles = {};
        properties.forEach(function (property) {
            styles[property] = duration + 'ms';
        });
        return styles;
    }
})

module.exports = ProgressBar;
