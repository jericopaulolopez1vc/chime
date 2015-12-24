var React = require("react");

var VolumeBar = React.createClass({
  getInitialState: function() {
		return { hide: true };
	},

	render: function() {
		var percent = this.props.volume * 100;
		var style = {top: (100 - percent) + "%"};
		var toggleIcon = this.props.volume == 0 ? "volume-off" : "volume-up";

		var audioVolumeBarClasses = classnames({
			'audio-volume-bar': true,
  		'audio-volume-bar-hide': this.state.hide
		});

		audioVolumeBarContainerId = "audioVolumeBarContainerId" + ++uniquleId;
		toggleBtnId = "toggleBtn" + ++uniquleId;

		return (
			<div id={ audioVolumeBarContainerId }
        ref="audioVolumeBarContainer"
        className="audio-volume-bar-container">

				<Button id={ toggleBtnId } ref="toggleButton" bsSize="small"
          onClick={ this.toggle }>

					<Glyphicon glyph={ toggleIcon } />

				</Button>

				<div className={ audioVolumeBarClasses }>

					<div className="audio-volume-min-max" onClick={ this._volumeToMax }>
						<Glyphicon glyph="volume-up" />
					</div>

  					<div ref="audioVolumePercentContainer"
              className="audio-volume-percent-container"
              onClick={ this.adjustVolumeTo }>

						<div className="audio-volume-percent" style={ style } />

					</div>

					<div className="audio-volume-min-max" onClick={ this._volumeToMin }>
						<Glyphicon glyph="volume-off" />
					</div>
				</div>
			</div>
		);
	},

	toggle: function() {
		if (this.isToggleBtnPress) {
			this.isToggleBtnPress = false;
			return;
		}

		var hide = !this.state.hide;
		if (hide) {
			return;
		}

		this.setState({ hide: false });
		this.globalClickHandler = $(document).mousedown(function(e) {
			var reactId = this.refs.audioVolumeBarContainer.props.id;
			var toggleBtnReactId = this.refs.toggleButton.props.id;
			node = e.target;
			while(node != null) {
				var nodeReactId =  $(node).context.id;
				if (reactId === nodeReactId) {
					return;
				} else if (toggleBtnReactId === nodeReactId) {
					this.isToggleBtnPress = true;
					break;
				}
				node = node.parentNode;
			}
			this.globalClickHandler.unbind();
			this.globalClickHandler = null;
			this.setState({ hide: true });
		}.bind(this));

	},

	adjustVolumeTo: function(e) {
		var container = $(this.refs.audioVolumePercentContainer.getDOMNode());
		var containerStartY = container.offset().top;
		var percent = (e.clientY - containerStartY) / container.height();
		percent = 1 - percent;
		this.props.adjustVolumeTo(percent);
	},

	_volumeToMax: function() {
		this.props.adjustVolumeTo(1);
	},

	_volumeToMin: function() {
		this.props.adjustVolumeTo(0);
	},

  render: function () {
    return (
      <div className="controller">

      </div>
    );
  }
});

module.exports = VolumeBar;
