# picoBank

I wanted to create an App which could showcase primarily that I could explore the development of a full stack application which was underpinned with Python in the back-end. Up until this point I have mostly worked on social-style applications, where users would post content and browse other user's content; I wanted this project to be different. 

This was a solo project so all the work you see documented here is my own. The [first version](#v1) of this app was created in one week, with a subsequent version worked towards on an ad-hoc basis over the following month.

## Built With

* **Front-end**
  * [React](https://reactjs.org/)
  * [Chart.js](https://www.chartjs.org/) - for brightening up the customer analysis
  * [Spectre](https://picturepan2.github.io/spectre/getting-started.html) - CSS Framework
* **Back-end**
  * [Python](https://www.python.org/)
  * [Flask](https://palletsprojects.com/p/flask/) - for helping with the routes
  * [Marshmallow](https://palletsprojects.com/p/flask/) - serialisation
  * [SQLAlchemy](https://www.sqlalchemy.org/) - ORM
  * [PostgreSQL](https://www.sqlalchemy.org/) - database

## Key Functionality

I'm very proud of the capability and user experience I managed to pack into this project. picoBank was created to demonstrate that I could integrate different types of application concepts like:
  * customer spending analysis, which I integrated and included alongside some interactive charts
  * instant-style messaging of customer support
  * linking accounts for the same customer
  * complex database seeding of customer data with random transactions, bills and salary payments


---

## Getting Started

To get a copy of this project up and running on your local machine, you will need to follow these steps. Later I will follow this up with notes on how to deploy the project on a live system.

### Prerequisites

I have been using yarn as my package manager, and so all the steps below are using that, but npm can also be used.

### Installing

1. Initiate the project and install the dependencies:

```
yarn
```

2. Seed the database:

```
yarn seed
```

3. Launch the back-end:

```
yarn serve:back
```

4. Keep that terminal session running and create a new one (on a Mac: cmd + t) then launch the front-end:

```
yarn serve:front
```
It's now ready to access on the [localhost](https://localhost:8000).


---
## Running the tests

Explain how to run the automated tests for this system

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

---
## Versioning

#### v1
One week project, ended with a demo and presentation. MVP was complete, but support accounts were not yet enabled, so two way chat was not possible.

#### v2
...


---
## Acknowledgments

* Thanks to General Assembly for a little suport through this project
* I was inspired by the new challenger type banks including Monzo and Revolut