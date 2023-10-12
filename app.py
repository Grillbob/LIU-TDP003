from flask import Flask, render_template, redirect, url_for
from api import api

app = Flask(__name__)
app.config.from_object("config")
app.register_blueprint(api, url_prefix="/api")


# General routes.
@app.route("/")
def index():
    return render_template("index.html")


@app.route("/about")
def stack():
    return render_template("about.html")


@app.route("/projects")
def projects():
    return render_template("projects.html")


@app.route("/projects/<id>")
def project(id):
    return render_template("project.html")


# Handle questionable route naming from the spec.
@app.route("/list")
def list():
    return redirect(url_for("projects"))


@app.route("/techniques")
def techniques():
    return redirect(url_for("projects"))


@app.route("/project/<id>")
def proj(id):
    return redirect(url_for("projects/" + id))


# Error handling.
@app.errorhandler(404)
def error_404(e):
    return render_template("errors/404.html")


@app.errorhandler(500)
def error_500(e):
    return render_template("errors/500.html")


# Prevent flask.run from getting run when using the CLI.
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
