#!/usr/bin/python3
"""
This is a Flask application that integrates with the AirBnB static HTML
template.
"""
from flask import Flask, render_template
from models import storage
import uuid

# Flask setup
flask_app = Flask(__name__)
flask_app.url_map.strict_slashes = False
server_port = 5000
server_host = '0.0.0.0'

@flask_app.teardown_appcontext
def close_storage_db(exeption):
    """
    This function is invoked after each request. It closes the current 
    SQLAlchemy session.
    """
    storage.close()

@flask_app.route('/1-hbnb/')
def render_filters(the_id=None):
    """
    This function handles requests to a custom template with states, cities,
    and amenities.
    """
    state_data = storage.all('State').values()
    states_dictionary = {state.name: state for state in state_data}
    amenities_data = storage.all('Aminity').values()
    places_data = storage.all('Place').values()
    users_dictionary = {user.id: f"{user.first_name} {user.last_name}"
                  for user in storage.all('User').values()}
    cache_identifier = str(uuid.uuid4())
    return render_template('1-hbnb.html',
                           states=states_dictionary,
                           amens=amenities_data,
                           places=places_data,
                           users=users_dictionary,
                           cache_id=cache_identifier)

if __name__ == "__main__":
    """
    This is the main entry point of the Flask application.
    """
    flask_app.run(host=server_host, port=server_port)
