import {
  BALL_RADIUS,
  COLORS,
  BORDER_COLOR_WITH_APP,
  MORTALITY_PERCENTATGE,
  TICKS_TO_RECOVER,
  RUN,
  SPEED,
  STATES
} from './options.js'
import { checkCollision, calculateChangeDirection } from './collisions.js'

const diameter = BALL_RADIUS * 2

export class Ball {
  constructor ({ x, y, id, state, sketch, hasMovement, hasApp }) {
    this.x = x
    this.y = y
    this.vx = sketch.random(-1, 1) * SPEED
    this.vy = sketch.random(-1, 1) * SPEED
    this.sketch = sketch
    this.id = id
    this.state = state
    this.timeInfected = 0
    this.hasMovement = hasMovement
    this.hasApp = hasApp
    this.hasCollision = true
    this.survivor = false
  }

  checkState () {
    if (this.state === STATES.infected) {
      if (RUN.filters.death && !this.survivor && this.timeInfected >= TICKS_TO_RECOVER / 2) {
        this.survivor = this.sketch.random(100) >= MORTALITY_PERCENTATGE
        if (!this.survivor) {
          this.hasMovement = false
          this.state = STATES.death
          RUN.results[STATES.infected]--
          RUN.results[STATES.death]++
          return
        }
      }

      if (this.timeInfected >= TICKS_TO_RECOVER) {
        this.state = STATES.recovered
        RUN.results[STATES.infected]--
        RUN.results[STATES.recovered]++
        // once recovered, we can move again
        this.hasMovement = true
      } else {
        this.timeInfected++
      }
    }
  }

  checkCollisions ({ others }) {
    if (this.state === STATES.death) return

    for (let i = this.id + 1; i < others.length; i++) {
      const otherBall = others[i]
      const { state, x, y, hasApp } = otherBall
      if (state === STATES.death) continue

      const dx = x - this.x
      const dy = y - this.y

      if (checkCollision({ dx, dy, diameter: BALL_RADIUS * 2 })) {
        const { ax, ay } = calculateChangeDirection({ dx, dy })

        // apply the movement just to balls that can move
        if (this.hasMovement) {
          this.vx -= ax
          this.vy -= ay
        }
        if (otherBall.hasMovement) {
          otherBall.vx = ax
          otherBall.vy = ay
        }

        // both has same state, so nothing to do
        if (this.state === state) return
        // if any is recovered, then nothing happens
        if (this.state === STATES.recovered || state === STATES.recovered) return
        // then, if some is infected, then we make both infected
        if (this.state === STATES.infected || state === STATES.infected) {
          this.state = otherBall.state = STATES.infected
          RUN.results[STATES.infected]++
          RUN.results[STATES.well]--

          if (this.hasApp && hasApp) {
            // both users have the app, so the app must signal the infection risk
            // and the just infected person should stay at home
            if (state === STATES.infected) {
              this.hasMovement = false
            } else {
              otherBall.hasMovement = false
            }
          }
        }
      }
    }
  }

  move () {
    if (!this.hasMovement) return

    this.x += this.vx
    this.y += this.vy

    // check horizontal walls
    if (
      (this.x + BALL_RADIUS > this.sketch.width && this.vx > 0) ||
      (this.x - BALL_RADIUS < 0 && this.vx < 0)) {
      this.vx *= -1
    }

    // check vertical walls
    if (
      (this.y + BALL_RADIUS > this.sketch.height && this.vy > 0) ||
      (this.y - BALL_RADIUS < 0 && this.vy < 0)) {
      this.vy *= -1
    }
  }

  render () {
    const color = COLORS[this.state]

    // apply a border to the users with the app, to identify them
    if (this.hasApp) {
      this.sketch.stroke(BORDER_COLOR_WITH_APP)
    } else {
      this.sketch.noStroke()
    }

    this.sketch.fill(color)
    this.sketch.ellipse(this.x, this.y, diameter, diameter)
  }
}
