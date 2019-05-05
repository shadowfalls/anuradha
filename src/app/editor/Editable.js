import React from 'react';
import ContentEditable from 'react-contenteditable'

export default class Editable extends React.Component {

    constructor(props) {
        super(props);
        this.contentEditable = React.createRef();

        this.state = { html: props.html ? props.html : '' };
        this.onChange = this.onChange.bind(this);
    }

    onChange(event) {
        this.props.onChange(event.target.value, this.props.index);
    }

    componentDidMount() {

        if (!this.contentEditable || !this.contentEditable.current)
            return;
        if (this.props.isAutoFocus && this.props.index === 0)
            this.contentEditable.current.focus();
        // setting event listiner for onKeyUp event
        if (!this.contentEditable.current.onkeyup) {
            this.contentEditable.current.onkeyup = (event) => {
                // goes to new line on (Shift + Enter)
                if (event.keyCode === 13 && (event.shiftKey || event.ctrlKey)) {
                    this.props.onNewLine(this.props.index);
                }
                // Down arrow press
                if (event.keyCode === 40 && (event.shiftKey || event.ctrlKey))
                    this.props.setFocusToIndex(this.props.index + 1);
                // Up arrow press
                if (event.keyCode === 38 && this.props.index - 1 >= 0 && (event.shiftKey || event.ctrlKey))
                    this.props.setFocusToIndex(this.props.index - 1);
            };
        }
        // setting event listiner for onKeyDown event
        if (!this.contentEditable.current.onkeydown) {
            this.contentEditable.current.onkeydown = (event) => {

                switch (event.keyCode) {
                    // prevent going to new line with in the same array element
                    // if enter is pressed along with shift
                    case 13:
                        if (event.shiftKey) {
                            event.preventDefault();
                        }
                        break;
                    // back space key is pressed
                    case 8:
                        if (!this.props.data.html)
                            this.props.removeItem(this.props.index);
                        break;

                }
            };
        }

        if (!this.contentEditable.current.onfocus)
            this.contentEditable.current.onfocus = (event) => {
                if (this.props.isLast)
                    this.props.setFocusToEnd();
                else
                    this.props.setCurrentIndex(this.props.index);
            };

        if (!this.contentEditable.current.onpaste)
            this.contentEditable.current.onpaste = (event) => {
                // removes any formatting from the string that was copied from outside
                event.preventDefault();
                const text = (event.originalEvent || event).clipboardData.getData('text/plain');
                window.document.execCommand('insertText', false, text);
            };
    }

    render() {
        if (this.props.isSetFocus && this.contentEditable.current) {
            this.props.onChange(this.props.data.html, this.props.index);
            this.contentEditable.current.focus();
        }
        let classList = [];
        if (!this.props.isLast)
            classList.push('mt-3');
        if (this.props.data.isQuoted)
            classList.push('quote');

        return <div className={classList.join(' ')}>
            <ContentEditable
                innerRef={this.contentEditable}
                html={this.props.data.html ? this.props.data.html : ''} // innerHTML of the editable div
                disabled={this.props.disabled}
                onChange={this.onChange} // handle innerHTML change
                tagName='div'
                className='no_outline' />
        </div>;
    }
}