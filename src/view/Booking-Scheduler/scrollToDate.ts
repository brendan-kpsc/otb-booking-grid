// scrollToDate.ts
export const scrollToDate = (date: Date) => {
    const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
        .replace(/-(\d)-/, '-0$1-');
    const cell = document.querySelector(`.fc-timeline-slots td[data-date="${dateString}"]`);
    if (cell) {
        (cell as HTMLElement).scrollIntoView({ behavior: 'smooth', inline: 'center' });
    }
}