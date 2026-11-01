"""
Mira’s Beauty Touch — Python Multi-Device Host & Proxy Server
Where Beauty Meets Elegance

Usage:
    py server.py
    python server.py

This script allows you to view Mira's Beauty Touch on any mobile phone, tablet,
or computer connected to your local Wi-Fi / Hotspot, or online across the web.
"""

import os
import sys
import socket
import urllib.request
import urllib.error
from http.server import HTTPServer, SimpleHTTPRequestHandler
import json

PORT = int(os.environ.get("PORT", 8000))
BACKEND_API_URL = os.environ.get("BACKEND_API_URL", "http://127.0.0.1:5000")
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CLIENT_DIST = os.path.join(BASE_DIR, "client", "dist")
CLIENT_MEDIA = os.path.join(BASE_DIR, "client", "public", "media")


def get_local_ip():
    """Detect the local LAN / Wi-Fi / Hotspot IPv4 address."""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"


class MirasBeautyTouchHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        # Serve client/dist directory by default
        directory = CLIENT_DIST if os.path.exists(CLIENT_DIST) else BASE_DIR
        super().__init__(*args, directory=directory, **kwargs)

    def do_GET(self):
        # 1. Proxy API requests to backend Express server (port 5000)
        if self.path.startswith("/api/"):
            self.proxy_request("GET")
            return

        # 2. Serve static media assets directly
        if self.path.startswith("/media/"):
            media_file = os.path.join(CLIENT_MEDIA, self.path.replace("/media/", ""))
            if os.path.exists(media_file) and os.path.isfile(media_file):
                self.serve_file(media_file)
                return

        # 3. SPA Fallback: If not a static file with extension, serve index.html
        requested_file = os.path.join(CLIENT_DIST, self.path.lstrip("/"))
        if not os.path.exists(requested_file) and "." not in self.path.split("/")[-1]:
            index_path = os.path.join(CLIENT_DIST, "index.html")
            if os.path.exists(index_path):
                self.serve_file(index_path, content_type="text/html; charset=utf-8")
                return

        super().do_GET()

    def do_POST(self):
        if self.path.startswith("/api/"):
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length) if content_length > 0 else None
            self.proxy_request("POST", body=body)
        else:
            self.send_error(405, "Method Not Allowed")

    def do_PUT(self):
        if self.path.startswith("/api/"):
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length) if content_length > 0 else None
            self.proxy_request("PUT", body=body)
        else:
            self.send_error(405, "Method Not Allowed")

    def do_DELETE(self):
        if self.path.startswith("/api/"):
            self.proxy_request("DELETE")
        else:
            self.send_error(405, "Method Not Allowed")

    def serve_file(self, filepath, content_type=None):
        try:
            file_size = os.path.getsize(filepath)
            ext = os.path.splitext(filepath)[1].lower()
            types = {
                ".html": "text/html; charset=utf-8",
                ".js": "application/javascript",
                ".css": "text/css",
                ".json": "application/json",
                ".png": "image/png",
                ".jpg": "image/jpeg",
                ".jpeg": "image/jpeg",
                ".svg": "image/svg+xml",
                ".mp4": "video/mp4",
                ".webp": "image/webp",
            }
            ctype = content_type or types.get(ext, "application/octet-stream")

            # Handle Byte-Range requests for mobile Safari & Chrome video streaming
            range_header = self.headers.get("Range")
            if range_header and ext in (".mp4", ".webm", ".ogg"):
                parts = range_header.replace("bytes=", "").split("-")
                start = int(parts[0]) if parts[0] else 0
                end = int(parts[1]) if len(parts) > 1 and parts[1] else file_size - 1
                length = end - start + 1

                self.send_response(206)
                self.send_header("Content-Type", ctype)
                self.send_header("Content-Range", f"bytes {start}-{end}/{file_size}")
                self.send_header("Content-Length", str(length))
                self.send_header("Accept-Ranges", "bytes")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()

                with open(filepath, "rb") as f:
                    f.seek(start)
                    self.wfile.write(f.read(length))
                return

            with open(filepath, "rb") as f:
                data = f.read()

            self.send_response(200)
            self.send_header("Content-Type", ctype)
            self.send_header("Content-Length", str(len(data)))
            self.send_header("Accept-Ranges", "bytes")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(data)
        except Exception as e:
            self.send_error(500, f"Error serving file: {e}")

    def proxy_request(self, method, body=None):
        target_url = f"{BACKEND_API_URL}{self.path}"
        headers = {}
        for key, value in self.headers.items():
            if key.lower() not in ("host", "content-length"):
                headers[key] = value

        req = urllib.request.Request(target_url, data=body, headers=headers, method=method)
        try:
            with urllib.request.urlopen(req) as resp:
                resp_body = resp.read()
                self.send_response(resp.status)
                for header, value in resp.headers.items():
                    if header.lower() not in ("transfer-encoding", "content-length"):
                        self.send_header(header, value)
                self.send_header("Content-Length", str(len(resp_body)))
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(resp_body)
        except urllib.error.HTTPError as e:
            err_body = e.read()
            self.send_response(e.code)
            for header, value in e.headers.items():
                if header.lower() not in ("transfer-encoding", "content-length"):
                    self.send_header(header, value)
            self.send_header("Content-Length", str(len(err_body)))
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(err_body)
        except Exception as e:
            self.send_response(502)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"error": f"Failed to connect to backend: {e}"}).encode())


def print_banner(local_ip):
    try:
        if hasattr(sys.stdout, 'reconfigure'):
            sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

    print("\n" + "=" * 65)
    print("  *  MIRA'S BEAUTY TOUCH -- MULTI-DEVICE HOST (PYTHON)  *")
    print("=" * 65)
    print("  Status: ONLINE and ready for mobile phones & desktops\n")
    print(f"  * On your Phone (same Wi-Fi or Hotspot):")
    print(f"     -> http://{local_ip}:{PORT}")
    print(f"     -> http://{local_ip}:5173  (Vite Dev)")
    print()
    print(f"  * Online Public HTTPS URL (Any phone, worldwide):")
    print(f"     -> https://miras-beauty-touch.loca.lt")
    print(f"     Password / IP (if prompted): 102.90.102.160")
    print()
    print(f"  * On this Computer:")
    print(f"     -> http://localhost:{PORT}")
    print(f"     -> http://localhost:5173")
    print()
    print("  Press Ctrl+C to stop the Python server")
    print("=" * 65 + "\n")


def run():
    local_ip = get_local_ip()
    print_banner(local_ip)
    server_address = ("0.0.0.0", PORT)
    httpd = HTTPServer(server_address, MirasBeautyTouchHandler)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down Python server...")
        httpd.server_close()


if __name__ == "__main__":
    run()

