import React, { PureComponent } from 'react';
import './../css/App.css';

class PageMeta extends PureComponent {

    render() {
        if (this.props.loading) {
            return <div className="loader">Loading...</div>
        }
        else {
            return (
                <ul>
                    {Object.keys(this.props.page).map((k) => {
                        return <li key={k}>{k}: {JSON.stringify(this.props.page[k])}</li>
                    })}
                </ul>

            )
        }
    }
}
export default PageMeta;
