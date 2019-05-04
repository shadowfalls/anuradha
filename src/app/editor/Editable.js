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
            
        // setting event listiner for onKeyUp event
        if (!this.contentEditable.current.onkeyup) {
            this.contentEditable.current.onkeyup = (event) => {
                if (event.keyCode === 13)
                    this.props.onNewLine(this.props.index);
            };
        }
        // setting event listiner for onKeyUp event
        if (!this.contentEditable.current.onkeydown) {
            this.contentEditable.current.onkeydown = (event) => {

                switch(event.keyCode) {
                    // prevent going to new line with in the same array element
                    case 13:
                        event.preventDefault();
                        break;
                    case 8:
                        if (!this.props.html)
                            this.props.removeItem(this.props.index);
                        break;

                }
            };
        }

        if (!this.contentEditable.current.onfocus)
            this.contentEditable.current.onfocus = (event) => {
                if (this.props.isLast)
                    this.props.setFocusToPrevious();
                else
                    this.props.setFocusIndex(this.props.index);
            };
    }

    render() {
        if (this.props.isSetFocus && this.contentEditable.current){
            this.props.onChange(this.props.html, this.props.index);
            this.contentEditable.current.focus();
        }

        return <ContentEditable
            innerRef={this.contentEditable}
            html={this.props.html ? this.props.html : ''} // innerHTML of the editable div
            disabled={this.props.disabled}
            onChange={this.onChange} // handle innerHTML change
            tagName='div'
            className='no_outline' />
    }
}