import React from 'react';

const levelColorMapping = {
    1: { type: 'solid', color: '#5a968a' },
    5: { type: 'solid', color: '#5c78a0' },
    10: { type: 'solid', color: '#8a7ea3' },
    15: { type: 'solid', color: '#bb6684' },
    22: { type: 'gradient', gradient: 'linear-gradient(90deg, #20534c, #559886)' },
    26: { type: 'gradient', gradient: 'linear-gradient(90deg, #0a1956, #607ce4)' },
    30: { type: 'gradient', gradient: 'linear-gradient(90deg, #301957, #7464c8)' },
    34: { type: 'gradient', gradient: 'linear-gradient(90deg, #801539, #c35882)' },
    38: { type: 'gradient', gradient: 'linear-gradient(90deg, #f67019, #f8a558)' },
};

function getColorByLevel(level, colorTable) {
    const keys = Object.keys(colorTable)
        .map(Number)
        .sort((a, b) => a - b);

    let selectedKey = keys[0];
    for (let i = 0; i < keys.length; i++) {
        if (level >= keys[i]) {
            selectedKey = keys[i];
        } else {
            break;
        }
    }
    return colorTable[selectedKey];
}


const FanBadge = ({ name, level }) => {
    const colorInfo = getColorByLevel(level, levelColorMapping);
    const bgStyle =
        colorInfo.type === 'gradient'
            ? { backgroundImage: colorInfo.gradient }
            : { backgroundColor: colorInfo.color };

    return (
        <div
            className="inline-flex items-center rounded-full overflow-hidden px-1 h-5"
            style={bgStyle}
        >
            <span className="text-white font-medium text-sm pl-1 pr-1 whitespace-nowrap">
                {name}
            </span>
            <div className="bg-white rounded-full py-[2px] flex items-center justify-center min-w-[24px] h-4">
                <span className="text-gray-800 font-semibold text-xs">
                    {level}
                </span>
            </div>
        </div>
    );
};

export default FanBadge;
