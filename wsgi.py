"""
WSGI entry point for production servers.
This imports the Flask application from app.py.
"""
from app import app

if __name__ == "__main__":
    app.run()
