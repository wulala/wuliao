
/**
 * 获取今天，昨天，前天
 * @param {*} serverDate 服务器时间
 */
const getTYB = (serverDate) => {
    const bigMonth = [1, 3, 5, 7, 8, 10, 12]
    const smallMonth = [4, 6, 9, 11]

    const date = serverDate || new Date()
    const y = date.getFullYear()
    const m = date.getMonth() + 1
    const d = date.getDate()

    const today = `${y}${String(m).padStart(2, '0')}${String(d).padStart(2, '0')}`
    const yestoday = `${y}${String(m).padStart(2, '0')}${String(d - 1).padStart(2, '0')}`
    const beforeYestoday = `${y}${String(m).padStart(2, '0')}${String(d - 2).padStart(2, '0')}`
    if (d == 1) {
        const prevMonth = m - 1
        if (bigMonth.includes(prevMonth)) {
            yestoday = `${y}${String(prevMonth).padStart(2, '0')}31`
            beforeYestoday = `${y}${String(prevMonth).padStart(2, '0')}30`
        }
        if (smallMonth.includes(prevMonth)) {
            yestoday = `${y}${String(prevMonth).padStart(2, '0')}30`
            beforeYestoday = `${y}${String(prevMonth).padStart(2, '0')}29`
        }
    }

    if (d == 2) {
        yestoday = `${y}${String(m).padStart(2, '0')}1`
        const prevMonth = m - 1
        if (bigMonth.includes(prevMonth)) {
            beforeYestoday = `${y}${String(prevMonth).padStart(2, '0')}31`
        }
        if (smallMonth.includes(prevMonth)) {
            beforeYestoday = `${y}${String(prevMonth).padStart(2, '0')}30`
        }
    }

    return [today, yestoday, beforeYestoday]
}

// export {
//     getTYB,
// }


module.exports = {
    getTYB,
}
