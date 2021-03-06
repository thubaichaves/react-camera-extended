import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Camera extends Component {

  constructor(props) {
    super(props);
    this.state = { enabled: false };
  }

  componentWillMount() {
    this.setVideoStream(this.props.tryRearCamera);
  }

  setVideoStream(tryRearCamera = false) {
    let { video } = this.props;
    const { audio } = this.props;
    if (tryRearCamera && this.mobileAndTabletCheck()) {
      video = { facingMode: { exact: 'environment' } };
    }
    if (navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia({ video, audio })
        .then((mediaStream) => {
          this.setState({ mediaStream });
          if (this.video) {
            this.video.srcObject = mediaStream;
            this.video.play();
            this.setState({ enabled: true });
          } else {
            throw new Error('Video Tag not initialized');
          }
        })
        .catch((error) => { throw error; });
    }
  }

  capture() {
    const hiddenCanvas = this.canvas;

    // Get the exact size of the video element.
    const width = this.videoContainer.offsetWidth;
    const height = this.videoContainer.offsetHeight;

    // Context object for working with the canvas.
    const context = hiddenCanvas.getContext('2d');

    // Set the canvas to the same dimensions as the video.
    hiddenCanvas.width = width;
    hiddenCanvas.height = height;

    // Draw a copy of the current frame from the video on the canvas.
    context.drawImage(this.video, 0, 0, width, height, 0, 0, width, height);

    const trimmedBlankCanvas = this.trimCanvas(hiddenCanvas);

    // Get an image dataURL from the canvas.
    return trimmedBlankCanvas.toDataURL('image/png');
  }

  render() {
    const videoContainerStyle =
      window.Object.assign(
        {},
        this.props.styles.videoContainer || {},
        styles.default.videoContainer
      );
    return (
      <div
        style={videoContainerStyle}
        ref={(videoContainer) => { this.videoContainer = videoContainer; }}
      >
        { this.props.children }
        <canvas ref={(canvas) => { this.canvas = canvas; }} />
        <video
          style={window.Object.assign({}, this.props.styles.video || {}, styles.default.video)}
          ref={(video) => { this.video = video; }}
        />
      </div>
    );
  }
}

Camera.prototype.mobileAndTabletCheck = function () {
  let check = false;
  //eslint-disable-next-line
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

Camera.prototype.trimCanvas = function (c) {
  const ctx = c.getContext('2d');
  const copy = document.createElement('canvas').getContext('2d');
  const pixels = ctx.getImageData(0, 0, c.width, c.height);
  const length = pixels.data.length;
  const bound = {
    top: null,
    left: null,
    right: null,
    bottom: null
  };
  let i;
  let x;
  let y;

  // Iterate over every pixel to find the highest
  // and where it ends on every axis ()
  for (i = 0; i < length; i += 4) {
    if (pixels.data[i + 3] !== 0) {
      x = (i / 4) % c.width;
      // eslint-disable-next-line no-bitwise
      y = ~~((i / 4) / c.width);

      if (bound.top === null) {
        bound.top = y;
      }

      if (bound.left === null) {
        bound.left = x;
      } else if (x < bound.left) {
        bound.left = x;
      }

      if (bound.right === null) {
        bound.right = x;
      } else if (bound.right < x) {
        bound.right = x;
      }

      if (bound.bottom === null) {
        bound.bottom = y;
      } else if (bound.bottom < y) {
        bound.bottom = y;
      }
    }
  }
  // Calculate the height and width of the content
  const trimHeight = bound.bottom - bound.top;
  const trimWidth = bound.right - bound.left;
  const trimmed = ctx.getImageData(bound.left, bound.top, trimWidth, trimHeight);

  copy.canvas.width = trimWidth;
  copy.canvas.height = trimHeight;
  copy.putImageData(trimmed, 0, 0);

  // Return trimmed canvas
  return copy.canvas;
};

Camera.propTypes = {
  audio: PropTypes.bool,
  video: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  children: PropTypes.element,
  styles: PropTypes.oneOfType([PropTypes.object]),
  tryRearCamera: PropTypes.bool
};

Camera.defaultProps = {
  audio: false,
  video: true,
  styles: { videoContainer: {}, video: {} },
  children: null,
  tryRearCamera: false
};

export default Camera;

const styles = {
  default: {
    video: {
      minWidth: '100%',
      minHeight: '100%',
      width: 'auto',
      height: 'auto',
      position: 'absolute',
      top: 0,
      left: 0
    },
    videoContainer: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
      overflow: 'hidden'
    }
  }
};
