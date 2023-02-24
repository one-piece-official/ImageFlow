<h1 align="center">Welcome to image-flow 👋</h1>
<p>
  <a href="https://www.npmjs.com/package/image-flow" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/image-flow.svg">
  </a>
  <img src="https://img.shields.io/badge/node-%3E%3D10-blue.svg" />
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p>

### 🏠 [Homepage](https://csj5588.github.io/image-flow)

## Prerequisites

- node >= 10.x && node <= 16.x

## Install with [npm](https://www.npmjs.com/package/image-flow)

```sh
yarn install image-flow
```

## Usage

### base

```javascript
<DynamicCard>
  {(key) => {
    return (
      <div className="card-demo">
        <img className="emoji" src="https://z3.ax1x.com/2021/03/23/6To1Ve.png" alt=""/>
        <p className="block">this card key number with {key}</p>
      </div>
    )
  }}
</DynamicCard>
```

## Show your support

Give a ⭐️ if this project helped you!
