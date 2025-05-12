import React from 'react';

const TodayBtn = ({ onClick }) => {
    return (
        <button onClick={onClick} className="today-btn">
            Today
        </button>
    );
};

export default TodayBtn;