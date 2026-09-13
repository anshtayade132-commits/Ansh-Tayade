"""
=============================================================================
ANSH TAYADE - LOCAL DEVELOPMENT SERVER
=============================================================================
Run this script using Python to launch your portfolio website locally:
    python serve.py
=============================================================================
"""

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 3000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def log_message(self, format, *args):
        # Clean terminal logging
        sys.stdout.write(f"[Subspace Network] {self.address_string()} - {format % args}\n")

def run():
    global PORT
    os.chdir(DIRECTORY)
    
    while True:
        try:
            with socketserver.TCPServer(("", PORT), Handler) as httpd:
                url = f"http://localhost:{PORT}"
                print("\n" + "=" * 65)
                print("🌌  ANSH TAYADE - FUTURISTIC GALAXY DEVELOPER PORTFOLIO")
                print("=" * 65)
                print(f"🚀  Local Cosmic Server active at: {url}")
                print("✨  Interactive starfield, mouse gravity & 3D tilt ready!")
                print("🛑  Press Ctrl+C in this terminal to stop the server.")
                print("=" * 65 + "\n")
                
                # Automatically open browser
                try:
                    webbrowser.open(url)
                except Exception:
                    pass
                    
                httpd.serve_forever()
        except OSError:
            PORT += 1

if __name__ == '__main__':
    try:
        run()
    except KeyboardInterrupt:
        print("\n[Subspace Network] Cosmic server safely deactivated.")
