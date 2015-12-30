var React = require("react");
var Modal = require("react-bootstrap").Modal;
var Row = require("react-bootstrap").Row;
var Col = require("react-bootstrap").Col;
var Input = require("react-bootstrap").Input;
var Button = require("react-bootstrap").Button;
var Thumbnail = require("react-bootstrap").Thumbnail;
var TrackStore = require("../../stores/track_store");
var TrackActions = require("../../actions/track_actions");
var EditTrackImage = require("./edit_track_image");

var EditTrackModal = React.createClass({
  getInitialState: function () {
    return {
      show: TrackStore.showEditModal(),
      disabled: true
    };
  },

  componentDidMount: function () {
    this.listenerToken = TrackStore.addListener(this._onChange);
  },

  componentWillReceiveProps: function (nextProps) {
    this.setState({
      title: nextProps.track.title,
      description: nextProps.track.description,
      imgUrl: nextProps.track.img_square
    });
  },

  componentWillUnmount: function () {
    this.listenerToken.remove();
  },

  _onChange: function () {
    this.setState({ show: TrackStore.showEditModal() });
  },

  _disabled: function () {
    return (this.state.title === "") || (this.state.disabled);
  },

  _handleDescriptionChange: function () {
    var description = this.refs.description.getValue();
    this.setState({ disabled: false, description: description });
  },

  _handleFile: function () {
    var img = this.refs.file.files[0];

    if (img === null) { return; }

    var reader = new FileReader();

    reader.onloadend = function () {
      this.setState({ imgUrl: reader.result });
    }.bind(this);

    reader.readAsDataURL(img);
    this.setState({ disabled: false, img: img });
  },

  _handleTitleChange: function () {
    var title = this.refs.title.getValue();
    this.setState({ disabled: false, title: title });
  },

  update: function () {
    var trackId = this.props.track.id;
    var formData = new FormData();

    formData.append("track[title]", this.state.title);
    formData.append("track[description]", this.state.description);

    if (this.state.img) {
      formData.append("track[img]", this.state.img);
    }

    TrackActions.updateTrack(trackId, formData);
  },

  _titleLabel: function () {
    return <span className="required-label">Title</span>;
  },

  close: function () {
    TrackActions.closeEditModal();
  },

  render: function () {
    return (
      <Modal onHide={ this.close }
        dialogClassName="edit-track-modal"
        show={ this.state.show }>

        <Modal.Header closeButton>
          <Modal.Title>
            Edit Track
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row>
            <Col xs={ 5 } sm={ 5 } md={ 5 }>
              <div className="upload-img">
                <span className="btn btn-default btn-file">
                  <i className="fa fa-file-image-o"></i> Update image

                    <input type="file" accept="image/*" ref="file"
                      onChange={ this._handleFile } />
                  </span>

                <Thumbnail src={ this.state.imgUrl } />
              </div>
            </Col>

            <Col xs={ 7 } sm={ 7 } md={ 7 }>
              <Input type="text"
                label={ this._titleLabel() }
                ref="title"
                placeholder="Change your track title"
                help="Changing your track title will also change its URL!"
                value={ this.state.title }
                onChange={ this._handleTitleChange } />

              <Input type="textarea"
                label="Description"
                ref="description"
                rows="5"
                id="track-description"
                placeholder="Oops! Your track has no description. Enter something to describe your track."
                value={ this.state.description }
                onChange={ this._handleDescriptionChange } />
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={ this.close }>Cancel</Button>

          <Button bsStyle="primary"
            disabled={ this._disabled() }
            onClick={ this.update }>
            Update Track
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
});

module.exports = EditTrackModal;