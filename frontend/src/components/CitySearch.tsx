import React, { Component } from 'react';

interface CitySearchProps { }

interface CitySearchState {
  uuid: string
  name: string
  uuidToDelete: string
  uuidOfNewCity: string
  nameOfNewCity: string
  uuidOfUpdatedCity: string
  nameOfUpdatedCity: string
  countOfUpdatedCity: string
  countOfNewCity: string
  minimalCount: string
  maximalCount: string
  result: City[]
  page: string
}

interface City {
  uuid: string;
  name: string;
  count: number;
}

class CitySearch extends Component<CitySearchProps, CitySearchState> {
  constructor(props: CitySearchProps) {
    super(props);
    this.state = {
      uuid: '',
      uuidToDelete: '',
      uuidOfNewCity: '',
      nameOfNewCity: '',
      uuidOfUpdatedCity: '',
      nameOfUpdatedCity: '',
      countOfUpdatedCity: '',
      countOfNewCity: '',
      name: '',
      minimalCount: '',
      maximalCount: '',
      result: [],
      page: "1"
    };
  }

  handleUUIDInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ uuid: e.target.value });
  }

  handleUUIDOfNewCity = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ uuidOfNewCity: e.target.value });
  }

  handleNameOfNewCity = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ nameOfNewCity: e.target.value });
  }

  handleCountOfNewCity = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ countOfNewCity: e.target.value });
  }

  handleUUIDOfUpdatedCity = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ uuidOfUpdatedCity: e.target.value });
  }

  handleNameOfUpdatedCity = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ nameOfUpdatedCity: e.target.value });
  }

  handleCountOfUpdatedCity = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ countOfUpdatedCity: e.target.value });
  }

  handleUUIDToDeleteInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ uuidToDelete: e.target.value });
  }

  handleNameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ name: e.target.value });
  }

  handleMinimalCountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ minimalCount: e.target.value });
  }

  handleMaximalCountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ maximalCount: e.target.value });
  }

  handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ page: e.target.value });
  }

  searchCities = async () => {
    const { uuid, name, minimalCount, maximalCount, page } = this.state;
    try {
      if (!minimalCount) {
        alert("Minimal count is required");
        return;
      }
      if (!maximalCount) {
        alert("Maximal count is required");
        return;
      }
      if (!page) {
        alert("Page is required");
        return;
      }
      const p = Number(page);
      if (isNaN(p)) {
        alert("Page must be a number");
        return;
      }
      const minc = Number(minimalCount);
      if (isNaN(minc)) {
        alert("Minimal count must be a number");
        return;
      }
      const maxc = Number(maximalCount);
      if (isNaN(maxc)) {
        alert("Maximal count must be a number");
        return;
      }
      const params = new URLSearchParams({
        uuid,
        name,
        minimalCount,
        maximalCount,
        page
      });
      const response = await fetch(`http://localhost:1234/cities?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      else {
        const data = await response.json();
        this.setState({ result: data });
      }
    } catch (err) {
      if (err instanceof Error) {
        alert(`Error: ${err.message}`);
      } else {
        alert('An unknown error occurred');
      }
    }
  };

  insert = async () => {
    const { uuidOfNewCity, nameOfNewCity, countOfNewCity } = this.state;
    try {
      if (!uuidOfNewCity || !nameOfNewCity || !countOfNewCity) {
        alert("All fields are required");
        return;
      }
      const count = Number(countOfNewCity);
      if (isNaN(count)) {
        alert("Count must be a number");
        return;
      }
      const response = await fetch('http://localhost:1234/cities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uuid: uuidOfNewCity, name: nameOfNewCity, count: Number(countOfNewCity) })
      });
      if (!response.ok) {
        alert(`HTTP error! status: ${response.status}`);
      }
      else {
        const data = await response.json();
        this.setState({ uuidOfNewCity: "" });
        this.setState({ nameOfNewCity: "" });
        this.setState({ countOfNewCity: "" });
        alert(`Success! status: ${data.message}`);
      }
    } catch (err) {
      if (err instanceof Error) {
        alert(`Error: ${err.message}`);
      } else {
        alert('An unknown error occurred');
      }
    }
  };

  update = async () => {
    const { uuidOfUpdatedCity, nameOfUpdatedCity, countOfUpdatedCity } = this.state;
    try {
      if (!uuidOfUpdatedCity || !nameOfUpdatedCity || !countOfUpdatedCity) {
        alert("All fields are required");
        return;
      }
      const count = Number(countOfUpdatedCity);
      if (isNaN(count)) {
        alert("Count must be a number");
        return;
      }
      const response = await fetch(`http://localhost:1234/cities/${uuidOfUpdatedCity}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: nameOfUpdatedCity, count: Number(countOfUpdatedCity) })
      });
      if (!response.ok) {
        const text = await response.text();
        alert(`HTTP error! status: ${response.status}, message: ${text}`);
      }
      else {
        const data = await response.json();
        this.setState({ uuidOfUpdatedCity: "" });
        this.setState({ nameOfUpdatedCity: "" });
        this.setState({ countOfUpdatedCity: "" });
        alert(`Success! status: ${data.message}`);
      }
    } catch (err) {
      if (err instanceof Error) {
        alert(`Error: ${err.message}`);
      } else {
        alert('An unknown error occurred');
      }
    }
  };

  delete = async () => {
    try {
      if (!this.state.uuidToDelete) {
        alert("UUID is required");
        return;
      }
      const response = await fetch(`http://localhost:1234/cities/${this.state.uuidToDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        alert(`HTTP error! status: ${response.status}`);
      }
      else {
        const data = await response.json();
        alert("Success: " + data.message);
        this.setState({ uuidToDelete: "" });
      }
    } catch (err) {
      if (err instanceof Error) {
        alert(`Error: ${err.message}`);
      } else {
        alert('An unknown error occurred');
      }
    }
  };

  render() {
    return (
      <div className="d-flex flex-column vh-100">
        <div className="container-fluid flex-grow-1 d-flex flex-column">
          <div className="row flex-grow-1 min-vh-0">
            <div className="col-3 border-end overflow-auto">
              <div>
                <label htmlFor="uuidInput" className="form-label">UUID:</label><br />
                <input
                  id="uuidInput"
                  type="text"
                  value={this.state.uuid}
                  onChange={this.handleUUIDInputChange}
                  className="form-control"
                />
              </div>
              <div>
                <label htmlFor="nameInput" className="form-label">Name:</label><br />
                <input
                  id="nameInput"
                  type="text"
                  value={this.state.name}
                  onChange={this.handleNameInputChange}
                  className="form-control"
                />
              </div>
              <div>
                <label htmlFor="minimalCountInput" className="form-label">Minimal Count:</label><br />
                <input
                  id="minimalCountInput"
                  type="text"
                  value={this.state.minimalCount}
                  onChange={this.handleMinimalCountInputChange}
                  className="form-control"
                />
              </div>
              <div>
                <label htmlFor="maximalCountInput" className="form-label">Maximal Count:</label><br />
                <input
                  id="maximalCountInput"
                  type="text"
                  value={this.state.maximalCount}
                  onChange={this.handleMaximalCountInputChange}
                  className="form-control"
                />
              </div>
              <div>
                <label htmlFor="page" className="form-label">Page:</label><br />
                <input
                  id="page"
                  type="text"
                  value={this.state.page}
                  onChange={this.handlePageInputChange}
                  className="form-control"
                />
              </div>
              <div className="mt-2">
                <button className="btn btn-primary" onClick={this.searchCities}>
                  Search
                </button>
              </div>
              <div className="mt-2">
                <ul className="list-group">
                  {this.state.result.map(city => (
                    <li className="list-group-item" key={city.uuid}>
                      <strong>{city.name}</strong> (Count: {city.count})<br />
                      <small>UUID: {city.uuid}</small>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col-3 border-end overflow-auto">
              <div>
                <label htmlFor="uuidToDeleteInput" className="form-label">UUID:</label><br />
                <input
                  id="uuidToDeleteInput"
                  type="text"
                  value={this.state.uuidToDelete}
                  onChange={this.handleUUIDToDeleteInputChange}
                  className="form-control"
                />
              </div>
              <div className="mt-2">
                <button className="btn btn-primary" onClick={this.delete}>
                  Delete
                </button>
              </div>
            </div>
            <div className="col-3 border-end overflow-auto">
              <div>
                <label htmlFor="uuidOfNewCity" className="form-label">UUID:</label><br />
                <input
                  id="uuidOfNewCity"
                  type="text"
                  value={this.state.uuidOfNewCity}
                  onChange={this.handleUUIDOfNewCity}
                  className="form-control"
                  required
                />
              </div>
              <div>
                <label htmlFor="nameOfNewCity" className="form-label">Name:</label><br />
                <input
                  id="nameOfNewCity"
                  type="text"
                  value={this.state.nameOfNewCity}
                  onChange={this.handleNameOfNewCity}
                  className="form-control"
                  required
                />
              </div>
              <div>
                <label htmlFor="uuidOfNewCity" className="form-label">Count:</label><br />
                <input
                  id="countOfNewCity"
                  type="text"
                  value={this.state.countOfNewCity}
                  onChange={this.handleCountOfNewCity}
                  className="form-control"
                  required
                />
              </div>
              <div className="mt-2">
                <button className="btn btn-primary" onClick={this.insert}>
                  Insert
                </button>
              </div>
            </div>
            <div className="col-3 overflow-auto">
              <div>
                <label htmlFor="uuidOfUpdatedCity" className="form-label">UUID:</label><br />
                <input
                  id="uuidOfUpdatedCity"
                  type="text"
                  value={this.state.uuidOfUpdatedCity}
                  onChange={this.handleUUIDOfUpdatedCity}
                  className="form-control"
                  required
                />
              </div>
              <div>
                <label htmlFor="nameOfUpdatedCity" className="form-label">Name:</label><br />
                <input
                  id="nameOfUpdatedCity"
                  type="text"
                  value={this.state.nameOfUpdatedCity}
                  onChange={this.handleNameOfUpdatedCity}
                  className="form-control"
                  required
                />
              </div>
              <div>
                <label htmlFor="countOfUpdatedCity" className="form-label">Count:</label><br />
                <input
                  id="countOfUpdatedCity"
                  type="text"
                  value={this.state.countOfUpdatedCity}
                  onChange={this.handleCountOfUpdatedCity}
                  className="form-control"
                  required
                />
              </div>
              <div className="mt-2">
                <button className="btn btn-primary" onClick={this.update}>
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CitySearch;
