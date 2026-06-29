import React from 'react';

export default function DatePickerInput({
    value = '',
    onChange,
    className = 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none text-sm',
    placeholder = 'DD/MM/YYYY',
    id,
    required = false,
    disabled = false
}) {
    const pickerId = id || `picker_${Math.random().toString(36).substr(2, 9)}`;

    // Convert YYYY-MM-DD (with optional time) to DD/MM/YYYY
    const formatToDMY = (dateStr) => {
        if (!dateStr) return '';
        const cleanDate = dateStr.substring(0, 10);
        const parts = cleanDate.split('-');
        if (parts.length === 3) {
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
        return dateStr;
    };

    // Convert DD/MM/YYYY to YYYY-MM-DD
    const formatToYMD = (dateStr) => {
        if (!dateStr) return '';
        const parts = dateStr.split('/');
        if (parts.length === 3) {
            return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        return dateStr;
    };

    const handleTextChange = (e) => {
        let clean = e.target.value.replace(/[^0-9/]/g, '').replace(/\/+/g, '/');
        const digits = clean.replace(/\D/g, '');
        let formatted = '';
        if (digits.length > 0) formatted += digits.substring(0, 2);
        if (digits.length > 2) formatted += '/' + digits.substring(2, 4);
        if (digits.length > 4) formatted += '/' + digits.substring(4, 8);

        // Convert back to YMD and propagate
        onChange(formatToYMD(formatted));
    };

    const handlePickerChange = (e) => {
        if (e.target.value) {
            onChange(e.target.value);
        }
    };

    const openPicker = () => {
        if (disabled) return;
        try {
            document.getElementById(pickerId).showPicker();
        } catch (err) {
            document.getElementById(pickerId).focus();
        }
    };

    // Ensure the datepicker value is a valid YYYY-MM-DD or empty
    const validYmdValue = value && /^\d{4}-\d{2}-\d{2}$/.test(value.substring(0, 10)) ? value.substring(0, 10) : '';

    return (
        <div className="relative w-full">
            <input
                type="text"
                maxLength="10"
                placeholder={placeholder}
                value={formatToDMY(value)}
                onChange={handleTextChange}
                className={className}
                required={required}
                disabled={disabled}
                style={{ textTransform: 'none' }}
            />
            <button
                type="button"
                onClick={openPicker}
                disabled={disabled}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#E67E22] transition disabled:opacity-50"
            >
                <i className="fas fa-calendar-alt text-lg"></i>
            </button>
            <input
                type="date"
                id={pickerId}
                value={validYmdValue}
                onChange={handlePickerChange}
                disabled={disabled}
                className="absolute opacity-0 pointer-events-none"
                style={{ width: '1px', height: '1px', padding: 0, margin: 0, border: 0, minWidth: 0, minHeight: 0 }}
            />
        </div>
    );
}
