import { useState, useEffect, useRef } from 'react';

const DriverDropdown = ({ dropdownOptions, onSelect }) => {
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

    return (
        <div className='dropdown' ref={dropdownRef}>
            <button className='toggleDropdown' onClick={() => {
                setDropdownToggled(!dropdownToggled);
            }}>
                <span>{selectedOption ? selectedOption.label : "Select Driver"}</span>
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

export default DriverDropdown;