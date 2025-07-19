// SC价值映射
const scColorMapping = {
    low: { bg: '#BBDEFB', color: '#0D47A1', border: '#2196F3' },        // 30SC 蓝色
    medium: { bg: '#FFF8E1', color: '#E65100', border: '#FFC107' },     // 50SC 金色 
    high: { bg: '#FFCDD2', color: '#B71C1C', border: '#F44336' },       // 100SC 红色
};

export const getSCStyle = (scValue) => {
    if (!scValue) return null;
    
    // 提取数字部分，支持"50SC"、"50"等格式
    const scMatch = scValue.toString().match(/\d+/);
    if (!scMatch) return null;
    
    const scNumber = parseInt(scMatch[0]);
    if (isNaN(scNumber)) {
        return null;
    } else if (scNumber < 50) {
        return scColorMapping.low;
    } else if (scNumber >= 50 && scNumber < 100) {
        return scColorMapping.medium;
    } else {
        return scColorMapping.high;
    }
};
