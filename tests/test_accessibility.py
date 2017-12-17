import unittest
from kothman import accessibility

class Test_Accessibility(unittest.TestCase):
    def test_fetch_url(self):
        url = 'https://kothman.io/CNAME'
        response = accessibility.fetch_url(url)
        self.assertEqual(response, 'kothman.io')
    
    def test_is_valid_url(self):
        self.assertEqual(accessibility.is_valid_url('https://kothman.io'), True)
    
    def test_remove_tags(self):
        html=accessibility.parse_html('<html><head></head><body><script></script></body></html>')
        clean_html=accessibility.remove_tags(html, ['head', 'script'])
        self.assertEqual('<html><body></body></html>', str(clean_html))


if __name__ == '__main__':
    unittest.main();
