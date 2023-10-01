import http.server
import socketserver
import os
import signal

PORT = 4444


class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path.endswith(".wasm"):
            # Set the content type for wasm files
            self.send_header("Content-type", "application/wasm")
        super().do_GET()


def signal_handler(sig, frame):
    print("\nShutting down the server...")
    httpd.server_close()
    exit(0)


Handler = CustomHandler

# Handle Ctrl+C (SIGINT) signal to shut down the server gracefully
signal.signal(signal.SIGINT, signal_handler)

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print("Serving at port", PORT)
    httpd.serve_forever()
