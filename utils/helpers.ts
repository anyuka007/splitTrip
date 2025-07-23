export const formatDateForDB = (date: Date): string => {
    return date.toISOString().split('T')[0]; // "2025-07-22"
};

// Format date for display
    export const formatDateForDisplay = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };
