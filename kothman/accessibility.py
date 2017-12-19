# kothman.accessibility

try:
    from urlparse import urlparse
    import urllib2
    import bs4
except ImportError, err:
    print "couldn't load module. %s" % (err)
    

def fetch_url(url):
    """Return string containing HTML from requested URL"""
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64)"}
    request = urllib2.Request(url, None, headers)
    try:
        response = urllib2.urlopen(request)
        return response.read()
    except urllib2.URLError as e:
        print e.reason


def is_valid_url(url):
    """Return true if valid URL"""
    parsed_url = urlparse(url)
    if (parsed_url.scheme == 'https' or parsed_url.scheme == 'http') and parsed_url.netloc != '':
        return True
    return False


def parse_html(html):
    soup = bs4.BeautifulSoup(html, 'html.parser')
    return soup


def remove_tags(soup, tags):
    for tag in tags:
        [s.extract() for s in soup(tag)]
    return soup

def apply_to_all_tags(soup, function_list):
    for tag in soup.find_all(True):
        for f in function_list:
            tag = f(tag)
    return soup

def remove_all_attributes(tag):
    whitelist = {'a': ['href']};
    for attribute in tag.attrs.keys():
        if tag.name not in whitelist.keys() or attribute not in whitelist[tag.name]:
            tag.attrs.pop(attribute)
    return tag

def remove_empty_tags(tag):
    if tag.get_text().strip("\n\r\t ") == "":
        tag.extract()
    return tag

def normalize_tag_text(tag):
    if len(tag.contents) == 0 and tag.string is not None:
        tag.string = tag.string.lstrip("\n\r\t ").rstrip("\n\r\t ")
    return tag

def replace_tag_names(tag):
    tag_name_dict = {
        'button': 'span'
    }
    for key in tag_name_dict.keys():
        if tag.name == key:
            tag.name = tag_name_dict[key]
    return tag

def update_short_urls(soup, site_url):
    a_elements = soup.find_all('a')
    parsed_base_url = urlparse(site_url)
    base_url = parsed_base_url.scheme + '://' + parsed_base_url.netloc
    for a in a_elements:
        if a.attrs['href'] is not None:
            parsed_url = urlparse(a.attrs['href'])
            if parsed_url.scheme is '' and parsed_url.netloc is '':
                a.attrs['href'] = base_url + a.attrs['href']
        else:
            a.attrs['href'] = '#'
    return soup
