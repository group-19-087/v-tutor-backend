import googlescraper
import wikipediaminer
import sys

keyword = sys.argv[1]

# print(keyword)

links = list()

for serp in googlescraper.getUrls(keyword):
    for link in serp.links:
        pageTitle = str(link.title)[:-12]
        if pageTitle:
            links.append(pageTitle)

wiki = wikipediaminer.mine_wiki_articles(links[:2])

for line in wiki.splitlines():
    print(line)
    sys.stdout.flush()

sys.stdout.flush()
