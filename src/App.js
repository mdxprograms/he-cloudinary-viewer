import React, { Component } from "react";
import axios from "axios";
import { CloudinaryContext, Image } from "cloudinary-react";

import mediaFolders from "./media-folders.json";

const url = folder =>
  `https://res.cloudinary.com/highereducation/image/list/${folder}.json`;

const Gallery = ({ images }) => (
  <div className="gallery col-sm-12 card-deck">
    {images.map((image, index) => (
      <div key={index} className="col-sm-6 col-lg-4 card h-100">
        <div className="card-block">
          <Image publicId={image.public_id} width="300" />
        </div>
        <code>
          https://res.cloudinary.com/highereducation/image/upload/v1/
          {image.public_id}
        </code>
      </div>
    ))}
  </div>
);

class App extends Component {
  state = {
    folder: "BestColleges.com",
    fetching: false,
    images: [],
    query: ""
  };

  fetchImages = () => {
    this.setState({ fetching: true, images: [] });

    axios(url(this.state.folder))
      .then(res => {
        this.setState({ images: res.data.resources });
      })
      .then(() => {
        this.setState({ fetching: false });
      });
  };

  parseImgId = imgId =>
    imgId
      .replace(this.state.folder, "")
      .replace("-", " ")
      .toLowerCase();

  handleFolderSelect = ev => {
    if (mediaFolders.includes(ev.currentTarget.value)) {
      this.setState({ folder: ev.currentTarget.value }, this.fetchImages);
    }
  };

  handleSearchInput = ev => this.setState({ query: ev.currentTarget.value });

  handleSearchSubmit = () => {
    if (this.state.query.length > 0) {
      const images = this.state.images.filter(image =>
        this.parseImgId(image.public_id).includes(this.state.query)
      );

      this.setState({ images });
    }
  };

  render() {
    return (
      <div className="App container-fluid content-row">
        <nav className="navbar navbar-default">
          <div className="nav-item">
            <input
              type="text"
              className="field"
              onChange={this.handleSearchInput}
              placeholder="Search images"
            />
            <button
              onClick={this.handleSearchSubmit}
              className="btn btn-primary"
            >
              Submit
            </button>
            <button onClick={this.fetchImages} className="btn btn-danger">
              Reset
            </button>
            <select onChange={this.handleFolderSelect}>
              <option defaultValue="">Select a folder for images</option>
              {mediaFolders.map(folder => (
                <option value={folder}>{folder}</option>
              ))}
            </select>
          </div>
        </nav>
        {this.state.fetching && <div>Fetching...</div>}
        <div className="row">
          <CloudinaryContext cloudName="highereducation">
            <Gallery images={this.state.images} />
          </CloudinaryContext>
        </div>
      </div>
    );
  }
}

export default App;
