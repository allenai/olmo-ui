import re


def is_content_toxic(content: str):
    with open("/api/dolma_search/static/bad_words/nsfw_wordlist.txt", "r") as file:
        nsfw_wordlist = set(file.read().splitlines())

    with open("/api/dolma_search/static/bad_words/really_bad_words.txt", "r") as file:
        really_bad_words = set(file.read().splitlines())

    sanitized_content = re.sub(r"[^\w\s]", " ", content)
    unique_words = set(sanitized_content.lower().split())

    return len(unique_words & really_bad_words) > 0 or (
        len(unique_words & nsfw_wordlist) >= 2
    )
