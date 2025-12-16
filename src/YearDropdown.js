import { useState, useEffect, useRef } from 'react';

const YearDropdown = ({ onSelect }) => {
    const [dropdownToggled, setDropdownToggled] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handler(e) {
            if (dropdownRef.current) {
                if (!dropdownRef.current.contains(e.target)) {
                    setDropdownToggled(false);
                }
            }
        }

        document.addEventListener('click', handler);

        return () => {
            document.removeEventListener('click', handler);
        }
    })

    const dropdownOptions = [
        {
            id: 0,
            label: "Select Year",
            value: 1,
        },
        {
            id: 1,
            label: 2019,
            value: 2019,
        },
        {
            id: 2,
            label: 2020,
            value: 2020,
        },
        {
            id: 3,
            label: 2021,
            value: 2021,
        },
        {
            id: 4,
            label: 2022,
            value: 2022,
        },
        {
            id: 5,
            label: 2023,
            value: 2023,
        }
    ]

    return (
        <div className='dropdown' ref={dropdownRef}>
            <button className='toggleDropdown' onClick={() => {
                setDropdownToggled(!dropdownToggled);
            }}>
                <span>{selectedOption ? selectedOption.label : "Select Year"}</span>
                <span>{dropdownToggled ? '∧' : '∨'}</span>
            </button>
            <div className={`optionsDropdown ${dropdownToggled ? 'visible' : ''}`}>
                {dropdownOptions.map((o, i) => {
                    return (
                        <button className={`${selectedOption.id === o.id ? 'selected' : ''}`} key={i} onClick={() => {
                            setSelectedOption(o);
                            onSelect(o.value);
                            setDropdownToggled(false);
                        }}>{o.label}</button>
                    )
                })}
            </div>
        </div>
    )
}

export default YearDropdown;