export const getFormattedDate = () => {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1
  const currentDay = currentDate.getDate()
  return `${currentYear}-${currentMonth}-${currentDay}`
}

export const getFormattedTime = () => {
  const currentDate = new Date()
  const currentHour = currentDate.getHours()
  const currentMinuteRounded = Math.ceil(currentDate.getMinutes() / 15) * 15
  return `${currentHour}:${currentMinuteRounded}`
}
