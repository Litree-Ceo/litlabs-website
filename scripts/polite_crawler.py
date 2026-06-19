import argparse
import csv
import time
import random
from collections import defaultdict, deque
from urllib.parse import urljoin, urlparse
from urllib.robotparser import RobotFileParser

import requests
from bs4 import BeautifulSoup

HEADERS = {"User-Agent": "PoliteCrawler/1.0 (+contact: you@example.com)"}

# Per‑host request tracking
last_request_time = defaultdict(float)
# Default delay per host (seconds). Can be adjusted based on robots.txt crawl‑delay if present.
host_delay = defaultdict(lambda: 2.0)


def get_robot_parser(seed_url):
    p = urlparse(seed_url)
    robots_url = f"{p.scheme}://{p.netloc}/robots.txt"
    rp = RobotFileParser()
    try:
        rp.set_url(robots_url)
        rp.read()
        # Respect crawl‑delay if the file provides it (seconds)
        crawl_delay = rp.crawl_delay(HEADERS["User-Agent"])  # may be None
        if crawl_delay is not None:
            host_delay[p.netloc] = max(host_delay[p.netloc], crawl_delay)
    except Exception:
        # If we can't fetch or parse robots.txt we just continue with defaults
        pass
    return rp, robots_url


def same_domain(url, netloc):
    try:
        return urlparse(url).netloc == netloc
    except Exception:
        return False


def wait_for_host(url):
    host = urlparse(url).netloc
    elapsed = time.time() - last_request_time[host]
    delay = host_delay[host]
    if elapsed < delay:
        # small jitter to avoid lock‑step pattern
        time.sleep(delay - elapsed + random.uniform(0, 0.3))


def fetch(url, session=None, max_retries=4):
    session = session or requests.Session()
    host = urlparse(url).netloc
    for attempt in range(max_retries):
        wait_for_host(url)
        try:
            resp = session.get(url, headers=HEADERS, timeout=15)
        except Exception:
            # Network error – treat as a retryable failure
            resp = None
        last_request_time[host] = time.time()
        if resp is None:
            # Back‑off on network errors
            backoff = min(60, 2 ** attempt * host_delay[host])
            time.sleep(backoff)
            continue
        if resp.status_code in (429, 503):
            # Respect Retry‑After if present, otherwise exponential back‑off
            retry_after = resp.headers.get("Retry-After")
            if retry_after and retry_after.isdigit():
                sleep_for = int(retry_after)
            else:
                sleep_for = min(60, 2 ** attempt * host_delay[host])
            time.sleep(sleep_for)
            # Increase future delay for this host modestly
            host_delay[host] = min(30.0, host_delay[host] * 1.5)
            continue
        # Successful response (including other status codes like 200, 301, etc.)
        return resp
    # Exhausted retries
    raise RuntimeError(f"Failed after {max_retries} attempts: {url}")


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

        # robots.txt check – fallback to allowing if parser missing can_fetch
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
            resp = fetch(url)
            status = resp.status_code
            ctype = resp.headers.get("content-type", "")
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

            soup = BeautifulSoup(resp.text, "html.parser")
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
    parser = argparse.ArgumentParser(description="Polite crawler with back‑off and per‑host throttling")
    parser.add_argument("seed_url")
    parser.add_argument("--max-pages", type=int, default=25)
    parser.add_argument("--delay", type=float, default=1.0, help="Base delay between requests (seconds)")
    parser.add_argument("--out", default="crawl_results.csv")
    args = parser.parse_args()

    rows, robots_url = crawl(args.seed_url, args.max_pages, args.delay)
    write_csv(rows, args.out)
    print(f"Robots: {robots_url}")
    print(f"Wrote {len(rows)} rows to {args.out}")

if __name__ == "__main__":
    main()
