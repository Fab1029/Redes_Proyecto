import { isPowerOfTwo } from '../utils/utils.js';

export class Hamming {
    /*
        @param:
            frame list: Lista de bits del frame
        @return:
            int: Numero de bits de paridad necesarios para el frame
    */
    getParityBitsCount(frame) {
        let r = 0;
        
        while (frame.length + r + 1 > Math.pow(2, r)) {
            r++;
        }

        return r;
    }

    /*
        @param:
            None
        @return:
            list: Lista de filas de paridad para el bit en la posicion index
    */
    getParityRows(index) {
        let binary_number = index.toString(2).split('').reverse();
    
        let rows = [];
        for (let i = 0; i < binary_number.length; i++) {
            if (binary_number[i] === '1') {
                rows.push(i);
            }
        }

        return rows;
    }

    /*
        @param:
            frame list: Lista de bits del frame
        @return:
            [[]]: Matriz de paridad construida a partir del frame
    */
    buildParityMatrix(frame) {
        let parity_matrix_steps = [];
        const lengthFrame = frame.length;
        const parityBitsCount = this.getParityBitsCount(frame);


        // Inicializar matriz de paridad
        let parity_matrix = Array.from({length: parityBitsCount}, () => 
            Array.from({length: lengthFrame + parityBitsCount}, () => null)
        );
        
        // Llenar la matriz de paridad
        let index_frame = 0;
        for (let j = 0; j < lengthFrame + parityBitsCount; j++) {
            if (isPowerOfTwo(j + 1) === false) {
                // Se agrega el bit a la matriz de paridad
                this.getParityRows(j + 1).forEach((row_index) => {
                    parity_matrix[row_index][j] = frame[index_frame];
                });

                index_frame++;

                // Agregar matrices de pariedad a los steps
                parity_matrix_steps.push(parity_matrix.map(row => row.slice()));

            }
        }

    
        // Calcular los bits de paridad (paridad par, solo contando los 1s)
        parity_matrix.forEach((row, rowIndex) => {
            const parity_bit_position = Math.pow(2, rowIndex) - 1;
            const ones_count = row.filter(bit => bit === '1').length;

            row[parity_bit_position] = (ones_count % 2 === 0) ? '0' : '1';

            // Agregar matrices de pariedad a los steps
            parity_matrix_steps.push(parity_matrix.map(row => row.slice()));

        });

        return {parity_matrix: parity_matrix, steps: parity_matrix_steps};

    }

    /*
        @param:
            parityMatrix [[]]: Matriz de paridad construida a partir del frame
        @return:
            String: Frame de Hamming construido a partir del frame y la matriz de paridad
    */
    buildHammingFrame(frame, parityMatrix) {
        const lengthFrame = frame.length;
        const parityBitsCount = this.getParityBitsCount(frame);

        // Inicializar el frame de Hamming
        let hamming_frame = Array.from({length: lengthFrame + parityBitsCount}, () => null);

        let index_frame = 0;
        let index_row_parity_matrix = 0;

        // Llenar el frame de Hamming con los bits de datos y paridad
        for (let i = 0; i < lengthFrame + parityBitsCount; i++) {
            if (isPowerOfTwo(i + 1)) {
                // Se agrega el bit de paridad
                hamming_frame[i] = parityMatrix[index_row_parity_matrix][i];
                index_row_parity_matrix++;
                
            } else {
                // Se agrega el bit de datos
                hamming_frame[i] = frame[index_frame];
                index_frame++;
            }
        }

        return hamming_frame.join('');

    }

    /*
        @param:
            hamming_frame list: Frame de Hamming construido a partir del frame y la matriz de paridad
            hamming_frame_with_error list: Frame de Hamming con un bit de error
        @return:
            int: Posicion del bit con error en el frame de Hamming
    */
    getPositionErrorBit(hamming_frame, hamming_frame_with_error) {
        let error_position = 0;

        
        for (let i = 0; i < hamming_frame.length; i++) {
            if (isPowerOfTwo(i + 1)) {
                if (hamming_frame[i] !== hamming_frame_with_error[i]) { 
                    error_position += i + 1; 
                }
            }
        }

        return error_position;
    }


}


