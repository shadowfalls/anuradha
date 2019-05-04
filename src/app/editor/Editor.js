import React from 'react';
import { Col, Row, Button, FormGroup, Label, Input } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import * as constants from '../core/constants';
import Editable from './Editable';
import './Editor.scss';

export default class Editor extends React.Component {

    constructor(props) {
        super(props);
        this.state = { blog: ['1212', ''], errors:{} };
        this.onEnterClick = this.onEnterClick.bind(this);
        this.onChange = this.onChange.bind(this);
        this.removeItem = this.removeItem.bind(this);
        this.setFocusToPrevious = this.setFocusToPrevious.bind(this);
        this.onCreateLink = this.onCreateLink.bind(this);
        this.onTextToolbarChange = this.onTextToolbarChange.bind(this);
        this.setQuote = this.setQuote.bind(this);
        this.setFocusIndex = this.setFocusIndex.bind(this);
        this.addNewLineAbove = this.addNewLineAbove.bind(this);
    }

    onEnterClick(index) {
        this.setState((preState) => {
            preState.blog.splice(index + 1, 0, '');
            preState.focusToIndex = index + 1;
            return preState;
        });
    }

    onChange(value, index) {
        this.setState((preState) => {
            preState.blog[index] = value;
            return preState;
        });
    }

    removeItem(index) {
        this.setState((preState) => {
            if (preState.blog.length <= 2)
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

    setFocusToPrevious() {
        this.setState((preState) => {
            preState.focusToIndex = preState.blog.length - 2;
            return preState;
        });
    }

    setQuote() {
        this.setState((preState) => {
            if (preState.blog[preState.focusedIndex])
                preState.blog[preState.focusedIndex] = `<div class="quote">${preState.blog[preState.focusedIndex]}</div>`;
            return preState;
        });
    }

    setFocusIndex(index) {
        if (isNaN(index))
            return;
        this.setState({focusedIndex: index});
    }

    addNewLineAbove() {
        this.setState((preState) => {
            if (preState.blog[preState.focusedIndex])
                preState.blog.splice(preState.focusedIndex, 0, '');
            return preState;
        });
        if (this.state.blog[this.state.focusedIndex])
            this.setState((preState) =>{
                preState.focusToIndex = preState.focusedIndex;
                return preState;
            });
    }

    render() {
        const blog = this.state.blog.map((line, index) => {

            return <Row key={index}>
                <Col>
                    <Editable
                        onNewLine={this.onEnterClick}
                        html={line}
                        index={index}
                        disabled={false}
                        isLast={index + 1 === this.state.blog.length}
                        onChange={this.onChange}
                        removeItem={this.removeItem}
                        setFocusToPrevious={this.setFocusToPrevious}
                        setFocusIndex={this.setFocusIndex}
                        isSetFocus={this.state.focusToIndex === index} />
                </Col>
            </Row>
        });
        delete this.state.focusToIndex;
        return <div className="editor">
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
                    <Button outline color="info" title="Underline text">
                        gist
                    </Button>
                    <Button disabled={isNaN(this.state.focusedIndex)} onClick={this.addNewLineAbove} outline color="secondary" title="Underline text">
                        new line
                    </Button>
                </div>
                {blog}
            </div>
        </div>;
    }
}