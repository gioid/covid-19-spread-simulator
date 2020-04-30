import {
  BALL_RADIUS,
  CANVAS_SIZE,
  DESKTOP_CANVAS_SIZE,
  STARTING_BALLS,
  RUN,
  STATIC_PEOPLE_PERCENTATGE,
  STATES
} from './options.js'

import {
  replayButton,
  deathFilter,
  stayHomeFilter,
  appPercentageSelect,
  appFailureRateSelect,
  appConformistsPercentageSelect
} from './dom.js'

import { Ball } from './Ball.js'

import {
  resetValues,
  updateCount
} from './results.js'

let balls = []
const matchMedia = window.matchMedia('(min-width: 800px)')

let isDesktop = matchMedia.matches

export const canvas = new window.p5(sketch => { // eslint-disable-line
  const startBalls = () => {
    let id = 0
    balls = []
    Object.keys(STARTING_BALLS).forEach(state => {
      Array.from({ length: STARTING_BALLS[state] }, () => {
        const hasMovement = RUN.filters.stayHome
          ? sketch.random(0, 100) < STATIC_PEOPLE_PERCENTATGE || state === STATES.infected
          : true

        const hasApp = (Math.random() * 100) <= RUN.filters.appPercentage

        balls[id] = new Ball({
          id,
          sketch,
          state,
          hasMovement,
          hasApp,
          x: sketch.random(BALL_RADIUS, sketch.width - BALL_RADIUS),
          y: sketch.random(BALL_RADIUS, sketch.height - BALL_RADIUS)
        })
        id++
      })
    })
  }

  const createCanvas = () => {
    const { height, width } = isDesktop
      ? DESKTOP_CANVAS_SIZE
      : CANVAS_SIZE

    sketch.createCanvas(width, height)
  }

  sketch.setup = () => {
    createCanvas()
    startBalls()

    matchMedia.addListener(e => {
      isDesktop = e.matches
      createCanvas()
      startBalls()
      resetValues()
    })

    replayButton.onclick = () => {
      startBalls()
      resetValues()
    }

    deathFilter.onclick = () => {
      RUN.filters.death = !RUN.filters.death
      document.getElementById('death-count').classList.toggle('show', RUN.filters.death)
      startBalls()
      resetValues()
    }

    stayHomeFilter.onchange = () => {
      RUN.filters.stayHome = !RUN.filters.stayHome
      startBalls()
      resetValues()
    }

    appPercentageSelect.onchange = (e) => {
      RUN.filters.appPercentage = parseInt(e.target.value)
      startBalls()
      resetValues()
    }

    appFailureRateSelect.onchange = (e) => {
      RUN.filters.appFailurePercentage = parseInt(e.target.value)
      startBalls()
      resetValues()
    }

    appConformistsPercentageSelect.onchange = (e) => {
      RUN.filters.autoIsolationPercentage = parseInt(e.target.value)
      startBalls()
      resetValues()
    }
  }

  sketch.draw = () => {
    sketch.background('white')
    balls.forEach(ball => {
      ball.checkState()
      ball.checkCollisions({ others: balls })
      ball.move()
      ball.render()
    })
    updateCount()
  }
}, document.getElementById('canvas'))
