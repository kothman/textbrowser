import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css';
import './style.css';

class PageContent extends React.Component {
    render() {
	return <div className='page-content' dangerouslySetInnerHTML={{__html: this.props.htmlContent}}></div>;
    }
}

class TextBrowser extends React.Component {

    constructor(props) {
	super(props);
	this.state = {
	    htmlContent: '<p>[page shows here]</p>',
	};
    }
    
    render() {
	return (
		<div className='container'>
		<form onSubmit={this.retrievePage.bind(this)}>
		<input type='url' id='url' placeholder='https://...' />
		<button type='button' onClick={this.retrievePage.bind(this)}>Go =></button>
		</form>
		<PageContent htmlContent={this.state.htmlContent} />
		</div>
	);
    }

    retrievePage(e) {
	e.preventDefault();
	let url = this.props.serverUrl + ':' + this.props.serverPort;
	let requestedUrl = document.getElementById('url').value;
	let queryString = '?url=' + requestedUrl;
	let xhr = new XMLHttpRequest();
	this.xhr = xhr;
	xhr.onreadystatechange = this.handleXhrChange.bind(this, xhr);
	xhr.open('GET', url + queryString, true);
	xhr.send();
    }
    
    handleXhrChange(xhr) {
	if (xhr.readyState == 4)
	    console.log(xhr);
	    this.setState({htmlContent: xhr.responseText});
    }
}

ReactDOM.render(
	<TextBrowser serverUrl='http://localhost' serverPort='8081'/>,
    document.getElementById('app-container')
);

