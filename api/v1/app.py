#!/usr/bin/python3
"""
This is a Flask application that integrates with a static HTML template for AirBnB.
"""
from api.v1.views import app_views
from flask import Flask, jsonify, make_response, render_template, url_for
from flask_cors import CORS
from flasgger import Swagger
from models import storage
import os
from werkzeug.exceptions import HTTPException

# Create a Flask application instance
flask_app = Flask(__name__)
swagger_ui = Swagger(flask_app)

# Configure the application's URL map
flask_app.url_map.strict_slashes = False

# Set up the server environment
server_host = os.getenv('HBNB_API_HOST', '0.0.0.0')
server_port = os.getenv('HBNB_API_PORT', 5000)

# Set up Cross-Origin Resource Sharing
cors_setup = CORS(flask_app, resources={r"/api/v1/*": {"origins": "*"}})

# Register the Blueprint
flask_app.register_blueprint(app_views)


# Close the storage session after each request
@flask_app.teardown_appcontext
def close_storage_session(exception):
    """
    This function is called after each request to close the current SQLAlchemy session.
    """
    storage.close()


# Handle 404 errors
@flask_app.errorhandler(404)
def handle_not_found_error(exception):
    """
    This function handles 404 errors if the global error handler fails.
    """
    error_code = exception.__str__().split()[0]
    error_description = exception.description
    error_message = {'error': error_description}
    return make_response(jsonify(error_message), error_code)


# Handle 400 errors
@flask_app.errorhandler(400)
def handle_bad_request_error(exception):
    """
    This function handles 400 errors if the global error handler fails.
    """
    error_code = exception.__str__().split()[0]
    error_description = exception.description
    error_message = {'error': error_description}
    return make_response(jsonify(error_message), error_code)


# Handle all error status codes
@flask_app.errorhandler(Exception)
def handle_all_errors(err):
    """
    This function is a global route to handle all error status codes.
    """
    if isinstance(err, HTTPException):
        if type(err).__name__ == 'NotFound':
            err.description = "Not found"
        error_message = {'error': err.description}
        error_code = err.code
    else:
        error_message = {'error': err}
        error_code = 500
    return make_response(jsonify(error_message), error_code)


# Update the HTTPException class with a custom error function
def setup_all_errors():
    """
    This function updates the HTTPException class with a custom error function.
    """
    for error_class in HTTPException.__subclasses__():
        flask_app.register_error_handler(error_class, handle_all_errors)


# Run the Flask application
if __name__ == "__main__":
    """
    This is the main Flask application.
    """
    # Initialize global error handling
    setup_all_errors()
    # Start the Flask application
    flask_app.run(host=server_host, port=server_port)
