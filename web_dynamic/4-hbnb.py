#!/usr/bin/python3
"""
This is a Flask application that integrates with the AirBnB static HTML template.
"""
from flask import Flask, render_template
from models import storage
import uuid

# Setting up Flask
app = Flask(__name__)
app.url_map.strict_slashes = False
server_port = 5000
server_host = '0.0.0.0'

@app.teardown_appcontext
def close_storage(exception):
    """
    This method is called after each request. It closes the current SQLAlchemy Session.
    """
    storage.close()

@app.route('/4-hbnb/')
def display_filters(the_id=None):
    """
    This function handles requests to a custom template with states, cities, and amenities.
    """
    state_objects = storage.all('State').values()
    states_dict = {state.name: state for state in state_objects}
    amenities = storage.all('Amenity').values()
    places = storage.all('Place').values()
    users_dict = {user.id: f"{user.first_name} {user.last_name}"
                  for user in storage.all('User').values()}
    cache_id = str(uuid.uuid4())
    return render_template('4-hbnb.html',
                           states=states_dict,
                           amens=amenities,
                           places=places,
                           users=users_dict, 
                           cache_id=cache_id)

if __name__ == "__main__":
    """
    This is the main entry point of the Flask application.
    """
    app.run(host=server_host, port=server_port)
