from GoogleScraper import scrape_with_config, GoogleSearchError

def getUrls(keyword):
    print(keyword)

    config = {
        'use_own_ip': 'False',
        'keyword': keyword + " site:en.wikipedia.org",
        'search_engines': ['bing', ],
        'num_pages_for_keyword': 1,
        'scrape_method': 'http',
        'do_caching': 'False',

    }

    try:
        search = scrape_with_config(config)
    except GoogleSearchError as e:
        print(e)

    return search.serps
