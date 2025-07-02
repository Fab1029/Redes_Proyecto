import { XOR, CRC_POLYNOMIALS } from "../utils/utils.js";

export class CRC {
    
    /*
        @param:
            frame list: Lista de bits del frame
            polynomial list: Lista de bits del polinomio generador
        @return:
            frame_bits string: String del cociente de la division entre el frame y el polinomio
    */
    getQuotient(frame, polynomial) {
        let frame_bits = [];

        for (let i = 0; i < frame.length; i++) {
            frame_bits.push(frame[i]); 

            if(parseInt(frame_bits.join(''), 2) >= parseInt(polynomial.join(''), 2)) {
                
                let cociente = [];
                for(let j = 0; j < polynomial.length; j++) {
                    cociente.push(XOR(frame_bits[j], polynomial[j]));
                }
                
                // Elimnar ceros a la izquierda
                while(cociente[0] === '0') {
                    cociente.shift();
                }

                frame_bits = cociente;
            }
        }

        return frame_bits.join('');

    }
    
    /*
        @param:
            frame list: Lista de bits del frame
            polynomial list: Lista de bits del polinomio generador
        @return:
            frame_bits string: Trama de transmision con el CRC agregado al final
    */
    buidFrameTransmission(frame, polynomial) { 
        let frame_with_zeros = frame.slice();

        // Agregar ceros al final del frame
        for(let i = 0; i < polynomial.length - 1; i++) {
            frame_with_zeros.push('0'); 
        }
        
        return frame.join('') + this.getQuotient(frame_with_zeros, polynomial);
    }

    /*
        @param:
            frame string: frame
        @return:
            polynomial string: Polinomio generador que se utiliza para calcular el CRC
    */
    getCRCPolynomial(frame) {        
        for (const[length, polynomial] of Object.entries(CRC_POLYNOMIALS)) {
            if (frame.length > length) {
                const frame_transmited = this.buidFrameTransmission(frame.split(''), polynomial.split(''));
                const quotient = this.getQuotient(frame_transmited.split(''), polynomial.split(''));

                if (parseInt(quotient.join(''), 10) === 0) {
                    return polynomial;
                }
            }
        }
        
        return null;
        
    }

}
