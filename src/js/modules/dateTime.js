// массив дней недели
export const weekDayNames = [
    "Воскресенье",
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
];
// массив месяцов
export const monthNames = [
    "Янв",
    "Фев",
    "Мар",
    "Апр",
    "Май",
    "Июн",
    "Июл",
    "Авг",
    "Сен",
    "Окт",
    "Ноя",
    "Дек",
];
// функция для получения даты (день недели, месяц) так же date для получения даты по UTC
export const getDate = function (dateUnix, timezone) {
    const date = new Date((dateUnix + timezone) * 1000);
    const weekDayName = weekDayNames[date.getUTCDay()];
    const monthName = monthNames[date.getUTCMonth()];

    return `${weekDayName}, ${monthName} ${date.getUTCDate()}`;
};
// функция для получения времени принимающая параметр timezone
export const getTime = (timezone) => {
    const offset = -new Date().getTimezoneOffset();
    const timestamp = Date.now() - offset * 60 * 1000;
    const now = new Date(timestamp);
    const timeForTimeZone = new Date(now.getTime() + timezone * 1000);
    const hour = timeForTimeZone.getHours();
    const minutes = timeForTimeZone.getMinutes();

    return `${hour < 10 ? "0" : ""}${hour}:${
        minutes < 10 ? "0" : ""
    }${minutes}`;
};