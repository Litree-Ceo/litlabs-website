import argparse
import csv
import time
from collections import deque
from urllib.parse import urljoin, urlparse
from urllib.robotparser import RobotFileParser

import requests
from bs4 import BeautifulSoup

HEADERS = {
    "User-Agent": "BasicCrawler/1.0 (+contact: you@example.com)"
}


def get_robot_parser(start_url):
    p = urlparse(start_url)
    robots_url = f"{p.scheme}://{p.netloc}/robots.txt"
    rp = RobotFileParser()
    try:
        rp.set_url(robots_url)
        rp.read()
    except Exception:
        pass
    return rp, robots_url


def same_domain(url, netloc):
    try:
        return urlparse(url).netloc == netloc
    except Exception:
        return False


def crawl(seed_url, max_pages=25, delay=1.0):
    seed = urlparse(seed_url)
    netloc = seed.netloc
    rp, robots_url = get_robot_parser(seed_url)

    visited = set()
    queue = deque([seed_url])
    rows = []

    while queue and len(visited) < max_pages:
        url = queue.popleft()
        if url in visited:
            continue
        visited.add(url)

        if hasattr(rp, "can_fetch") and not rp.can_fetch(HEADERS["User-Agent"], url):
            rows.append({
                "url": url,
                "status": "blocked_by_robots",
                "title": "",
                "h1": "",
                "canonical": "",
                "description": "",
                "out_links": 0,
            })
            continue

        try:
            r = requests.get(url, headers=HEADERS, timeout=15)
            status = r.status_code
            ctype = r.headers.get("content-type", "")

            if "text/html" not in ctype:
                rows.append({
                    "url": url,
                    "status": f"non_html_{status}",
                    "title": "",
                    "h1": "",
                    "canonical": "",
                    "description": "",
                    "out_links": 0,
                })
                time.sleep(delay)
                continue

            soup = BeautifulSoup(r.text, "html.parser")

            title = soup.title.string.strip() if soup.title and soup.title.string else ""
            h1_tag = soup.find("h1")
            h1 = h1_tag.get_text(" ", strip=True) if h1_tag else ""

            canonical = ""
            canon = soup.find("link", rel=lambda v: v and "canonical" in v.lower() if isinstance(v, str) else False)
            if canon and canon.get("href"):
                canonical = urljoin(url, canon["href"])

            description = ""
            meta = soup.find("meta", attrs={"name": "description"})
            if meta and meta.get("content"):
                description = meta["content"].strip()

            out_links = 0
            for a in soup.find_all("a", href=True):
                abs_url = urljoin(url, a["href"].split("#")[0])
                if abs_url.startswith(("http://", "https://")) and same_domain(abs_url, netloc):
                    out_links += 1
                    if abs_url not in visited:
                        queue.append(abs_url)

            rows.append({
                "url": url,
                "status": status,
                "title": title,
                "h1": h1,
                "canonical": canonical,
                "description": description,
                "out_links": out_links,
            })

        except Exception as e:
            rows.append({
                "url": url,
                "status": f"error_{type(e).__name__}",
                "title": "",
                "h1": "",
                "canonical": "",
                "description": "",
                "out_links": 0,
            })

        time.sleep(delay)

    return rows, robots_url


def write_csv(rows, out_path):
    with open(out_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(
            f,
            fieldnames=["url", "status", "title", "h1", "canonical", "description", "out_links"],
        )
        writer.writeheader()
        writer.writerows(rows)


def main():
    ap = argparse.ArgumentParser(description="Basic respectful crawler")
    ap.add_argument("seed_url")
    ap.add_argument("--max-pages", type=int, default=25)
    ap.add_argument("--delay", type=float, default=1.0)
    ap.add_argument("--out", default="crawl_results.csv")
    args = ap.parse_args()

    rows, robots_url = crawl(args.seed_url, args.max_pages, args.delay)
    write_csv(rows, args.out)
    print(f"Robots: {robots_url}")
    print(f"Wrote {len(rows)} rows to {args.out}")


if __name__ == "__main__":
    main()
