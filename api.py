from flask import Blueprint, jsonify
import json

api = Blueprint("api", __name__)


@api.route("/")
def index():
    return jsonify({"status": 200, "data": {}})


@api.route("/projects")
def projects():
    return jsonify(
        {
            "status": 200,
            "data": json.load(open("./data.json")),
        }
    )


@api.route("/<path:path>")
def notFound(path):
    return jsonify({"status": 404}), 404
