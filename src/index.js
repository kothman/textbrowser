import React from 'react';
import ReactDOM from 'react-dom';
import ReactObserver from 'react-event-observer';
import 'normalize.css';
import './style.scss';


class PageContent extends React.Component {
    render() {
	return <div className='page-content' dangerouslySetInnerHTML={{__html: this.props.htmlContent}}></div>;
    }
}

class BackButton extends React.Component {
    constructor(props) {
	super(props);
	this.observer = props.observer;
	
	this.state = {
	    history: []
	};
    }

    componentDidMount() {
	this.observer.subscribe('save url to history', this.saveUrlToHistory.bind(this));
	this.observer.respond('url input value', function() { return this.state.urlInputValue; });
    }
    
    render() {
	let disabled = false;
	if (this.state.history.length <= 1)
	    disabled = true;
	return <button type='button' disabled={disabled} className='back-button' onClick={this.handleBackButton.bind(this)}>Back</button>;
    }

    handleBackButton(e) {
	e.preventDefault()
	let history = this.state.history;
	if (history.length <= 1)
	    return;
	// first item is the current page
	history.pop();
	// url gets saved to history after loading the page
	let url = history[history.length - 1];
	console.log('back');
	this.setState({history: history});
	this.observer.publish('update url', url);
	this.observer.publish('retrieve page');
    }

    saveUrlToHistory(url) {
	let history = this.state.history;
	history.push(url);
	this.setState({history: history});
	console.log('saving to history');
	console.log(history);
    }
}

class BrowserForm extends React.Component {
    constructor(props) {
	super(props);
	this.state = {
	    urlInputValue: 'https://kothman.io'
	};
	this.observer = props.observer;
    }

    componentDidMount() {
	this.observer.subscribe('update url', this.updateUrl.bind(this));
    }
    
    render() {
	return (
		<form onSubmit={this.handleFormSubmit.bind(this)}>
		<input type='url' id='url' placeholder='https://...' value={this.state.urlInputValue} onChange={this.handleUrlChange.bind(this)} />
		<BackButton observer={this.observer} />
		<button type='button' onClick={this.handleFormSubmit.bind(this)} id='submit'>Submit</button>
	    </form>);

    }

    handleFormSubmit(e) {
	if (e)
	    e.preventDefault();
	this.observer.publish('save url to history', this.state.urlInputValue);
	this.observer.publish('retrieve page');
    }
    
    handleUrlChange(e) {
	this.setState({urlInputValue: e.target.value});
    }
    
    updateUrl(url) {
	this.setState({urlInputValue: url});
    }
}

class TextBrowser extends React.Component {

    constructor(props) {
	super(props);
	this.state = {
	    htmlContent: '',
	};
	this.observer = ReactObserver();
    }

    componentDidMount() {
	this.observer.subscribe('retrieve page', this.retrievePage.bind(this));
	document.getElementById('submit').click();
    }
    
    render() {
	return (
	    <div className='container'>
		<BrowserForm observer={this.observer} />
		<PageContent htmlContent={this.state.htmlContent} />
	    </div>
	);
    }

    retrievePage(e) {
	console.log('retrieving page');
	if (e)
	    e.preventDefault();
	let url = this.props.serverUrl + ':' + this.props.serverPort;
	let requestedUrl = document.getElementById('url').value;
	let queryString = '?url=' + requestedUrl;
	console.log(url + queryString);
	let xhr = new XMLHttpRequest();
	xhr.onreadystatechange = this.handleXhrChange.bind(this, xhr);
	xhr.open('GET', url + queryString, true);
	xhr.send();
    }
    
    handleXhrChange(xhr) {
	// If request is finished, update state with response data and
	// apply event listeners to all links on page
	if (xhr.readyState == 4) {
	    this.setState({htmlContent: xhr.responseText});
	    this.applyLinkEventListeners();
	}
    }

    applyLinkEventListeners() {
	let aElements = document.querySelectorAll('a');
	for (let i = 0; i < aElements.length; i++) {
	    let a = aElements[i];
	    a.addEventListener('click', this.linkEventListener.bind(this));
	}
    }

    linkEventListener(e) {
	e.preventDefault();
	let url = e.currentTarget.href;
	// If the link has an href attribute, update the state with urlInputValue
	// and get new page
	if (url) {
	    this.observer.publish('update url', url);
	    this.observer.publish('save url to history', url);
	    this.observer.publish('retrieve page');
	    scroll(0,0);
	}
    }
}

ReactDOM.render(
	<TextBrowser serverUrl='http://localhost' serverPort='8081'/>,
    document.getElementById('app-container')
);

