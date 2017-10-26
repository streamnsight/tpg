import React, { PureComponent } from 'react';
import './css/App.css';
import { default as ProjectList } from './components/ProjectList';
import { default as PageList } from './components/PageList';
import { default as PageMeta } from './components/PageMeta';
import { default as SubscribeButton } from './components/SubscribeButton';
import { default as WebsocketService } from './services/WebsocketService';


class App extends PureComponent {

    state = {
        projects: [],
        projectsLoaded: false,
        projectsLoading: false,
        currentProject: null,
        projectSubscribed: null,
        pages: [],
        pagesLoaded: false,
        pagesLoading: false,
        currentPage: {},
        pageLoading: false,
        pageSubscribed: null,
        error: null
    };

    componentWillMount() {
        this.WsService = new WebsocketService();

        this.WsService.onOpen = (e) => {
            this.setState({projectsLoading: true});
            this.getProjects(0);
        };

        this.WsService.onError = (e) => {
            this.setState({error: 'WebSocket error'});
        };

        this.WsService.onMessage = (e) => {
            console.log(e);
            let r = JSON.parse(e.data);
            switch (r.name) {
                case "project.list":
                    this.setState({
                        projects: r.data,
                        projectsLoaded: true,
                        projectsLoading: false,
                        currentProject: r.data[0]
                    });
                    if (r.data.length) {
                        this.getPages(r.data[0]);
                    }
                    break;
                case "project.update":
                    this.setState(Object.assign(this.state.pages, r.data));
                    break;
                case "page.list":
                    this.setState({pages: r.data, pagesLoaded: true, pagesLoading: false});
                    if (r.data.length) {
                        this.getPage(r.data[0]);
                    }
                    break;
                case "page.query":
                    this.setState(Object.assign({}, this.state.currentPage, r.data, {pageLoading: false}));
                    break;
                case "page.update":
                    this.setState(Object.assign(this.state.currentPage, r.data));
                    break;
            }
        }
    }

    componentWillUnmount() {
        this.WsService.Close();
    }

    getProjects = (id) => {
        this.WsService.Send({
            "id": id,
            "name": "project.list",
            "args": {}
        });
    };

    getPages = (project) => {
        let id = 2;
        if (!this.state.pagesLoading) {
            this.WsService.Send({
                "id": id,
                "name": "page.list",
                "args": {
                    project: project
                }
            });
            this.setState({currentProject: project, pagesLoading: true});
        }
    };


    getPage = (page) => {
        this.WsService.Send({
            "id": page.pageid,
            "name": "page.query",
            "args": {
                pageId: page.pageid
            }
        });
        this.setState({currentPage: page, pageLoading: true});
    };

    subscribeToProjectUpdates = (project) => {
        // unsubscribe to any other project if subscribed
        if (this.state.projectSubscribed != null) {
            this.unsubscribeFromProjectUpdates(this.state.projectSubscribed);
        }
        this.WsService.Send({
            "id": project,
            "name": "project.subscribe",
            "args": {
                project: project
            }
        });
        this.setState({projectSubscribed: project});
    };

    unsubscribeFromProjectUpdates = (project) => {
        this.WsService.Send({
            "id": project,
            "name": "project.unsubscribe",
            "args": {}
        });
        this.setState({projectSubscribed: null});
    };

    toggleSubscribeToProjectUpdates = () => {
        if (this.state.projectSubscribed == this.state.currentProject) {
            this.unsubscribeFromProjectUpdates(this.state.currentProject);
        }
        else {
            this.subscribeToProjectUpdates(this.state.currentProject);
        }
    };

    subscribeToPageUpdates = (page) => {
        // unsubscribe to any other page if subscribed
        if (this.state.pageSubscribed != null) {
            this.unsubscribeFromPageUpdates(this.state.pageSubscribed);
        }
        this.WsService.Send({
            "id": page.pageid,
            "name": "page.subscribe",
            "args": {
                pageId: page.pageid
            }
        });
        this.setState({pageSubscribed: page});
    };

    unsubscribeFromPageUpdates = (page) => {
        this.WsService.Send({
            "id": page.pageid,
            "name": "page.unsubscribe",
            "args": {}
        });
        this.setState({pageSubscribed: null});
    };

    toggleSubscribeToPageUpdates = () => {
        if (this.state.pageSubscribed == this.state.currentPage) {
            this.unsubscribeFromPageUpdates(this.state.currentPage);
        }
        else {
            this.subscribeToPageUpdates(this.state.currentPage);
        }
    };

    render() {
        return (
            <div className="container">
                <div className="projects">
                    <h1>Projects</h1>
                    {this.state.error &&
                    <div className="alert alert-danger">
                        <a onClick={() => this.setState({ error: null })} className="pull-right">x</a>
                        {this.state.error}
                    </div>}
                    <ProjectList projects={this.state.projects} currentProject={this.state.currentProject}
                                 clickHandler={this.getPages}
                                 active={this.state.projectSubscribed}
                    />
                </div>
                <div className="pages">
                    <h1>Project: {this.state.projects && this.state.currentProject}
                        <SubscribeButton active={this.state.currentProject == this.state.projectSubscribed}
                                         clickHandler={this.toggleSubscribeToProjectUpdates}/>
                    </h1>
                    <PageList pages={this.state.pages}
                              currentPage={this.state.currentPage}
                              clickHandler={this.getPage}
                              loading={this.state.pagesLoading}
                              active={this.state.pageSubscribed && this.state.pageSubscribed.pageid}
                    />
                </div>
                <div className="page">
                    <h1>{this.state.currentPage && this.state.currentPage.title}
                        <SubscribeButton active={this.state.currentPage == this.state.pageSubscribed}
                                         clickHandler={this.toggleSubscribeToPageUpdates}/>
                    </h1>
                    <PageMeta page={this.state.currentPage}
                              loading={this.state.pageLoading}
                    />

                </div>
            </div>

        )
    }
}
export default App;
