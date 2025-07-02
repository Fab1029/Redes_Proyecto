/*
    @param:
        frame list: Lista de bits del frame
    @return:
        frame list: Lista de bits del frame
*/
export function setRandomErrorBit(frame) {
    let frame_copy = [...frame]; 

    let error_bit = Math.floor(Math.random() * frame_copy.length);
    frame_copy[error_bit] = frame_copy[error_bit] === '0' ? '1' : '0';
    return frame_copy.join('');
};

/*
    @param:
        n int: Numero de bits del frame
    @return:
        None
*/
export function isPowerOfTwo(n) {
    return Number.isInteger(Math.log2(n));
};

/*
    @param:
        a char: Primer bit
        b char: Segundo bit
    @return:
        char: Resultado de la operacion XOR entre a y b
*/
export function XOR(a, b) {
    return a === b ? '0' : '1';
}

/*
    @const:
        CRC_POLYNOMIALS: Objeto que contiene los polinomios de CRC para diferentes longitudes
*/
export const CRC_POLYNOMIALS = {
    3:  '1011',
    4:  '10011',
    5:  '101001',
    6:  '1000011',
    7:  '10001001',
    8:  '100000111',
    16: '11000000000000101',
    32: '100000100110000010001110110110111' 
};