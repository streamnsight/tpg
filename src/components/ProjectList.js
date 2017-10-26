import React, { PureComponent } from 'react';
import './../css/App.css';

class ProjectList extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ul className="list">
                {
                    this.props.projects.map(function (project) {
                        return <li key={project} onClick={(e) => this.props.clickHandler(project)}
                        className={this.props.currentProject == project ? "highlight" : ""}>
                            {project}  <i className={this.props.active == project ? "fa fa-bell" : "fa fa-bell-slash-o"} aria-hidden="true"></i></li>
                    }.bind(this))
                }
            </ul>
        )
    }
}
export default ProjectList;
