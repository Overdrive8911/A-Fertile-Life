// setup.locations is found in "location_data.twee"

setup.updateTime = () => {
  if (variables().gameDateAndTime == undefined)
    variables().gameDateAndTime = new Date(Date.UTC(2021, 1, 3, 20))

  // Update game date variable
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
  const months = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
  ]

  // Get the day (e.g Monday)
  const gameDateAndTime_Day = days[variables().gameDateAndTime.getUTCDay()]

  // Get the date (e.g 1st)
  const gameDateAndTime_Date = variables().gameDateAndTime.getUTCDate()

  // Get the month
  const gameDateAndTime_Month =
    months[variables().gameDateAndTime.getUTCMonth()]

  // Put the string in the variable
  variables().gameDateDisplay = `${gameDateAndTime_Day}, ${gameDateAndTime_Date} ${gameDateAndTime_Month}`

  // Update game Time variable
  // Get the time in hours for the day
  const gameDateAndTime_DayHours: number =
    variables().gameDateAndTime.getUTCHours()
  // Get the time in minutes for the hour
  const gameDateAndTime_DayMinutes: number =
    variables().gameDateAndTime.getUTCMinutes()

  if (gameDateAndTime_DayHours < 12) {
    // AM
    const gameDateAndTime_DayHoursFormatted: string =
      gameDateAndTime_DayHours === 0
        ? (12).toLocaleString(undefined, {
            minimumIntegerDigits: 2,
            useGrouping: false,
          })
        : gameDateAndTime_DayHours.toLocaleString(undefined, {
            minimumIntegerDigits: 2,
            useGrouping: false,
          })
    const gameDateAndTime_DayMinutesFormatted: string =
      gameDateAndTime_DayMinutes.toLocaleString(undefined, {
        minimumIntegerDigits: 2,
        useGrouping: false,
      })

    variables().gameTimeDisplay = `${gameDateAndTime_DayHoursFormatted}:${gameDateAndTime_DayMinutesFormatted} AM`
  } else {
    // PM
    const gameDateAndTime_DayHoursFormatted: string =
      gameDateAndTime_DayHours === 12
        ? (12).toLocaleString(undefined, {
            minimumIntegerDigits: 2,
            useGrouping: false,
          })
        : (gameDateAndTime_DayHours - 12).toLocaleString(undefined, {
            minimumIntegerDigits: 2,
            useGrouping: false,
          })
    const gameDateAndTime_DayMinutesFormatted: string =
      gameDateAndTime_DayMinutes.toLocaleString(undefined, {
        minimumIntegerDigits: 2,
        useGrouping: false,
      })

    variables().gameTimeDisplay = `${gameDateAndTime_DayHoursFormatted}:${gameDateAndTime_DayMinutesFormatted} PM`
  }
}

// Update the variables since its wrapped in a <<live>> macro
$('#ui-settings-button-time-border-and-bg').trigger(':liveupdate')

// Update the time whenever the player moves to a another passage
$(document).on(':passagedisplay', () => {
  setup.updateTime()
})

// Update the time every 30s irl (note that it's still using the game time)
setInterval(() => {
  setup.updateTime()
}, 30000)
