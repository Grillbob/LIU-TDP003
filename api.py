"""API routing factory."""
from flask import Blueprint, jsonify
import json

api = Blueprint("api", __name__)
"""Flask child-router for API routes."""


@api.route("/projects")
def projects():
    """API route returning project data from `data.json`."""
    return jsonify(
        {
            "status": 200,
            "data": json.load(open("./data.json")),
        }
    )


@api.route("/<path:path>")
def notFound(path: str):
    """API catch-all route, essentially if not practically a regular 404 page."""
    return jsonify({"status": 404}), 404
