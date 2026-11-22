#!/usr/bin/env python3
"""catalog.json 校验脚本
用法:
  python scripts/validate.py              # 只校验格式
  python scripts/validate.py --check-urls # 额外 HEAD 探测下载链接是否可达
"""
import json
import re
import sys
import urllib.request

REQUIRED = ["id", "name", "repo", "asset", "desc"]
REPO_RE = re.compile(r"^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$")
ID_RE = re.compile(r"^[a-zA-Z0-9_.-]+$")


def fail(msg):
    print(f"❌ {msg}")
    return 1


def main():
    check_urls = "--check-urls" in sys.argv
    try:
        with open("catalog.json", encoding="utf-8") as f:
            data = json.load(f)
    except Exception as e:
        return fail(f"catalog.json 不是合法 JSON: {e}")

    apps = data.get("apps")
    if not isinstance(apps, list):
        return fail("缺少 apps 数组")

    errors = 0
    seen_ids = set()
    for i, a in enumerate(apps):
        where = a.get("id", f"第{i}条")
        for k in REQUIRED:
            if not a.get(k):
                errors += fail(f"[{where}] 缺少必填字段: {k}")
        if not ID_RE.match(str(a.get("id", ""))):
            errors += fail(f"[{where}] id 含非法字符")
        if a.get("id") in seen_ids:
            errors += fail(f"[{where}] id 重复")
        seen_ids.add(a.get("id"))
        if not REPO_RE.match(str(a.get("repo", ""))):
            errors += fail(f"[{where}] repo 格式应为 用户名/仓库名")
        if " " in str(a.get("asset", "")):
            errors += fail(f"[{where}] asset 文件名不要带空格")

    if check_urls:
        for a in apps:
            url = f"https://github.com/{a['repo']}/releases/latest/download/{a['asset']}"
            try:
                req = urllib.request.Request(url, method="HEAD")
                code = urllib.request.urlopen(req, timeout=15).status
                print(f"{'✅' if code == 200 else '⚠️'} [{a['id']}] HTTP {code} {url}")
            except Exception as e:
                print(f"⚠️ [{a['id']}] 链接不可达: {e}")

    if errors:
        print(f"\n共 {errors} 个错误")
        return 1
    print(f"\n✅ 校验通过，共 {len(apps)} 个应用")
    return 0


if __name__ == "__main__":
    sys.exit(main())