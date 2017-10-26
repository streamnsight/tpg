import React, { PureComponent } from 'react';
//import classnames from 'classnames';
import './../css/App.css';

class PageList extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.loading) {
            return <div className="loader">Loading...</div>
        }
        else {
            return (
                <ul>
                    {
                        this.props.pages.map(function (page) {
                            return <li key={page.pageid} onClick={(e) => this.props.clickHandler(page)}
                                       className={this.props.currentPage.title == page.title ? "highlight" : ""}
                            >{page.title} <i className={this.props.active == page ? "fa fa-bell" : "fa fa-bell-slash-o"} aria-hidden="true"></i></li>
                        }.bind(this))
                    }
                </ul>
            )
        }
    }
}
export default PageList;
