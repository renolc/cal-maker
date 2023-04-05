const data = {}

const init = () => {
  const yearSelect = document.querySelector('#year')
  const thisYear = new Date().getFullYear()

  for (let i = 0; i <= 3; i++) {
    const option = document.createElement('option')
    option.value = thisYear + i
    option.textContent = thisYear + i
    yearSelect.appendChild(option)
  }
}

init()

const preFillHolidays = year => {
  data[0] = { 1: ["New Year's Day"] }
  data[1] = { 14: ["Valentine's Day"] }
  data[2] = { 17: ["Saint Patrick's Day"] }
  data[6] = { 4: ['Independence Day'] }
  data[9] = { 31: ['Halloween'] }
  data[11] = { 24: ['Christmas Eve'], 25: ['Christmas Day'] }

  addFloatingHoliday(data, year, 2, 0, 4, "Mother's Day")
  addFloatingHoliday(data, year, 3, 0, 5, "Father's Day")
  addFloatingHoliday(data, year, 4, 4, 10, 'Thanksgiving')
  addEaster(data, year)
}

const addFloatingHoliday = (holidays, year, num, dayOfWeek, month, title) => {
  const day = new Date(year, month)
  while (day.getDay() !== dayOfWeek) day.setDate(day.getDate() + 1)
  const desiredDay = day.getDate() + (num - 1) * 7

  if (!holidays[month]) holidays[month] = {}
  if (!holidays[month][desiredDay]) holidays[month][desiredDay] = []
  holidays[month][desiredDay].push(title)
}

const addEaster = (holidays, year) => {
  const f = Math.floor,
    G = year % 19,
    C = f(year / 100),
    H = (C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30,
    I = H - f(H / 28) * (1 - f(29 / (H + 1)) * f((21 - G) / 11)),
    J = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7,
    L = I - J,
    m = 3 + f((L + 40) / 44),
    day = L + 28 - 31 * f(m / 4)

  const month = m - 1

  if (!holidays[month]) holidays[month] = {}
  if (!holidays[month][day]) holidays[month][day] = []
  holidays[month][day].push('Easter')
}

const preventDefault = e => e.preventDefault()

const fileDropped = async e => {
  e.preventDefault()
  const [file] = e.dataTransfer.files
  const csv = await file.text()
  const rows = csv.split('\n').map(i => i.split(','))

  const year = document.querySelector('#year').value
  const includeHolidays = document.querySelector('#includeHolidays').checked
  if (includeHolidays) preFillHolidays(year)

  rows.forEach(([title, date]) => {
    const d = new Date(date)
    const month = d.getMonth()
    const day = d.getDate()

    if (!data[month]) data[month] = {}
    if (!data[month][day]) data[month][day] = []

    data[month][day].push(title)
  })

  createCalendar()
}

const createCalendar = () => {
  const year = document.querySelector('#year').value
  const setup = document.querySelector('#setup')
  setup.remove()

  for (let i = 0; i < 12; i++) {
    addMonth(i, year)
  }
}

const addMonth = (month, year) => {
  const monthTemplate = document.querySelector('#month-template')
  const weekRowTemplate = document.querySelector('#week-row-template')

  const currentDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const numberOfWeeks = Math.ceil((currentDay.getDay() + lastDay.getDate()) / 7)

  const monthEl = monthTemplate.content.cloneNode(true)
  const monthName = currentDay.toLocaleString('default', { month: 'long' })
  monthEl.querySelector('.month-name').textContent = `${monthName} ${year}`

  const weeksContainer = monthEl.querySelector('.weeks')

  let weekRowEl = weekRowTemplate.content.cloneNode(true)
  let days = weekRowEl.querySelectorAll('.day-cell')

  while (currentDay.getMonth() === month) {
    const dayOfWeek = currentDay.getDay()
    const dayOfMonth = currentDay.getDate()

    const day = days[dayOfWeek]
    day.textContent = dayOfMonth

    const content = data?.[month]?.[dayOfMonth]
    if (content) {
      const list = document.createElement('ul')
      content.forEach(i => {
        const item = document.createElement('li')
        item.textContent = i
        list.appendChild(item)
      })
      day.appendChild(list)
    }

    if (dayOfWeek === 6) {
      weeksContainer.appendChild(weekRowEl)
      weekRowEl = weekRowTemplate.content.cloneNode(true)
      days = weekRowEl.querySelectorAll('.day-cell')
    }

    currentDay.setDate(currentDay.getDate() + 1)
  }
  if (currentDay.getDay() !== 0) weeksContainer.appendChild(weekRowEl)
  document.body.appendChild(monthEl)
}
