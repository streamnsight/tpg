import React, { PureComponent } from 'react';
import './../css/App.css';

class Page extends PureComponent {
    constructor(props) {
        super(props);

    }

    render() {
        if (this.props.loading) {
            return <div className="loader">Loading...</div>
        }
        else {
            return (
               <iframe src="https://en.wikipedia.com/wiki/{this.props.title}" width="100%" height="100%">
                      <p>Your browser does not support iframes.</p>
                </iframe>
            )
        }
    }
}
export default Page;
