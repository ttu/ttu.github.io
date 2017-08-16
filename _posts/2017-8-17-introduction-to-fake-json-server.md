---
layout: post
title: Intoroduction to .NET Fake JSON Server
excerpt: Introduction to .NET Fake JSON Server and how to use it as a Back End for a prototype project that previusly didn't use any Back End.
---

There may be a time when you need a simple Back End for prototyping or maybe a Back End for some small project, but you don't want to use any setup time for it. Then [Fake JSON Server](https://github.com/ttu/dotnet-fake-json-server) is for you!

Fake JSON Server is a __REST API__ which uses __JSON flat file__ as a data store, so it can return predefined data from the JSON file and it updates the data to that same file. FAKE JSON Server also has an experimental __GraphQL__ query support, so you can compare how REST requests would turn into GraphQL queries.

### Features

* No need to define types for resources. Types are handled dynamically
* No database. Data is stored to a JSON file
* CRUD operations (GET, PUT, POST, PATCH, DELETE)
* Async versions of PUT, POST, PATCH and DELETE operations with long running jobs
* Simulate delays and errors for requests
* Token Authentication
* WebSockets
* Swagger
* _Experimantal_ GraphQL query support
* No configuration needed, start the Server and API is ready to be used with any data

There are some fake REST APIs for __node.js__, e.g. [Typicode's json-server](https://github.com/typicode/json-server), but none for __.NET__. Instead of adding more features to some existing node project, I decided to make one for __.NET__.

### Store for dynamic data

First problem with this project was that I couldn't find any JSON flat file data store that would work well with dynamic data and with .NET Core, so I had to make one, [JSON Flat File Data Store](https://github.com/ttu/json-flatfile-datastore). It saves everything to a single JSON file. It can handle Typed Objects, Anonymous Types, ExpandoObjects and JSON Objects. It has a simple API, which is pretty much copied from MongoDB's C# API. JSON Flat File Data Store is also available as a [NuGet package](https://www.nuget.org/packages/JsonFlatFileDataStore/).

## Quick start

This post shows how to integrate Fake JSON Server to an existing Front End _prototype_ that didn't previously use any Back End. This post also shows how to test API endpoints with Swagger and curl. The prototype used as an example is the official [Redux TodoMVC](https://github.com/reactjs/redux/tree/master/examples/todomvc) example. The modified code can be found from [todomvc-fake-server](https://github.com/ttu/todomvc-fake-server) repository.

Complete documentation and examples for [Fake JSON Server](https://github.com/ttu/dotnet-fake-json-server) and [JSON Flat File Datastore](https://github.com/ttu/json-flatfile-datastore) can be found from Github. 

This example can be tried quickly by cloning Fake JSON Server and modified TodoMVC repositories.

1) Start the Fake JSON Server
  * Check [README](https://github.com/ttu/dotnet-fake-json-server#docker) if want to run Fake JSON Server with Docker

```sh
$ git clone https://github.com/ttu/dotnet-fake-json-server.git
$ cd dotnet-fake-json-server/FakeServer
$ dotnet run --file tododb.json --urls http://localhost:57602
```

2) Start the modified Redux TodoMVC example

```sh
$ git clone https://github.com/ttu/todomvc-fake-server.git
$ cd todomvc-fake-server
$ npm install
$ npm start
```

## Redux recap

To follow this example it is good to understand the basics of Redux. 

Redux works the same way as all other frameworks, by magic. Just write boilerplate and everything connects and works "automatically".

<img src="https://s3.amazonaws.com/media-p.slid.es/uploads/364812/images/2484714/ARCH-Redux2-extended-api.png" width="600px" />

_Redux data flow diagram. Credit to [jenyaterpil](http://slides.com/jenyaterpil/redux-from-twitter-hype-to-production)._

* Create store, pass reducers and middlware to it ([index.js](https://github.com/ttu/todomvc-fake-server/blob/master/src/index.js#L12))
* Containers and components will get the correct store through Provider ([index.js](https://github.com/ttu/todomvc-fake-server/blob/master/src/index.js#L15))
* Reducers handle correct functionality identified by action constants ([reducers/todos.js](https://github.com/ttu/todomvc-fake-server/blob/master/src/reducers/todos.js#L14))
* Container maps the needed parts of state and binds actions to props, so basically it connects React components to the Redux store ([containers/App.js](https://github.com/ttu/todomvc-fake-server/blob/master/src/containers/App.js#L29))
  * Actions are called through dispatch and this is the only way to trigger state change. `bindActionCreators` binds actions to dispatch for convenience.
* Components get needed props from the parent, and is updated only when the state is changes ([components/MainSection.js](https://github.com/ttu/todomvc-fake-server/blob/master/src/components/MainSection.js#L87))

## How to get the original version of Redux TodoMVC to use Fake JSON Server.

<img src="https://image.ibb.co/j92Uv5/todos_front.jpg" width="50%" />

By default the TodoMVC example uses only internal state to keep up with changes. We need to change the actions completely as data will be fetched and updated to the server. Also smaller updates are needed to other parts of app.

Some people have a preference to use some library for fetching and posting data to the server, although [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) is pretty good. [Superagent](https://visionmedia.github.io/superagent/) is one of the many 3rd party libraries that handle the job well and it is used in the modified version.

```sh
$ npm install superagent
```

Old code is not removed, but only commented out, so comparing the new and the original version is easier. 

Original code doesn't have semicolons. I think that is a blasphemy, but having 2 separate styles in the same codebase is also a blasphemy, so I didn't use semicolons either :sadpanda:

### Middleware

Requests to the server are asynchronous so custom middleware is required for async actions. In this example [redux-thunk](https://github.com/gaearon/redux-thunk) is used as a middleware. Thunk is not as _sexy_ as some other middlewares, but it is simple and it works well for this example.

```sh
$ npm install redux-thunk
```

[index.js](https://github.com/ttu/todomvc-fake-server/blob/master/src/index.js): Import redux-thunk and apply it to `createStore`.

```js
import thunk from 'redux-thunk'

// const store = createStore(reducer)
const store = createStore(reducer, applyMiddleware(thunk))
```

### Functionality: Get TODOs

[constants/ActionTypes.js](https://github.com/ttu/todomvc-fake-server/blob/master/src/constants/ActionTypes.js): Add new constant. New constants are needed, so completed action can be matched with correct reducer.

```js
export const GET_TODOS = 'GET_TODOS'
```

[actions/index.js](https://github.com/ttu/todomvc-fake-server/blob/master/src/actions/index.js): Import superagent and add the Back End url.

```js
import * as types from '../constants/ActionTypes'
import superagent from 'superagent'

const BASE_URL = 'http://localhost:57602/api/todos/'
```

[actions/index.js](https://github.com/ttu/todomvc-fake-server/blob/master/src/actions/index.js): Add `getTodos` action creator function. It requests data from `http://localhost:57602/api/todos/` and when data is received, it dispatches action payload with type `GET_TODOS` to the reducer.

```js
export const getTodos = () => { return dispatch => {
    return superagent
        .get(`${BASE_URL}`)
        .end((err, res) => {
            if (err)
                dispatch({ type: types.GET_TODOS, data: [] })
            else
                dispatch({ type: types.GET_TODOS, data: res.body })
        })
}}
```

[reducers/todos.js](https://github.com/ttu/todomvc-fake-server/blob/master/src/reducers/todos.js): Add payload handling for the type `GET_TODOS`.  Initial state is not needed anymore, as data is loaded from the server. `GET_TODOS` sets received data as state.

```js
import { ADD_TODO, DELETE_TODO, EDIT_TODO, COMPLETE_TODO, COMPLETE_ALL, CLEAR_COMPLETED, GET_TODOS } from '../constants/ActionTypes'

// Initial state is not needed anymore
const initialState = [
  // {
  //   text: 'Use Redux',
  //   completed: false,
  //   id: 0
  // }
]

export default function todos(state = initialState, action) {
  switch (action.type) {
    // Now as todos are stored to server we need to update whole state
    case GET_TODOS:
      return [ ...action.data ]
    ...
```

[components/MainSection.js](https://github.com/ttu/todomvc-fake-server/blob/master/src/components/MainSection.js): Add `componentDidMount` function where initial state will be loaded. Also handling for reload on WebSocket onmessage is handled here. WebSocket gets a new message every time an item is created, updated or deleted.

```js
componentDidMount() {
   this.props.actions.getTodos()

   this.connection = new WebSocket('ws://localhost:57602/ws')

   this.connection.onmessage = evt => {
     this.props.actions.getTodos()
   }
}
```

Now when you start your app, data is loaded from the Back End.

### Functionality: Add, Delete and Edit TODO

[actions/index.js](https://github.com/ttu/todomvc-fake-server/blob/master/src/actions/index.js): `addTodo`, `deleteTodo` and `editTodo` definitions stay the same as in original. Just send the data to the Back End and handle the result when it arrives.

```js
// export const addTodo = text => ({ type: types.ADD_TODO, text })
export const addTodo = text => { return dispatch => {
    return superagent
        .post(`${BASE_URL}`)
        .send({ text: text, completed: false })
        .end((err, res) => dispatch({ type: types.ADD_TODO, id: res.body.id, text: text, completed: false }))
}}

// export const deleteTodo = id => ({ type: types.DELETE_TODO, id })
export const deleteTodo = id => { return dispatch => {
    return superagent
        .delete(`${BASE_URL}${id}`)
        .end((err, res) => dispatch({ type: types.DELETE_TODO, id }))
}}

// export const editTodo = (id, text) => ({ type: types.EDIT_TODO, id, text })
export const editTodo = (id, text) => { return dispatch => {
    return superagent
        .patch(`${BASE_URL}${id}`)
        .send({ text: text })
        .end((err, res) => dispatch({ type: types.EDIT_TODO, id: id, text: text }))
}}
```

[reducers/todos.js](https://github.com/ttu/todomvc-fake-server/blob/master/src/reducers/todos.js): Original version of `ADD_TODO` case calculated id from current items, but in this version the correct id comes from the Server. Cases for `DELETE_TODO` and `EDIT_TODO` stay the same as in the original file.

```js
case ADD_TODO:
   return [
     {
       // Id will come with payload          
       // id: state.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1,
       id: action.id,
       completed: action.completed,
       text: action.text
     },
     ...state
   ]

case DELETE_TODO:
   return state.filter(todo =>
     todo.id !== action.id
   )

case EDIT_TODO:
   return state.map(todo =>
     todo.id === action.id ?
       { ...todo, text: action.text } :
       todo
   )
```

As definitions of the actions stay same as in the original, there is no need to update Components.

### Functionality: Complete TODO

[actions/index.js](https://github.com/ttu/todomvc-fake-server/blob/master/src/actions/index.js): In the orignial version clicking complete just toggled the completed state, but now we need to pass the correct state to the Back End.

```js
// export const completeTodo = id => ({ type: types.COMPLETE_TODO, id })
export const completeTodo = (id, state) => { return dispatch => {
    return superagent
        .patch(`${BASE_URL}${id}`)
        .send({ completed: state })
        .end((err, res) => dispatch({ type: types.COMPLETE_TODO, id: id, completed: state }))
}}
```

[reducers/todos.js](https://github.com/ttu/todomvc-fake-server/blob/master/src/reducers/todos.js): Toggling was done originally in the reducer. Now `COMPLETE_TODO` sets the completed state from the action.

```js
case COMPLETE_TODO:
   return state.map(todo =>
     todo.id === action.id ?
       // No more toggling, completed state comes with payload
       // { ...todo, completed: !todo.completed } :
       { ...todo, completed: action.completed } :          
       todo
   )
```

[components/MainSection.js](https://github.com/ttu/todomvc-fake-server/blob/master/src/components/MainSection.js): As `COMPLETE_TODO` doesn't just toggle the completed state in the reducer, we need to pass the correct value to the action. This is done by toggling the current value in the component and passing the value with item's id to the action.

```js
<input className="toggle"
                 type="checkbox"
                 checked={todo.completed}
                 // onChange={() => completeTodo(todo.id)} />
                 onChange={() => completeTodo(todo.id, !todo.completed)} />
```

### Functionality: Complete All and  Clear Completed

[actions/index.js](https://github.com/ttu/todomvc-fake-server/blob/master/src/actions/index.js): As Fake Server is an extremely general REST API we need to collect the id's in the Front End and do multiple updates.
 
```js
// export const completeAll = () => ({ type: types.COMPLETE_ALL })
export const completeAll = ids => { return dispatch => {
    var promises = ids.map(id => {
        return new Promise((resolve, reject) => {
            superagent
                .patch(`${BASE_URL}${id}`)
                .send({ completed: true })
                .end((err, res) => resolve())
        })
    })
    Promise.all(promises).then(results => dispatch(({ type: types.COMPLETE_ALL })))
}}

// export const clearCompleted = () => ({ type: types.CLEAR_COMPLETED })
export const clearCompleted = ids => { return dispatch => {
    var promises = ids.map(id => {
        return new Promise((resolve, reject) => {
            superagent
                .delete(`${BASE_URL}${id}`)
                .end((err, res) => resolve())
        })
    })
    Promise.all(promises).then(results => dispatch(({ type: types.CLEAR_COMPLETED })))
}}
```

In real life I would add own endpoints for `completeAll` and `clearCompleted` to the Back End. Using RPC-like endpoints is a good solution when you like to keep most of the functionality at the Back End. For example:

```csharp
[HttpPost("completeAll")]
public async Task<IActionResult> CompleteAll()
{
    await _ds.GetCollection("todo").UpdateManyAsync(e => true, new { completed = true });
    return NoContent();
}

[HttpPost("removeCompleted")]
public async Task<IActionResult> RemoveCompleted()
{
    await _ds.GetCollection("todo").DeleteManyAsync(e => e.completed);
    return NoContent();
}
```

[reducers/todos.js](https://github.com/ttu/todomvc-fake-server/blob/master/src/reducers/todos.js): Reducer doesn't need any modifications for `COMPLETE_ALL` and `CLEAR_COMPLETED`.

```js
 case COMPLETE_ALL:
   const areAllMarked = state.every(todo => todo.completed)
   return state.map(todo => ({
     ...todo,
     completed: !areAllMarked
   }))

 case CLEAR_COMPLETED:
   return state.filter(todo => todo.completed === false)

 default:
   return state
}
```

[components/MainSection.js](https://github.com/ttu/todomvc-fake-server/blob/master/src/components/MainSection.js): As the new version of `clearCompleted` takes a list of todo item ids, we need to pass those as arguments.

```js
// handleClearCompleted = () => {
handleClearCompleted = (ids) => {
  // this.props.actions.clearCompleted()
  this.props.actions.clearCompleted(ids)
}
  
  ....
  
renderFooter(completedCount) {
  const { todos } = this.props
  const { filter } = this.state
  const activeCount = todos.length - completedCount

  if (todos.length) {
    return (
      <Footer completedCount={completedCount}
              activeCount={activeCount}
              filter={filter}
              //onClearCompleted={this.handleClearCompleted}                
              onClearCompleted={() => this.handleClearCompleted(todos.filter(e => e.completed).map(e => e.id))}
              onShow={this.handleShow} />
    )
  }
}
```

`completeAll` also takes list of ids as arguments.

```js
renderToggleAll(completedCount) {
    const { todos, actions } = this.props
    if (todos.length > 0) {
      return (
        <input className="toggle-all"
               type="checkbox"
               checked={completedCount === todos.length}
               //onChange={actions.completeAll} />               
               onChange={() => actions.completeAll(todos.filter(e => e.completed === false).map(e => e.id))} />
      )
    }
  }
```

For some reason `clearCompleted` and `completeAll` had different handling for `onChange` in the original example. Maybe reason behind this was to show that you can have own function or just use props straight.

Now you are good to go! Open two browser tabs side by side ([http://localhost:3000](http://localhost:3000)) and see the updates immediately on both pages thanks to WebSockets!

Stored JSON will look like this:

```json
{
  "todos": [
    {
      "text": "Watch more television",
      "completed": false,
      "id": 0
    },
    {
      "text": "Buy new pillow",
      "completed": true,
      "id": 1
    }
  ]
}
```

## Test API endpoints with Swagger and curl

The best way to edit your data is of course manually. Open the JSON file with any editor and save your changes. 

_NOTE: By default data store will reload data from the JSON with every request. For performance reasons this can be changed to a mode where queries won't [reload](https://github.com/ttu/dotnet-fake-json-server#reload) data._

You can test requests with [Swagger: http://localhost:57602/swagger](http://localhost:57602/swagger/), curl, Postman etc.

#### Get items

[Open Swagger](http://localhost:57602/swagger/#!/Dynamic/ApiByCollectionIdGet)

1. Write to colletionId: `todos`
1. Press Try it out!

<img src="https://lh3.googleusercontent.com/g9uGW78lQJ2qkrhJpgQ3At6eUDmOZw1bFzW8CDJoM6DRf7RzCojr1ZbPyolEFCIOzZD0gTfD3l58E3GmR4RhHAvICxchKr1DHaeD_FwF2_EI56H5xg2Qt_1VfjjcMavf1EAhuXsTpB23baPkLrFDghER2o9aoQTm5kHcBYeMJ856ql5s8IIy1z7VtaVtjQaX7vCi_t80sPyALPFLjnE24oul6P4bYOrbcwBDb3oEJYW0TUBWxaE7Rmv7wDqoBxePfjOMW47iT8ujfnvaQ4GMmJJDc0vAAFnv4KbHhpf4rZCwFv-bqmpUV4sSIvH3KwTrZRFTT93CgRT6oqX_PtivELTkz2ifYFGQKOVuY53C1f4W7I3xSHENEKJmr68kaCJ6n7mLtl4Oeqa-kwV3HidtxlGnKT3M22DfRCpg6VmI9V_SNDsnZPGkzLGcvnpEgLfWo2qHIRBzRYAWJrnYe0DugejnzzJ7C91cbNaj328BdK_zEbRLLskZGIPhwJvQDrEqnrCnrAxfxEWK84--OZEnh0Ek4e4slAUhTtJnPEgs5ORUzlTqGcftwDEr15ECo2T7q-20dMp-8_0d0k24leTvQFafzXIE1G4GIKyW0oucKmvva77nUIFuAw=w1102-h849-no" />

__curl__

With curl you can also get items with [queries](https://github.com/ttu/dotnet-fake-json-server#get-items-with-query). e.g. get completed Todo items.

```sh
$ curl http://localhost:57602/api/todos?completed=True
```

__GraphQL__

Get completed Todo items with GraphQL.

```sh
$ curl -H "Content-type: application/graphql" -X POST -d 'query { todos(completed: true) { id text completed } }' http://localhost:57602/graphql
```

### Create new items

[Open Swagger](http://localhost:57602/swagger/#!/Dynamic/ApiByCollectionIdPost)

1. Write to collectionId: `todos`
1. Write to item: `{ text: 'New item from Swagger', completed: false }`
1. Press Try it out!

<img src="https://lh3.googleusercontent.com/fxoD1p7LtewQDhtGdTqzJROedcSygRm7TuEsx-8VUnt_GORMOSghtrG8qiT47a6Qwvi1dNmWGz6Po-K4ZrZw2c6La_sLuhcLDyBA4VG4PNB6fPcebL14_0_qCfVb9iyKHquS0W-gxjEnfrcl0R8Qxsvh-PZDqN6_SnQJ2Qly_ZLWw13wZAtrD4xPqIP4Tjwl8Y5BE-PhBo4PdpzsCOaTUCoX3O4N46hR6VvYV6hIpSvJLaEflGumjcWC4x47ZAd_QZXTb0DEMmEwnzFg22XQAXTL_sz-p_q8hjotqBVCE8bZK5d7_9tDqelYYINmtfsmrYVGLnAlqWKNeNolhapYJ1E3y9P_cla04iRN8YeJBXlfgW0P2vKPPEmM_DuEA5aawigY21x5FhXxHYab49rd67QbmXEAANS4taMwuRrgBpZDRFLPutDbX8aNQAqT-ammSM4JqmX1rf3ioGvl5BPXWtg0lBMp2zUbYVUwlKPcC1UZAsFaozAbLS_yNU121T6tzJ9FnAIgwZfDXehkwK1yBnP-Vxkf6ptaW-moVnVFwZ2hzW95PY710ekiKOXBU7O0xnKVcpMQEMis9tYujns-gnzpepnOhGLc4lZ7dupun5N4xOvVe0JiwJZLr57oBAF_XCzEUbou-CUI23ImXERlBY2ouC3rWYyVWQdERZQBjUKbju0=w1095-h1135-no" />

__curl__

```sh
$ curl -H "Accept: application/json" -H "Content-type: application/json" -X POST -d '{ "text": "New item from curl", "completed": false }' http://localhost:57602/api/todos/
```

### Update items

Update the item state to completed. This can be done by replacing the whole item with `PUT` or by providing only the updated attributes with `PATCH`.

Set Todo item with id 1 to completed with `PATCH`.

[Open Swagger](http://localhost:57602/swagger/#!/Dynamic/ApiByCollectionIdByIdPatch)

1. Write to collectionId: `todos`
1. Write to id: `1`
1. Write to item: `{ completed: true }`
1. Press Try it out!

<img src="https://lh3.googleusercontent.com/lE706fEuq_J9hJ7KtbVxiIGNQgkBkBaE56UZyeqYkSJzP8wqFLyhK6PN4coIl5xOzgjd6BEll8pATfb4k4CY4FBgxVVcOXL4QW1WPYzpyjQE8PkxrUrBgVJJHjufokmNH4_bJLG2PnjfMTUPf5qB5xtzsYtBEpibdjVQqdtIi90z7Sf0FYmURRXqqUB99Dy7VIQXGm4caTSWI054sXq53WW_khWl4VBNplrti13Ah2jewCe0chd-V5qMVsLmJUbpnBtFsI5PANJhBVNpQPGCxK-dxbRf2FJSKSkD4s4OQkzDPb0EjAI9SKmx8csFzuFcMUssxspmxu7EvgeSD7y65OOWV-kIC15tA0S-yFFDpYfWzOtY83XWLkAxPep5J1vDWDjfEHJ7gUzf2SCrOjserm5CzgxUJCcWcQNieHeZg_fbBWUvgsuJiWDkIcY8Ubs4ZY7uRbIB5VN4u41QLN77ruAtB2vyQuu-MdcWKhtUKHn0twBw7-CM_AK3QEdQ8yX2KqvtIbpQBEfXL_2CdZ6uSd7RYxCpjT_yUogZJo3yegcl4z9cKNXUg88LzudG5kYhaoSbrol0zpBtgeKsqwjae9T0w_30bwKIk0rbsVpwXN8HlwHZVmIi-WcrbnSCfyv5n0f6WFa4bYMuPt-4DR2rI_mwd5mChGisZMi5T7IP_zS_bPE=w1087-h1227-no" />

__curl__

```sh
$ curl -H "Accept: application/json" -H "Content-type: application/json" -X PATCH -d '{ "completed": true }' http://localhost:57602/api/todos/1
```

### Async jobs

Fake JSON Server can simulate [long running jobs](https://github.com/ttu/dotnet-fake-json-server#async-operations). To create a new Todo item with a long running job, use the `async` endpoint instead of the `api` endpoint.

[Open Swagger](http://localhost:57602/swagger/#!/Async/AsyncByCollectionIdPost)

1. Write to collectionId: `todos`
1. Write to item: `{ text: 'New async item from Swagger', completed: false }`
1. Press Try it out!

<img src="https://lh3.googleusercontent.com/x_fxrAfOli0zACKBOP-CDoZzEbNoVs7euDMzeTHpRiKFlp_lF-BTaZlBDrtgn-yTq_SIcl4XUL8MimbkjmNpV9WwrgEMzIk59ZYAKq-yibByk5ahz4Thh0P0006-Qbmqde4ZIawiGeW8s-ZxlmXXYQqgg0nRQQBSHTz3ScBtfNLyj-w6WQCaoTUat8CSgP9yi_l9mHxQ6EZf21yXzM2Z1gONLDOPu4KdwI9CWdfY3z7eYviTdBDKhD7EmZD7pxCyH6wTTABTXz5PB83V7Y3vnqSmM_ouaX5j8mdzIJa5i8WQQBBsZ49u_tcgRf-SaF--yT0FDRfYFIvwu3_fhECgEzrDCZap5e0tu8JVkRlVnQuuH8JoLkhru9KDMLqiEpC-uHImT5Adp4suBIs2iPIjqjFAGCCkpiJqPo-9wfNhnFYTOrbNqk37SwI9nfa3jY-Y_EVxK0jlojP_2_o5RJimQEq6v0qVtZTd9O-4BJUfnDvOudmjwrmdOEpaMXjEanOetBZEzqriy8MbIQ5O9kzByZpc_Fz_SoU9BhscXQ8udWHzS6IGSyz18bJKnjpilxwVuVHeY6UowgWeOp_esBOCy4t1JOI0a6ZmfW2zGgGXD1wZRko1oK5qUotw3zioQ32-dKRsZ1GFzALAIIOpCbkh4SKwRb1WqNqze1IatYcCl17_hYY=w1095-h1135-no" />

__curl__

```sh
$ curl -H "Accept: application/json" -H "Content-type: application/json" -X POST -d '{ "text": "Async job", "completed": false }' http://localhost:57602/async/todos/
```

By default Fake JSON Server has a 10 second delay as a long running job simulation time, so after 10 seconds, a new item will appear to the todo list.

Headers has a link to the queue item. If task is not finished, response will return `200 OK` and when task is finished return value is `303 SeeOther`. Finished response has a link to the new item in the Location header. 

If you request the queue item with Swagger and the job is finished, it will return the new item as Swagger uses auto redirect.

<img src="https://lh3.googleusercontent.com/Ite278WF8vSx2i4A8_mJcNalvzGANAAiKdL8ymXCnISnhO2jsFExEMNHVPw3nsBJUsy4b1TcLqp4XWf2TtMHIBKL45eVH8A8LCg74EjQ4G-NDW9B4xdQ9bFn7GMuhs_dgvzR9WpS2iq8IjwI2gvuHqtlkFrzfZl6wg1lvPwL3asSgP1q9yea0cELFmDeh-TKqPrTTY92JfO_XJ7Qg2YSmbRfZiWwjbiuR3rcR2ocg_aQfKbWN7LXbktaqSeX-digQHOFmH1OkC8MEzPKQVTi97okVap6foc0AkjgraHXX2hc6XcUzSlFKagzK-bOVWY1onClw42DxJMZbmDAHRstc9nRq7tIyT8r1-fJUSG2dse4458TSROFkLwqdgU542aCG2JSeLB6zE1ifFHZ1AthRCGiCSahsygjn9BdM1SHVtc13r6e173T06_wBWHoB99RbCZBPnszMKq9gS7Gtwf5EWiAlOFwjHNWVn4ERGNrZNJs1io5JVKeBJB30zHiWlnRfgCT7eJSumk5D7FEyk7bd_2n7UUxAn5Q_lpDKbaHH18B593VG2k3-IwL8RFlGjTzAHGx8vnFqqPZNPYI7R4gkJXezaLdT4jaO1Q8PFwLP3pE8Vf6jQ5wsUMoqJXxq6LcaY-SAKXc5xJC4AnXgpZbkI532lckePpUL_NW0HMcwpxnr20=w1089-h765-no" />

Curl will show all headers with vebose argument.

<img src="https://lh3.googleusercontent.com/V80dUZEZSuoq2uU-g2VqHue1HiIIrSKmtZ5D-6UnJt6yOXH2t1XOogJakB2VA9Es_rwwKpZ66-Idegspuny-mSuLWMnXbPtDYaGsAy6rtbFk_Qir6GpL1TNwsjJeE-bImxMPerMsJWTy-y1Zj8Z8uNpaN-wH328IHY1PeC0pnBbK5x_4c9whPDH60dOYzh2nU_AhU6o2VzRKaxv8EA6uKfTfGcYsosmjsI5_79vUZIVBLknqPJ3OfJDn48N0-AJW-LtG3XT7do2gz_XRGDphXvl10qi4TrPuvxVGY90U4u7Pe-QCZcD0zk-etiVUuAp0c6FmTzLs4bY31mkugfWGF3knku6jPk016qo8AAnLyHu4JFEG1ngF3pnijxKqHiio9lFTjn9nelwyQHhTqn3zn4NgsyJ4moU4q9V2PUaGaoXIx9LFNrcJDVOc_Bhc0717H5f-TdZhhe_YpSGOvs3ODcudIr5oXLRgjjj9vMUde5SqTtV0O4cfZ_b959Jj4rCpmIsF-mctxw3ZcPTe2O9_KW3OC-4DHc-1-go6lotYcO4oqDr5tA-4gRg5_Bh4tJBXHC0v45J73XsUIQ59pTLKvZBIXg-yk7LVrCC_BxbSgmXtrRqUNZ4IVVqJ3sXWMuEpeLJDCBnpjk-41OFaGlytagWpeXyr_DxTqjGNYwzYAv2e-TM=w1066-h611-no" />


### Final words

There are many uses cases for Fake JSON Server, this article shows how to use it as [an IoT backend](https://gist.github.com/ttu/9d4933aae7d08e5a72ca99b62eb5c015). Fake JSON Server is used to collect data from sensors for validation and to provide a way to observe sensor statuses real-time.

Fake JSON Server has more features than were not covered in this post. Check the complete guide and more examples from [https://github.com/ttu/dotnet-fake-json-server](https://github.com/ttu/dotnet-fake-json-server).

Happy coding!
