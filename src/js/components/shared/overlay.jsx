var React = require('react');

var Overlay = React.createClass({
    render: function () {
        var overlayStyle = this.props.style || '';

        return (
            <aside className={"overlay " + overlayStyle}>
                {this.props.children}
            </aside>
        );
    }
});

module.exports = Overlay;
