# COVID-19 (Coronavirus) spread simulator 🦠

Check simulations about how confinement people could help to stop spreading Coronavirus.

[Based on Washington Post Article: Why outbreaks like coronavirus spread exponentially, and how to “flatten the curve” - Washington Post](https://www.washingtonpost.com/graphics/2020/world/corona-simulator/)

## How to start

Install all the project dependencies with:
```
npm install
```

And start the development server with:
```
npm run dev
```

## Browser support

This project is using EcmaScript Modules, therefore, only browsers with this compatibility will work. (Sorry Internet Explorer 11 and old Edge users).

## Next content
- Customize strategies (number of static people and mortality)
- Customize colors
- Iframe support
- I18N
- New strategies
- Improve the code so I don't get so ashamed. 😳

## gioid's enhancements

I forked the midudev's repo and applied the following changes:

- percentage of people with contact-tracing app, that notify infected matches and suggest auto-isolation
- failure rate of contact-tracing app, so the app cannot notify an infected match due to physical/software issues
- percentage of conformists, because a person notified of the infected match can choose to avoid auto-isolation

You can see the result in action at the following link (thank you GitHub Pages): 

https://gioid.github.io/covid-19-spread-simulator/src/
