import React, { PureComponent } from 'react';
import './../css/App.css';

class SubscribeButton extends PureComponent {

    render() {
        return <span className="button" onClick={() => this.props.clickHandler()}>{this.props.active ? "UnSubscribe" : "Subscribe" }</span>
    }
}
export default SubscribeButton;
