const formatNumber = n => {
    const newN = n.toString()

    return newN[1] ? newN : `0${newN}`
}

const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return `${[year, month, day].map(formatNumber).join('-')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const isToday = str => {
    const todayNum = (new Date).getDate()
    const diffDayNum = new Date(str).getDate()
    return todayNum === diffDayNum
}

const tip = () => {
    const tips = ['你的气质里，藏着你\n走过的路、爱过的人、读过的书。',
        '读书的意义是\n使人虚心，通达，不固陋，不偏执。',
        '书中未必有黄金屋，\n但一定有更好的自己、更多的选择。',
        '脚步丈量不到的地方，文字可以、\n眼睛到不了的地方，文字可以。',
        '有诗和远方的人，生活才不会寂寞。',
        '人生没有白读的书，每一页都算数。',
        '迷茫时，为你点亮一盏灯，\n明白世界，看清自己。',
        '别抱怨读书苦，那是你去看世界的路。',
        '读书，就是让自己变得辽阔的过程。']

    return tips[Math.floor(Math.random() * 9)]
}

module.exports = {
    formatTime,
    isToday,
    tip,
}
