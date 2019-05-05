import React from 'react';
import { Col, Row, Button, FormGroup, Label, Input } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Gist from 'react-gist';

import * as constants from '../core/constants';
import Editable from './Editable';
import Edit from '../models/edit.modal';

import './Editor.scss';

export default class Editor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            blog: [new Edit({ html: '', isQuoted: false }), new Edit({ html: '', isQuoted: false })],
            errors: {},
            blogTitle: '',
            focusedIndex: 0
        };
        this.onEnterClick = this.onEnterClick.bind(this);
        this.onChange = this.onChange.bind(this);
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
    }

    onEnterClick(index) {
        this.setState((preState) => {
            preState.blog.splice(index + 1, 0, new Edit({ html: '', isQuoted: false }));
            preState.focusToIndex = index + 1;
            return preState;
        });
    }

    onChange(value, index) {
        this.setState((preState) => {
            preState.blog[index].html = value;
            return preState;
        });
    }

    removeItem(index) {
        this.setState((preState) => {
            if (preState.blog.length <= 2)
                return preState;
            if (index === preState.blog.length - 2 
                && preState.blog[index-1].isGist)
                return preState;
            preState.blog.splice(index, 1);
            preState.focusToIndex = index - 1;
            return preState;
        })
    }

    setStyle(event, cmd) {
        if (!constants.exeCommands[cmd])
            return;
        document.execCommand(constants.exeCommands[cmd]);
    }

    onCreateLink(event) {
        const sele = window.getSelection();
        if (!sele.toString()) {
            alert('Select text to set link!');
            return;
        }
        const linkUrl = prompt("Enter URL:", "http://");
        if (!linkUrl) {
            alert('Enter valid url!');
            return;
        }
        const seleText = document.getSelection();
        document.execCommand('insertHTML', false, `<a href="${linkUrl}" title="${linkUrl}" target="_blank">${seleText}</a>`);
    }

    onTextToolbarChange(event) {
        const value = event.target.value;
        this.setState((preState) => {
            preState.linkText = value;
            preState.errors.linkText = preState.linkText ? false : true;
            return preState;
        });
    }

    setFocusToIndex(index) {
        if (isNaN(index))
            return;
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
            if (preState.blog[preState.focusedIndex])
                preState.blog[preState.focusedIndex].isQuoted = !preState.blog[preState.focusedIndex].isQuoted;
            return preState;
        });
    }

    setCurrentIndex(index) {
        if (isNaN(index))
            return;
        this.setState({ focusedIndex: index });
    }

    addNewLineAbove() {
        this.setState((preState) => {
            if (preState.blog[preState.focusedIndex])
                preState.blog.splice(preState.focusedIndex, 0, new Edit({ html: '', isQuoted: false }));
            return preState;
        });
        if (this.state.blog[this.state.focusedIndex])
            this.setState((preState) => {
                preState.focusToIndex = preState.focusedIndex;
                return preState;
            });
    }

    onTextChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    onSave() {

    }

    onGistTextChange(value, index) {
        this.setState(preState => {
            preState.blog[index].gistText = value;
            return preState;
        });
    }

    setAsGist() {
        this.setState(preState => {
            preState.blog[preState.focusedIndex].html = '';
            preState.blog[preState.focusedIndex].isGist = !!!preState.blog[preState.focusedIndex].isGist;
            return preState;
        });
    }

    onCreateGist(index) {
        this.setState(preState => {
            let temp = preState.blog[index].gistText;
            if (!temp){
                alert('Invalid gist');
                return preState;
            }
            const isGist = temp.indexOf('gist.github.com')
            if (isGist < 0) {
                alert('Invalid gist');
                return preState;
            }
            temp = temp.substring(isGist, temp.length);
            temp = temp.split('/');
            if (temp.length !== 3) {
                alert('Invalid gist');
                return preState;
            }
            // we need only the gist id
            preState.blog[index].gist = temp[2];
            // if the gist is added at the last line we need to add a extra line at the end to
            // enable further editing
            if (index  === preState.blog.length - 2)
                preState.blog.push(new Edit({ html: '', isQuoted: false }));
            return preState;
        });
    }

    removeGist(index) {
        if (this.state.blog.length === 2)
            this.setState(preState => {
                preState.blog[0] = new Edit({ html: '', isQuoted: false });
                return preState;
            });
        else
            this.removeItem(index);
    }

    render() {
        const blog = this.state.blog.map((line, index) => {

            if (line.isGist && line.gist)
                return <Row key={index} className="mt-3 mb-3">
                    <Col xs="11">
                        <Gist id={line.gist} />
                    </Col>
                    <Col xs="1">
                        <Button className="remove-gist-mt-8"
                        onClick={() => this.removeGist(index)} title="Remove gist" color="danger">
                            <FontAwesomeIcon icon="times" />
                        </Button>
                    </Col>
                </Row>;

            if (line.isGist && !line.gist)
                return <Row key={index}>
                    <Col>
                        <GistText
                            onChange={this.onGistTextChange}
                            onCreateGist={this.onCreateGist}
                            index={index}
                            value={line.gistText} />
                    </Col>
                </Row>;

            return <Row key={index}>
                <Col>
                    <Editable
                        onNewLine={this.onEnterClick}
                        data={line}
                        index={index}
                        disabled={false}
                        isAutoFocus={this.state.blog.length === 2}
                        isLast={index + 1 === this.state.blog.length}
                        onChange={this.onChange}
                        removeItem={this.removeItem}
                        setFocusToEnd={this.setFocusToEnd}
                        setFocusToIndex={this.setFocusToIndex}
                        setCurrentIndex={this.setCurrentIndex}
                        isSetFocus={this.state.focusToIndex === index} />
                </Col>
            </Row>
        });
        delete this.state.focusToIndex;
        return <div className="editor">
            <Row>
                <Col xs="6">
                    <FormGroup>
                        <Label>Blog title</Label>
                        <Input type="text" value={this.state.blogTitle} name="blogTitle" placeholder="Enter blog title" onChange={this.onTextChange} />
                    </FormGroup>
                </Col>
            </Row>
            <div className="editor__container">
                <div className="toolbar">
                    <Button outline onClick={(e) => this.setStyle(e, 'bold')} color="secondary" title="Bold text"><b>B</b></Button>
                    <Button outline onClick={(e) => this.setStyle(e, 'italic')} color="secondary" title="Italic text"><i>I</i></Button>
                    <Button outline onClick={(e) => this.setStyle(e, 'underline')} color="secondary" title="Underline text"><u>u</u></Button>
                    <Button outline onClick={this.onCreateLink} color="secondary" title="Underline text">
                        <FontAwesomeIcon icon="link" />
                    </Button>
                    <Button disabled={isNaN(this.state.focusedIndex)} onClick={this.setQuote}
                        outline
                        color="secondary" title="Underline text">
                        <FontAwesomeIcon icon="quote-left" />
                    </Button>
                    <Button disabled={isNaN(this.state.focusedIndex)} outline onClick={this.setAsGist} color="info" title="Underline text">
                        gist
                    </Button>
                    <Button disabled={isNaN(this.state.focusedIndex)} onClick={this.addNewLineAbove} outline color="secondary" title="Underline text">
                        new line
                    </Button>
                </div>
                {blog}
                <Row className="footer text-right">
                    <Col xs="12"><Button color="info" onClick={this.onSave}>Save</Button></Col>
                </Row>
            </div>
        </div>;
    }
}

function GistText(props) {

    return <div className="gist-text">
        <input autoFocus
            onChange={(event) => {
                const val = event.target.value;
                props.onChange(val, props.index);
            }}
            onKeyUp={(event) => {
                if (event.keyCode === 13)
                    props.onCreateGist(props.index);
            }}
            value={props.value}
            name={process.index}
            className="gist-text__container" />
        {!props.value && <div className="gist-text__background">Paste gist link and press Enter</div>}
    </div>;
}