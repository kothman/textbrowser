try:
    from kothman import accessibility
    from urlparse import urlparse, parse_qs
    import sys
    import SocketServer
    from BaseHTTPServer import BaseHTTPRequestHandler
except ImportError, err:
    print "couldn't load module. %s" % (err)


class Handler(BaseHTTPRequestHandler):
    def handle_request(self):
        print self.path
        query_components = parse_qs(urlparse(self.path).query)
        if len(query_components['url']) < 1:
            print 'URL not provided'
            return self.error('URL not provided')
        url = query_components['url'][0]
        if not accessibility.is_valid_url(url):
            print 'Not a valid URL: "' + url + '"'
            return self.error(url + ' is not a valid URL');
        html = accessibility.fetch_url(url)
        soup = accessibility.parse_html(html)
        soup = accessibility.remove_tags(soup, [
            'head',
            'script',
            'style',
            'img',
            'svg'
        ])
        soup = accessibility.apply_to_all_tags(soup, [
            accessibility.remove_all_attributes,
            accessibility.remove_empty_tags,
            accessibility.normalize_tag_text
        ])
        return str(soup)
            
    def do_GET(self):
        html = self.handle_request()
        self.send_response(200)
        self.send_header('Content-Type', 'text/html')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(html)

    def error(msg):
        return '<p class="error">' + msg + '</p>'

if len(sys.argv) != 2:
    print 'Usage: "python server.py [PORT]"'
    sys.exit(2)

port = sys.argv[1]
httpd = SocketServer.TCPServer(("", int(port)), Handler)
print 'Starting python server at localhost:' + port
httpd.serve_forever()
