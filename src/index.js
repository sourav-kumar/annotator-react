import React from 'react';
import { render} from 'react-dom';
import PropTypes from 'prop-types'

let selectionTimeout;
const debounce = (func, delay) => {
  let inDebounce,
    that = this;
  return function () {
    console.log('cont', that);
    const args = arguments
    clearTimeout(inDebounce)
    inDebounce = setTimeout(() => func.apply(that, args), delay)
  }
}

const removeHtmlTag = (element) => {

  let parentElem = element.parentNode;
  element.replaceWith(element.innerHTML);
  parentElem.innerHTML = parentElem.innerHTML;
}
const DisplayComment = ({ comments, pencilLeft, pencilTop }) => (
  <div className="comment_box hover_box" style={{ 'left': pencilLeft, 'top': pencilTop }}>
    <div className="panel panel-default">
      <div className="panel-box panel-body">
        {
          comments.map((comment) => {
            if (comment.text == '') {
              return <p key={comment.refId} className="text-success">No Comment</p>
            } else {
              return <p key={comment.refId} className="text-success">{comment.text}</p>
            }
          }
          )}
      </div>
    </div>
    <div className="arrow_down"></div>
  </div>
)

DisplayComment.propTypes = {
  comments: PropTypes.array.isRequired,
  pencilLeft: PropTypes.number.isRequired,
  pencilTop: PropTypes.number.isRequired,
}

const CommentBox = ({ defaultComment, onCommentChange, saveComment, toggleBox, pencilTop, pencilLeft, changeColor }) => (
  <div className="comment_box" style={{ 'left': pencilLeft, 'top': pencilTop }}>
    <div className="panel panel-default">
      <div className="panel-body">
        <textarea name="comment"
          placeholder="Comments..."
          value={defaultComment}
          onChange={e => onCommentChange(e)}
          className="comment_area"
          id="comment_textarea"
          name="comment_textarea"
        />
        <div className="col-xs-12 color_box">
          <span onClick={e => changeColor(e)} data-color="red" className="div_color red_span">col</span>
          <span onClick={e => changeColor(e)} data-color="blue" className="div_color blue_span">col</span>
          <span onClick={e => changeColor(e)} data-color="gray" className="div_color gray_span">col</span>
          <span onClick={e => changeColor(e)} data-color="lightgray" className="div_color light_gray_span">col</span>
          <span onClick={e => changeColor(e)} data-color="lightgoldenrodyellow" className="div_color yellow_span">col</span>
        </div>
      </div>
      <div className="panel-footer">
        <button type="button" className="btn cancel_button" onClick={toggleBox} id="cancel_button" name="cancel_button">
          <span className="glyphicon glyphicon-remove text-danger" /> &nbsp;
                                Cancel
                            </button>
        <button type="button" className="btn btn-info pull-right" onClick={saveComment} id="save_button" name="save_button">
          <span className="glyphicon glyphicon-ok" /> &nbsp;
                                Save
                            </button>
      </div>
    </div>
    <div className="arrow_down" />
  </div>
)

CommentBox.propTypes = {
  defaultComment: PropTypes.string.isRequired,
  onCommentChange: PropTypes.func.isRequired,
  saveComment: PropTypes.func.isRequired,
  toggleBox: PropTypes.func.isRequired,
  pencilLeft: PropTypes.number.isRequired,
  pencilTop: PropTypes.number.isRequired,
  changeColor: PropTypes.func.isRequired,
}

const EditIcon = ({ toggleEdit, pencilLeft, pencilTop }) => (
  <span id="editIcon" style={{ 'left': pencilLeft, 'top': pencilTop }} className="edit_icon glyphicon glyphicon-pencil position-a" onClick={toggleEdit} />

)

EditIcon.propTypes = {
  toggleEdit: PropTypes.func.isRequired,
  pencilLeft: PropTypes.number.isRequired,
  pencilTop: PropTypes.number.isRequired,
}

const Header = ({ headerText }) => (
  <div className="col-xs-12 header">
    <h2 className="md-3">{headerText}</h2>
  </div>
)

Header.propTypes = {
  headerText: PropTypes.string.isRequired,
}

const PanelBlock = ({ headerText, showEditIcon, toggleEdit, pencilLeft, pencilTop }) => (
  <div>
    <Header
      headerText={headerText}
    />
    <div id="content-block" className="col-xs-12 content_block">
      <p>Scientists india Japan warming missunderstanding sourcecode create entertainment Artificial Inteligence could read your brainwaves. India their research papertitle Deep image reconstruction from human brain activity’, scientists were able tourist replicate an imagebased what person island looking atomatic italian. These America created images arenot exactly the same as astronuats see naturally,</p>

      <p>but hazy rendering of your thoughts. Nonetheless, AI is able to reconstruct these images created using brain waves.
                          Whereas it has long been thought that the externalization or visualization of states of the mind is a
                          challenging goal in neuroscience, brain decoding using machine learning analysis of fMRI activity nowadays
                          has enabled the visualization of perceptual content,” said the research paper.</p>

      <p>Although sophisticated decoding and encoding models have been developed to render human brain activity into
                          images or movies or to the matching to exemplar images or movies (Naselaris et al., 2009; Nishimoto et al.,
                          2011), failing to combine visual features of multiple hierarchical levels, the methods were essentially limited
                          to the image reconstruction with low-level image bases.</p>

      <p>.</p>

      {showEditIcon &&
        <EditIcon
          toggleEdit={toggleEdit}
          pencilLeft={pencilLeft}
          pencilTop={pencilTop}
        />
      }
    </div>
  </div>
)

PanelBlock.propTypes = {
  headerText: PropTypes.string.isRequired,
  showEditIcon: PropTypes.bool.isRequired,
  toggleEdit: PropTypes.func.isRequired,
  pencilTop: PropTypes.number.isRequired,
  pencilLeft: PropTypes.number.isRequired,
}


class CommentApp extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      displayComments: false,
      showEditIcon: false,
      pencilTop: 0,
      pencilLeft: 0,
      defaultComment: "",
      showCommentBox: false,
      commentsArray: [],
      refId: 1000,
      activeRefId: '',
      activeComments: [],
      highlightColor: 'lightgreen',
    }

    this.getSelectedText = this.getSelectedText.bind(this)
    this.toggleEdit = this.toggleEdit.bind(this)
    this.onCommentChange = this.onCommentChange.bind(this)
    this.saveComment = this.saveComment.bind(this)
    this.toggleBox = this.toggleBox.bind(this)
    this.updateColor = this.updateColor.bind(this)
  }

  componentDidMount() {
    if (!this.state.showCommentBox) {
      document.addEventListener('mouseup', this.getSelectedText);
    }
  }

  getSelectedText(ev) {
    let that = this,
      hideEdit = true;
    clearTimeout(selectionTimeout)
    selectionTimeout = setTimeout(function () {
      console.log(window.getSelection().getRangeAt(0).toString());
      if (window.getSelection().getRangeAt(0).toString()) {
        console.log('sel')
        const selection = window.getSelection().getRangeAt(0);
        const selectedText = selection.toString();
        const extract = selection.extractContents();
        let txtNode = document.createTextNode(selectedText);
        let span = document.createElement("span");
        span.style.background = that.state.highlightColor;
        span.setAttribute("data-id", that.state.refId + 1);
        let dupElem = document.getElementById(that.state.refId + 1);

        span.id = that.state.refId + 1;
        span.appendChild(txtNode);
        span.className = 'tooltip-host';
        selection.insertNode(span);
        dupElem && removeHtmlTag(dupElem);
        let showTextEdit = (e) => {
          const refId = e.target.getAttribute('data-id')
          let activeComments = that.state.commentsArray.filter(comment => comment.refId == refId)
          if (activeComments.length) {
            that.setState({ pencilLeft: e.screenX, pencilTop: e.screenY, activeComments: activeComments, displayComments: true });
          }

        }
        let newElem = document.getElementById(that.state.refId + 1);
        newElem.addEventListener('mouseenter', showTextEdit);

        newElem.addEventListener('mouseout', () => {
          that.setState({ displayComments: false, activeComments: [] })
        });
        hideEdit = false;
        const { pageX, pageY } = ev;
        that.setState({
          pencilTop: pageY - 195,
          pencilLeft: pageX - 149,
          activeRefId: that.state.refId + 1
        })

      }
      that.toggleEdit(ev, hideEdit);
    }, 500);

  }

  toggleEdit(e, hideEdit) {
    if (this.state.showEditIcon && hideEdit) {
      //console.log('one',e.target)
      let showCmntBox = (e.target === document.getElementById('editIcon'));
      showCmntBox || removeHtmlTag(document.getElementById(this.state.refId + 1));
      //console.log(showCmntBox);
      this.setState({ showCommentBox: showCmntBox, showEditIcon: false });
      return;
    } else if (!hideEdit) {
      //console.log('three')
      this.setState({ showEditIcon: true })
    }
  }

  updateColor(e) {
    e.preventDefault()
    const backgroundcolor = e.target.getAttribute('data-color')
    const elementId = this.state.activeRefId
    let element = document.getElementById(elementId)
    element.style.background = backgroundcolor
  }

  saveComment() {
    let commentsArray = this.state.commentsArray;
    commentsArray.push({ 'refId': this.state.activeRefId, 'text': this.state.defaultComment });
    this.setState({
      showCommentBox: !this.state.showCommentBox,
      defaultComment: "",
      commentsArray: commentsArray,
      refId: this.state.refId + 2,
    })
  }

  onCommentChange(e) {
    this.setState({ defaultComment: e.target.value })
  }

  toggleBox() {
    this.setState({ showCommentBox: !this.state.showCommentBox })
    const elementId = this.state.activeRefId
    let element = document.getElementById(elementId);
    removeHtmlTag(element);
  }

  render() {
    return (
      <div className="container">
        <PanelBlock
          headerText="Scientist developed AI"
          showEditIcon={this.state.showEditIcon}
          toggleEdit={this.toggleEdit}
          pencilTop={this.state.pencilTop}
          pencilLeft={this.state.pencilLeft}
        />
        {this.state.showCommentBox &&
          <CommentBox
            defaultComment={this.state.defaultComment}
            onCommentChange={this.onCommentChange}
            saveComment={this.saveComment}
            toggleBox={this.toggleBox}
            pencilTop={this.state.pencilTop}
            pencilLeft={this.state.pencilLeft}
            changeColor={this.updateColor}
          />
        }
        {this.state.displayComments &&
          <DisplayComment
            comments={this.state.activeComments}
            pencilLeft={this.state.pencilLeft - 50}
            pencilTop={this.state.pencilTop - 250}
          />
        }

      </div>
    )
  }
}

render(<CommentApp />, document.getElementById('root'));
