#!/usr/bin/python3
"""
This is a Flask application that integrates with a static HTML template for AirBnB.
"""
from flask import Flask, render_template, url_for
from models import storage
import uuid

# Set up the Flask application
flask_app = Flask(__name__)
flask_app.url_map.strict_slashes = False
server_port = 5000
server_host = '0.0.0.0'


# Close the storage session after each request
@flask_app.teardown_appcontext
def close_storage_session(exc):
    """
    This function is called after each request to close the current SQLAlchemy session.
    """
    storage.close()


# Handle requests to a custom template with states, cities & amenities
@flask_app.route('/2-hbnb/')
def filter_hbnb(the_id=None):
    """
    This function handles requests to a custom template with states, cities, and amenities.
    """
    state_objects = storage.all('State').values()
    state_dict = dict([state.name, state] for state in state_objects)
    amenities = storage.all('Amenity').values()
    place_objects = storage.all('Place').values()
    user_dict = dict([user.id, "{} {}".format(user.first_name, user.last_name)]
                 for user in storage.all('User').values())
    unique_id = (str(uuid.uuid4()))
    return render_template('2-hbnb.html',
                           states=state_dict,
                           amens=amenities,
                           places=place_objects,
                           users=user_dict, 
                           cache_id=unique_id)

# Run the Flask application
if __name__ == "__main__":
    """
    This is the main Flask application.
    """
    flask_app.run(host=server_host, port=server_port)
