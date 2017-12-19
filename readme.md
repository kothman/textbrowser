# Text Browser

Python library and server for fetching a URL and stripping the html of styling/attributes/tags, with a demo in React.

## Features
- Displays web pages without any extra styling for distraction-free reading
- Simple back button/browser history
- Links don't take you away from the web app

## Limitations
- No JavaScript, so it won't render other javascript web applications properly
- No download handling
- Extra page content (like navigation, header) can sometimes take up too much space when styling is removed
- It's a tool I made for personal, local use, so I didn't put much thought into security


## Requirements
- npm
- python 2.7
- pip

## Setup
$ `npm i`
Install the Beautiful Soup python module
$ `npm run setup`

## Build & Start Servers
$ `npm run start`

## To-Do
- Replace images with links instead of just removing them
- Have the python server keep track of cookies and send cookies to client along with HTML
- Allow for form submission
