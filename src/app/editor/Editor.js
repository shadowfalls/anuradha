import React from 'react';
import {
  Col, Row, Button, FormGroup, Label, Input, Container, InputGroup, InputGroupAddon,
  Alert, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Gist from 'react-gist';
import DatePicker from 'react-datepicker';

import * as constants from '../core/constants';
import Editable from './Editable';
import Edit from '../models/edit.modal';
import ArticleService from '../services/article.service';
import Utils from '../core/utils';

import './Editor.scss';

export default class Editor extends React.Component {
  constructor(props) {
    super(props);

    utils = new Utils();
    notificTime = 3000;

    notificService = {
      error: (title, message) => {
        const it = title; const
          msg = message;
        this.setState({
          errorBlock: { title: it, message: msg },
        });
        setTimeout(() => {
          this.setState({
            errorBlock: undefined,
          });
        }, this.notificTime);
      },
      success: (title, message) => {
        const it = title; const
          msg = message;
        this.setState({
          successBlock: { title: it, message: msg },
        });
        setTimeout(() => {
          this.setState({
            successBlock: undefined,
          });
        }, this.notificTime);
      },
    };
    this.articleService = new ArticleService();

    this.state = {
      blog: [new Edit({ html: '', isQuoted: false }), new Edit({ html: '', isQuoted: false })],
      errors: {},
      blogTitle: '',
      focusedIndex: 0,
      readTimeMin: 0,
      categoryList: [],
      date: '',
      newCategory: '',
      description: '',
    };
    this.onEnterClick = this.onEnterClick.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onBlogChange = this.onBlogChange.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.setFocusToEnd = this.setFocusToEnd.bind(this);
    this.onCreateLink = this.onCreateLink.bind(this);
    this.onTextToolbarChange = this.onTextToolbarChange.bind(this);
    this.setQuote = this.setQuote.bind(this);
    this.setCurrentIndex = this.setCurrentIndex.bind(this);
    this.addNewLineAbove = this.addNewLineAbove.bind(this);
    this.setFocusToIndex = this.setFocusToIndex.bind(this);
    this.onTextChange = this.onTextChange.bind(this);
    this.onSave = this.onSave.bind(this);
    this.setAsGist = this.setAsGist.bind(this);
    this.onGistTextChange = this.onGistTextChange.bind(this);
    this.onCreateGist = this.onCreateGist.bind(this);
    this.onSetAsTitle = this.onSetAsTitle.bind(this);
    this.onSetAsSubHeading = this.onSetAsSubHeading.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.onComboChange = this.onComboChange.bind(this);
    this.onBack = this.onBack.bind(this);
    this.setAsCodeSection = this.setAsCodeSection.bind(this);
    this.onCategorySave = this.onCategorySave.bind(this);
    this.onModalToggle = this.onModalToggle.bind(this);
    this.onCategoryNameEdit = this.onCategoryNameEdit.bind(this);
    this.onNewCategorySave = this.onNewCategorySave.bind(this);
    this.onAddCatModalToggle = this.onAddCatModalToggle.bind(this);
    this.setAsImage = this.setAsImage.bind(this);
    this.onImageTextChange = this.onImageTextChange.bind(this);
    this.addImage = this.addImage.bind(this);
  }

  componentDidMount() {
    const params = new URLSearchParams(this.props.location.search);
    if (params && params.get && params.get('id')) {
      this.id = params.get('id');
      this.fetchBlog(params.get('id'));
    }
    this.articleService.getCategoryList()
      .then((res) => {
        if (res.data && res.data.data && res.data.data.length) {
          this.setState({
            categoryList: res.data.data,
          });
        }
      })
      .catch((err) => this.notificService.error(err && err.response && err.response.data.message ? err.response.data.message : 'Could not get categories', 'Could not get categories'));
  }

  fetchBlog(id) {
    if (id) {
      this.articleService.getBlogArticle(id)
        .then((res) => {
          if (res && res.data) {
            this.setState({
              blog: res.data.content ? res.data.content : [],
              blogTitle: res.data.title ? res.data.title : '',
              description: res.data.description ? res.data.description : '',
              readTimeMin: res.data.readTimeMin ? res.data.readTimeMin : 0,
              date: res.data.date ? this.utils.getDate(res.data.date) : this.utils.getDate(),
              category: res.data.categoryId ? res.data.categoryId : '',
            });
          }
        })
        .catch((err) => this.notificService.error(err && err.response && err.response.data.message ? err.response.data.message : 'Could not get blog article', 'Could not get blog article'));
    }
  }

  onEnterClick(index) {
    this.setState((preState) => {
      preState.blog.splice(index + 1, 0, new Edit({ html: '', isQuoted: false }));
      preState.focusToIndex = index + 1;
      return preState;
    });
  }

  onBlogChange(value, index) {
    this.setState((preState) => {
      preState.blog[index].html = value;
      return preState;
    });
  }

  onComboChange(event) {
    const { name } = event.target;
    const val = event.target.selectedOptions[0].value;
    this.setState((preState) => {
      if (preState) {
        preState[name] = val;
      }
      return preState;
    });
  }

  onChange(event) {
    const { name } = event.target;
    const val = event.target.value;
    this.setState((preState) => {
      if (preState) {
        preState[name] = val;
      }
      return preState;
    });
  }

  removeItem(index) {
    this.setState((preState) => {
      if (preState.blog.length <= 2) return preState;
      if (index === preState.blog.length - 2
                && preState.blog[index - 1].isGist) return preState;
      preState.blog.splice(index, 1);
      preState.focusToIndex = index - 1;
      return preState;
    });
  }

  setStyle(event, cmd) {
    if (!constants.exeCommands[cmd]) return;
    document.execCommand(constants.exeCommands[cmd]);
  }

  onCreateLink() {
    const sele = window.getSelection();
    if (!sele.toString()) {
      alert('Select text to set link!');
      return;
    }
    const linkUrl = prompt('Enter URL:', 'http://');
    if (!linkUrl) {
      alert('Enter valid url!');
      return;
    }
    const seleText = document.getSelection();
    document.execCommand('insertHTML', false, `<a href="${linkUrl}" title="${linkUrl}" target="_blank">${seleText}</a>`);
  }

  onTextToolbarChange(event) {
    const { value } = event.target;
    this.setState((preState) => {
      preState.linkText = value;
      preState.errors.linkText = !preState.linkText;
      return preState;
    });
  }

  setFocusToIndex(index) {
    if (isNaN(index)) return;
    this.setState({ focusToIndex: index });
  }

  setFocusToEnd() {
    this.setState((preState) => {
      preState.focusToIndex = preState.blog.length - 2;
      return preState;
    });
  }

  setQuote() {
    this.setState((preState) => {
      if (preState.blog[preState.focusedIndex]) {
        if (!preState.blog[preState.focusedIndex].isQuoted) this.resetLine(preState.blog[preState.focusedIndex]);
        preState.blog[preState.focusedIndex].isQuoted = !preState.blog[preState.focusedIndex].isQuoted;
      }
      return preState;
    });
  }

  setCurrentIndex(index) {
    if (isNaN(index)) return;
    this.setState({ focusedIndex: index });
  }

  addNewLineAbove() {
    this.setState((preState) => {
      if (preState.blog[preState.focusedIndex]) preState.blog.splice(preState.focusedIndex, 0, new Edit({ html: '', isQuoted: false }));
      return preState;
    });
    if (this.state.blog[this.state.focusedIndex]) {
      this.setState((preState) => {
        preState.focusToIndex = preState.focusedIndex;
        return preState;
      });
    }
  }

  onTextChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  onSave() {
    if (!this.id) {
      this.articleService.createArticle({
        title: this.state.blogTitle,
        categoryId: this.state.category,
        description: this.state.description,
        content: this.state.blog.map((line) => ({
          html: line.html,
          isQuoted: line.isQuoted,
          isGist: line.isGist,
          isMainHeading: line.isMainHeading,
          isSubHeading: line.isSubHeading,
          isCodeSection: line.isCodeSection,
          isImage: line.isImage,
          imageUrl: line.imageUrl,
          gist: line.isGist ? line.gist : undefined,
        })),
        readTimeMin: this.state.readTimeMin,
        date: this.utils.getDateServer(this.state.date),
      })
        .then((res) => {
          this.id = res.data.id;
          this.props.history.push(`/blog?id=${res.data.id}`);
          this.notificService.success('Blog article created successfully', 'Blog article created');
        })
        .catch((err) => this.notificService.error(err && err.response && err.response.data.message ? err.response.data.message : 'Could not create article', 'Could not create article'));
    } else {
      this.articleService.updateArticle({
        title: this.state.blogTitle,
        description: this.state.description,
        categoryId: this.state.category,
        content: this.state.blog.map((line) => ({
          html: line.html,
          isQuoted: line.isQuoted,
          isGist: line.isGist,
          isMainHeading: line.isMainHeading,
          isSubHeading: line.isSubHeading,
          isCodeSection: line.isCodeSection,
          isImage: line.isImage,
          imageUrl: line.imageUrl,
          gist: line.isGist ? line.gist : undefined,
        })),
        readTimeMin: this.state.readTimeMin,
        date: this.utils.getDateServer(this.state.date),
      }, this.id)
        .then(() => {
          this.notificService.success('Blog article updated successfully', 'Blog article updated');
        })
        .catch((err) => this.notificService.error(err && err.response && err.response.data.message ? err.response.data.message : 'Could not update article', 'Could not update article'));
    }
  }

  resetLine(line) {
    line.isQuoted = false;
    line.gistText = '';
    line.gist = '';
    line.imageUrl = '';
    line.isImage = false;
    line.isGist = false;
    line.isMainHeading = false;
    line.isSubHeading = false;
  }

  onGistTextChange(value, index) {
    this.setState((preState) => {
      preState.blog[index].gistText = value;
      return preState;
    });
  }

  onImageTextChange(value, index) {
    this.setState((preState) => {
      preState.blog[index].imageText = value;
      return preState;
    });
  }

  setAsGist() {
    this.setState((preState) => {
      if (preState.blog[preState.focusedIndex].isGist) {
        this.resetLine(preState.blog[preState.focusedIndex]);
        return preState;
      }
      preState.blog[preState.focusedIndex].html = '';
      preState.blog[preState.focusedIndex].isGist = !preState.blog[preState.focusedIndex].isGist;
      return preState;
    });
  }

  setAsImage() {
    this.setState((preState) => {
      if (preState.blog[preState.focusedIndex].isImage) {
        this.resetLine(preState.blog[preState.focusedIndex]);
        return preState;
      }
      preState.blog[preState.focusedIndex].html = '';
      preState.blog[preState.focusedIndex].isImage = !preState.blog[preState.focusedIndex].isImage;
      return preState;
    });
  }

  onCreateGist(index) {
    this.setState((preState) => {
      let temp = preState.blog[index].gistText;
      if (!temp) {
        alert('Invalid gist');
        this.resetLine(preState.blog[index]);
        return preState;
      }
      const isGist = temp.indexOf('gist.github.com');
      if (isGist < 0) {
        alert('Invalid gist');
        this.resetLine(preState.blog[index]);
        return preState;
      }
      temp = temp.substring(isGist, temp.length);
      temp = temp.split('/');
      if (temp.length !== 3) {
        alert('Invalid gist');
        this.resetLine(preState.blog[index]);
        return preState;
      }
      // we need only the gist id
      preState.blog[index].gist = temp[2];
      // if the gist is added at the last line we need to add a extra line at the end to
      // enable further editing
      if (index === preState.blog.length - 2) preState.blog.push(new Edit({ html: '', isQuoted: false }));
      return preState;
    });
  }

  addImage(index) {
    this.setState((preState) => {
      const temp = preState.blog[index].imageText;
      if (!temp) {
        alert('Invalid image url');
        this.resetLine(preState.blog[index]);
        return preState;
      }
      preState.blog[index].imageUrl = temp;
      return preState;
    });
  }

  removeImage(index) {
    if (this.state.blog.length === 2) {
      this.setState((preState) => {
        preState.blog[0] = new Edit({ html: '', isQuoted: false });
        return preState;
      });
    } else this.removeItem(index);
  }

  removeGist(index) {
    if (this.state.blog.length === 2) {
      this.setState((preState) => {
        preState.blog[0] = new Edit({ html: '', isQuoted: false });
        return preState;
      });
    } else this.removeItem(index);
  }

  onSetAsSubHeading() {
    if (!this.state.blog[this.state.focusedIndex]) return;
    this.setState((preState) => {
      const temp = preState.blog[preState.focusedIndex].isSubHeading;
      this.resetLine(preState.blog[preState.focusedIndex]);
      preState.blog[preState.focusedIndex].isSubHeading = !temp;
      return preState;
    });
  }

  onSetAsTitle() {
    if (!this.state.blog[this.state.focusedIndex]) return;
    this.setState((preState) => {
      const temp = preState.blog[preState.focusedIndex].isMainHeading;
      this.resetLine(preState.blog[preState.focusedIndex]);
      preState.blog[preState.focusedIndex].isMainHeading = !temp;
      return preState;
    });
  }

  onDateChange(event) {
    if (!event) return;
    const val = event || '';
    this.setState((prevState) => {
      if (val) {
        prevState.date = val;
      }
      return prevState;
    });
  }

  onBack() {
    this.props.history.goBack();
  }

  setAsCodeSection() {
    if (!this.state.blog[this.state.focusedIndex]) return;
    this.setState((preState) => {
      const temp = preState.blog[preState.focusedIndex].isCodeSection;
      this.resetLine(preState.blog[preState.focusedIndex]);
      preState.blog[preState.focusedIndex].isCodeSection = !temp;
      return preState;
    });
  }

  onModalToggle() {
    this.setState((preState) => {
      preState.isEditCategory = !preState.isEditCategory;
      preState.editCatName = '';
      preState.editCatNameId = '';
      preState.newCategory = '';
      return preState;
    });
  }

  onAddCatModalToggle() {
    this.setState((preState) => {
      preState.isAddNewCat = !preState.isAddNewCat;
      preState.newCategory = '';
      return preState;
    });
  }

  onCategorySave() {
    this.articleService.updateCategoryName({
      newName: this.state.editCatName,
      id: this.state.editCatNameId,
    })
      .then((res) => {
        this.notificService.success('Category name changed!', '');
        if (res.data && res.data.data && res.data.data.length) {
          this.setState({
            categoryList: res.data.data,
          });
        }
        this.setState({ isEditCategory: false });
      })
      .catch((err) => {
        this.notificService.error(err && err.response && err.response.data.message ? err.response.data.message : 'Could not category name', '');
        console.log(err);
      });
  }

  onNewCategorySave() {
    this.articleService.createCategory({
      name: this.state.newCategory,
    })
      .then((res) => {
        this.notificService.success('Category Created!', '');
        if (res.data && res.data.data && res.data.data.length) {
          this.setState({
            categoryList: res.data.data,
          });
        }
        this.setState({ isAddNewCat: false });
      })
      .catch((err) => {
        this.notificService.error(err && err.response && err.response.data.message ? err.response.data.message : 'Could not create category', '');
        console.log(err);
      });
  }

  onCategoryNameEdit() {
    this.setState((prevState) => {
      prevState.editCatNameId = prevState.category;
      prevState.isEditCategory = true;
      prevState.editCatName = '';
      return prevState;
    });
  }

  render() {
    const blog = this.state.blog.map((line, index) => {
      if (line.isGist && line.gist) {
        return (
          <Row key={index} className="mt-3 mb-3">
            <Col xs="11">
              <Gist id={line.gist} />
            </Col>
            <Col xs="1">
              <Button
                className="remove-gist-mt-8"
                onClick={() => this.removeGist(index)}
                title="Remove gist"
                color="danger"
              >
                <FontAwesomeIcon icon="times" />
              </Button>
            </Col>
          </Row>
        );
      }

      if (line.isGist && !line.gist) {
        return (
          <Row key={index}>
            <Col>
              <GistText
                onChange={this.onGistTextChange}
                onCreateGist={this.onCreateGist}
                index={index}
                value={line.gistText}
              />
            </Col>
          </Row>
        );
      }

      if (line.isImage && !line.imageUrl) {
        return (
          <Row key={index}>
            <Col>
              <ImageText
                onChange={this.onImageTextChange}
                addImage={this.addImage}
                index={index}
                value={line.imageText}
              />
            </Col>
          </Row>
        );
      }

      if (line.isImage && line.imageUrl) {
        return (
          <Row key={index} className="mt-3 mb-3">
            <Col xs="11">
              <img src={line.imageUrl} style={{ width: '100%' }} alt="" />
            </Col>
            <Col xs="1">
              <Button
                className="remove-gist-mt-8"
                onClick={() => this.removeImage(index)}
                title="Remove image"
                color="danger"
              >
                <FontAwesomeIcon icon="times" />
              </Button>
            </Col>
          </Row>
        );
      }

      return (
        <Row key={index}>
          <Col>
            <Editable
              onNewLine={this.onEnterClick}
              data={line}
              index={index}
              disabled={false}
              isAutoFocus={this.state.blog.length === 2}
              isLast={index + 1 === this.state.blog.length}
              onChange={this.onBlogChange}
              removeItem={this.removeItem}
              setFocusToEnd={this.setFocusToEnd}
              setFocusToIndex={this.setFocusToIndex}
              setCurrentIndex={this.setCurrentIndex}
              isSetFocus={this.state.focusToIndex === index}
            />
          </Col>
        </Row>
      );
    });
    delete this.state.focusToIndex;
    return (
      <Container>
        <div className="editor">
          <EditCategoryName
            title="Edit category"
            onSave={this.onCategorySave}
            toggle={this.onModalToggle}
            isOpen={this.state.isEditCategory}
            catName={this.state.editCatName}
            onChange={(event) => this.setState({ editCatName: event.target.value })}
          />
          <EditCategoryName
            title="New category"
            onSave={this.onNewCategorySave}
            toggle={this.onAddCatModalToggle}
            isOpen={this.state.isAddNewCat}
            catName={this.state.newCategory}
            onChange={(event) => this.setState({ newCategory: event.target.value })}
          />
          <Row className="mb-4">
            <Col xs="6">
              <Button onClick={this.onBack} color="link">
                <FontAwesomeIcon icon="arrow-left" />
&nbsp;Back
                {' '}
              </Button>
            </Col>
          </Row>
          <Row>
            <Col xs="6">
              <FormGroup>
                <Label>Blog title</Label>
                <Input type="text" value={this.state.blogTitle} name="blogTitle" placeholder="Enter blog title" onChange={this.onTextChange} />
              </FormGroup>
            </Col>
            <Col xs="6">
              <FormGroup>
                <Label>Category</Label>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <Button disabled={!this.state.category} onClick={this.onCategoryNameEdit} color="info">
                      <FontAwesomeIcon icon="pen" />
                    </Button>
                  </InputGroupAddon>
                  <Input type="select" name="category" value={this.state.category} onChange={this.onComboChange}>
                    <option />
                    {this.state.categoryList.map((cat) => <option key={cat.catId} value={cat.catId}>{cat.catName}</option>)}
                  </Input>
                  <InputGroupAddon addonType="append">
                    <Button
                      onClick={() => this.setState((preState) => {
                        preState.isAddNewCat = !preState.isAddNewCat;
                        preState.newCategory = '';
                        return preState;
                      })}
                      color="info"
                    >
                      Add new
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
              </FormGroup>
            </Col>
            <Col xs="6">
              <FormGroup>
                <Label>Publish date</Label>
                <br />
                <DatePicker
                  name="blogDate"
                  className="form-control"
                  selected={this.utils.getDate(this.state.date)}
                  onChange={this.onDateChange}
                />
              </FormGroup>
            </Col>
            <Col xs="6">
              <FormGroup>
                <Label>Read mins</Label>
                <Input type="number" name="readTimeMin" value={this.state.readTimeMin} onChange={this.onChange} />
              </FormGroup>
            </Col>
            <Col xs="12" lg="12">
              <FormGroup>
                <Label>Description</Label>
                <Input type="textarea" name="description" value={this.state.description} onChange={this.onChange} />
              </FormGroup>
            </Col>
          </Row>
          {this.state.successBlock && (
          <Row>
            <Col xs="12" md="12">
              <Alert color="success">
                {this.state.successBlock.title}
              </Alert>
            </Col>
          </Row>
          )}
          {this.state.errorBlock && (
          <Row>
            <Col xs="12" md="12">
              <Alert color="danger">
                {this.state.errorBlock.title}
              </Alert>
            </Col>
          </Row>
          )}
          <div className="editor__container">
            <div className="toolbar">
              <Button outline onClick={(e) => this.setStyle(e, 'bold')} color="secondary" title="Bold text"><b>B</b></Button>
              <Button outline onClick={(e) => this.setStyle(e, 'italic')} color="secondary" title="Italic text"><i>I</i></Button>
              <Button outline onClick={(e) => this.setStyle(e, 'underline')} color="secondary" title="Underline text"><u>u</u></Button>
              <span className="sub-div" />
              <Button outline onClick={this.onCreateLink} color="secondary" title="Create link">
                <FontAwesomeIcon icon="link" />
              </Button>
              <Button
                disabled={isNaN(this.state.focusedIndex)}
                onClick={this.setQuote}
                outline
                color="secondary"
                title="Quote"
              >
                <FontAwesomeIcon icon="quote-left" />
              </Button>
              <span className="sub-div" />
              <Button className="main-heading-btn" disabled={isNaN(this.state.focusedIndex)} outline color="secondary" title="Main heading" onClick={this.onSetAsTitle}>T</Button>
              <Button className="sub-heading-btn" disabled={isNaN(this.state.focusedIndex)} outline color="secondary" title="Sub heading" onClick={this.onSetAsSubHeading}>T</Button>
              <span className="sub-div" />
              <Button disabled={isNaN(this.state.focusedIndex)} outline onClick={this.setAsGist} color="info" title="Add a gist">
                gist
              </Button>
              <Button disabled={isNaN(this.state.focusedIndex)} outline onClick={this.setAsImage} color="info" title="Add a image">
                <FontAwesomeIcon icon="file-image" />
              </Button>
              <Button disabled={isNaN(this.state.focusedIndex)} outline onClick={this.setAsCodeSection} color="secondary" title="Code section">
                <FontAwesomeIcon icon="code" />
              </Button>
              <Button disabled={isNaN(this.state.focusedIndex)} onClick={this.addNewLineAbove} outline color="secondary" title="New line">
                new line
              </Button>
              <Button color="info" onClick={this.onSave}>Save</Button>
            </div>
            {blog}
            <Row className="footer text-right">
              <Col xs="12"><Button color="info" onClick={this.onSave}>Save</Button></Col>
            </Row>
          </div>
        </div>
      </Container>
    );
  }
}

function GistText(props) {
  return (
    <div className="gist-text">
      <input
        autoFocus
        onChange={(event) => {
          const val = event.target.value;
          props.onChange(val, props.index);
        }}
        onKeyUp={(event) => {
          if (event.keyCode === 13) props.onCreateGist(props.index);
        }}
        value={props.value}
        name={props.index}
        className="gist-text__container"
      />
      {!props.value && <div className="gist-text__background">Paste gist link and press Enter</div>}
    </div>
  );
}

function ImageText({
  onChange,
  addImage,
  index,
  value,
}) {
  return (
    <div className="image-text">
      <input
        autoFocus
        onChange={({ target }) => {
          const { value: val } = target;
          onChange(val, index);
        }}
        onKeyUp={({ keyCode }) => {
          if (keyCode === 13) addImage(index);
        }}
        value={value}
        name={index}
        className="image-text__container"
      />
      {!value && <div className="image-text__background">Paste image link and press Enter</div>}
    </div>
  );
}

function EditCategoryName(props) {
  return (
    <Modal isOpen={props.isOpen} toggle={props.toggle}>
      <ModalHeader toggle={props.toggle}>{props.title}</ModalHeader>
      <ModalBody>
        <Row>
          <Col xs="12">
            <Input type="string" name="catName" value={props.catName} onChange={props.onChange} />
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={props.onSave}>Save</Button>
        <Button color="secondary" onClick={props.toggle}>Cancel</Button>
      </ModalFooter>
    </Modal>
  );
}
