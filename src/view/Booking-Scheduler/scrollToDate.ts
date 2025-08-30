// scrollToDate.ts
export const scrollToDate = (date: Date) => {
    const cell = document.querySelector(`.fc-timeline-slots td[data-date="${date.toLocaleDateString('en-CA')}"]`);
    if (cell) {
        (cell as HTMLElement).scrollIntoView({ behavior: 'smooth', inline: 'center' });
    }
}