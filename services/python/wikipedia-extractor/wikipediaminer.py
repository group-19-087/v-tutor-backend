import wikipediaapi
import json

wiki_wiki = wikipediaapi.Wikipedia(
    language='en',
    extract_format=wikipediaapi.ExtractFormat.WIKI
)


def mine_wiki_articles(page_titles):

    content = ""

    for title in page_titles:
        p_wiki = wiki_wiki.page(title)
        content += p_wiki.summary[0:10000]

    return content
