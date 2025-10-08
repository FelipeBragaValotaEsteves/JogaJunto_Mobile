export function formatDateTime(data: string, hora: string): { time: string; formattedDate: string } {
    let dateObj: Date;
    const onlyDate = data.split('T')[0];
    const [year, month, day] = onlyDate.split('-').map(Number);
    dateObj = new Date(year, month - 1, day);

    const time = hora.slice(0, 5);
    let dayOfWeek = dateObj.toLocaleDateString('pt-BR', { weekday: 'long' });
    dayOfWeek = dayOfWeek.replace('-feira', '');
    dayOfWeek = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
    const monthExtenso = dateObj.toLocaleDateString('pt-BR', { month: 'long' });
    return { time, formattedDate: `${dayOfWeek}, ${day} de ${monthExtenso}` };
}